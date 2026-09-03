// GitHub App integration — server-only helpers.
//
// This is a *separate* auth surface from lib/auth.ts's GitHubProvider, which
// is wired for login only (no `repo` scope) and must stay that way — see
// CLAUDE.md. A GitHub App gives us installation-scoped tokens (minted
// on-demand, never stored) with exactly the `contents: write` + `metadata:
// read` permissions the push flow needs, instead of broadening a user's
// login OAuth grant.
//
// The app itself has to be registered by a human at
// github.com/settings/apps/new (Repository permissions: Contents: Read &
// write, Metadata: Read-only) — see readme note in .env.local.example for
// the exact env vars this expects. Until that happens, isGitHubAppConfigured()
// returns false and every API route under app/api/github/** short-circuits
// with a clear "github_app_not_configured" response instead of throwing.
import crypto from "crypto";
import { App } from "octokit";
import type { Octokit } from "octokit";

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v : undefined;
}

/** Required to mint installation tokens at all. CLIENT_ID/SECRET are only
 *  needed for user-to-server OAuth flows we don't use in Phase 1, so they're
 *  not part of the "configured" gate — but still read from env when present. */
export function isGitHubAppConfigured(): boolean {
  return !!(env("GITHUB_APP_ID") && env("GITHUB_APP_PRIVATE_KEY") && env("GITHUB_APP_SLUG"));
}

export function githubAppSlug(): string | undefined {
  return env("GITHUB_APP_SLUG");
}

// GitHub App private keys are PEM blocks; env vars (especially on Vercel)
// commonly need literal "\n" escapes since a real newline can't survive a
// single-line env value. Unescape only when the raw value doesn't already
// contain real newlines.
function privateKey(): string {
  const raw = env("GITHUB_APP_PRIVATE_KEY") || "";
  return raw.includes("\\n") && !raw.includes("\n") ? raw.replace(/\\n/g, "\n") : raw;
}

let appSingleton: App | null = null;

/** App-level client, JWT-authenticated as the App itself (not an installation).
 *  Used for install-callback verification (looking up an installation by id). */
export function getApp(): App {
  if (!isGitHubAppConfigured()) {
    throw new Error("GitHub App is not configured — check GITHUB_APP_ID / GITHUB_APP_PRIVATE_KEY / GITHUB_APP_SLUG");
  }
  if (!appSingleton) {
    const clientId = env("GITHUB_APP_CLIENT_ID");
    const clientSecret = env("GITHUB_APP_CLIENT_SECRET");
    appSingleton = new App({
      appId: env("GITHUB_APP_ID")!,
      privateKey: privateKey(),
      // oauth is only used for user-to-server flows (not part of Phase 1's
      // installation-token push path) — omit rather than pass partial/empty
      // creds, since @octokit/app's type requires both fields when present.
      ...(clientId && clientSecret ? { oauth: { clientId, clientSecret } } : {}),
    });
  }
  return appSingleton;
}

/** Installation-scoped client — mints a short-lived installation access
 *  token on demand via @octokit/auth-app under the hood. Never persisted:
 *  each request re-derives it from the App's JWT-signed credentials. */
export async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  return (await getApp().getInstallationOctokit(installationId)) as unknown as Octokit;
}

/** Look up an installation's account (login/type) by id, JWT-authenticated
 *  as the App itself — used by the install callback to verify the
 *  `installation_id` GitHub redirected back with actually belongs to this App. */
export async function getInstallationAccount(
  installationId: number
): Promise<{ login: string; type: string } | null> {
  const { data } = await getApp().octokit.request("GET /app/installations/{installation_id}", {
    installation_id: installationId,
  });
  const account = data.account as any;
  if (!account) return null;
  // Bots/orgs use `login`; the very rare "Enterprise" account object doesn't —
  // fall back to slug/name so we never store an empty accountLogin.
  return { login: account.login ?? account.slug ?? account.name ?? String(account.id), type: account.type ?? "Organization" };
}

// ── CSRF state for the /install → github.com → /install/callback round trip ──
// Self-contained signed token (HMAC-SHA256, keyed off BUILDER_KEY_SECRET —
// the same at-rest-secret pattern lib/crypto.ts already establishes for this
// app) instead of a short-lived DB row: nothing to garbage-collect, and the
// callback has everything it needs without a lookup. Binds the state to the
// initiating user (so the callback can't be replayed for a different
// account) and, optionally, the project the user was trying to connect —
// letting the callback redirect straight back into that project's repo
// picker instead of dropping the user at a generic "connected" screen.
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes — this is a redirect round trip, not a session

function stateKey(): Buffer {
  const secret = process.env.BUILDER_KEY_SECRET;
  if (!secret) {
    throw new Error("BUILDER_KEY_SECRET is not set — required to sign the GitHub install state param.");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

export type InstallState = { userId: string; projectId?: string; ts: number };

export function signInstallState(userId: string, projectId?: string): string {
  const payload: InstallState = { userId, projectId, ts: Date.now() };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", stateKey()).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyInstallState(state: string | null | undefined): InstallState | null {
  if (!state) return null;
  const [payloadB64, sig] = state.split(".");
  if (!payloadB64 || !sig) return null;

  const expected = crypto.createHmac("sha256", stateKey()).update(payloadB64).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as InstallState;
    if (!payload.userId || typeof payload.ts !== "number") return null;
    if (Date.now() - payload.ts > STATE_TTL_MS) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Misc helpers shared by the push/connect routes ───────────────────────
export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  );
}
