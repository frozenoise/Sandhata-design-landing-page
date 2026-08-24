// Symmetric encryption for secrets we store at rest (currently: a user's
// BYO Anthropic API key on User.apiKeyEnc). AES-256-GCM, key derived from
// BUILDER_KEY_SECRET so the env var doesn't need to be an exact-length key.
import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const secret = process.env.BUILDER_KEY_SECRET;
  if (!secret) {
    throw new Error(
      "BUILDER_KEY_SECRET is not set — required to store account-linked API keys. Add it to .env.local (any random string; e.g. `openssl rand -hex 32`)."
    );
  }
  return crypto.createHash("sha256").update(secret).digest(); // 32 bytes
}

// "<iv>:<authTag>:<ciphertext>", each hex-encoded.
export function encryptSecret(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), ciphertext.toString("hex")].join(":");
}

export function decryptSecret(payload: string): string {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  if (!ivHex || !tagHex || !dataHex) throw new Error("Malformed encrypted payload");
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return plaintext.toString("utf8");
}
