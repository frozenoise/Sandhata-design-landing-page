"use client";

import React from "react";
import "../_docs/docs.css";
import "./builder.css";
import { SdTopNav } from "../_docs/shell";
import { RenderTree, treeToJSX, type UINode } from "./Renderer";

const EXAMPLES = [
  "A login form with email, password, remember me, and a primary sign-in button",
  "A pricing section with three plan cards and a recommended badge",
  "A settings panel with profile fields, notification switches, and save/cancel",
  "A dashboard header with three stat cards and a status alert",
];

const KEY_STORAGE = "sd-builder-api-key";

export default function BuilderPage() {
  const [prompt, setPrompt] = React.useState("");
  const [tree, setTree] = React.useState<UINode | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [needsKey, setNeedsKey] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [keyDraft, setKeyDraft] = React.useState("");
  const [view, setView] = React.useState<"preview" | "code">("preview");

  React.useEffect(() => {
    const saved = window.localStorage.getItem(KEY_STORAGE) || "";
    setApiKey(saved);
    setKeyDraft(saved);
  }, []);

  function saveKey(key: string) {
    const trimmed = key.trim();
    setApiKey(trimmed);
    setKeyDraft(trimmed);
    if (trimmed) window.localStorage.setItem(KEY_STORAGE, trimmed);
    else window.localStorage.removeItem(KEY_STORAGE);
  }

  async function generate(p?: string) {
    const text = (p ?? prompt).trim();
    if (!text || loading) return;
    setPrompt(text);
    setLoading(true);
    setError(null);
    setNeedsKey(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, apiKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Generation failed");
        setNeedsKey(data.error === "missing_key" || data.error === "invalid_key");
        setTree(null);
      } else { setTree(data.tree); setView("preview"); }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  const code = tree
    ? `import {\n  /* … */\n} from "sandhata-ui";\n\nexport default function Generated() {\n  return (\n${treeToJSX(tree, 2)}\n  );\n}`
    : "";

  return (
    <div className="doc-root">
      <SdTopNav active="Builder" />
      <div className="bld">
        {/* Left: prompt */}
        <aside className="bld-side">
          <div className="bld-eyebrow">Create with AI</div>
          <h1 className="bld-title">Describe an interface</h1>
          <p className="bld-sub">
            Describe what you want and it&apos;s generated live from Sandhata
            components — then copy the code.
          </p>

          <textarea
            className="bld-input"
            placeholder="e.g. a login form with remember me"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate(); }}
            rows={4}
          />
          <button className="bld-go" onClick={() => generate()} disabled={loading || !prompt.trim()}>
            {loading ? "Generating…" : "Generate interface"}
          </button>
          <div className="bld-hint">⌘/Ctrl + Enter to generate</div>

          <div className="bld-examples">
            <div className="bld-examples-label">Try one</div>
            {EXAMPLES.map((ex) => (
              <button key={ex} className="bld-chip" onClick={() => generate(ex)} disabled={loading}>
                {ex}
              </button>
            ))}
          </div>

          <div className="bld-keybox">
            <div className="bld-examples-label">Your Anthropic API key</div>
            <p className="bld-hint" style={{ textAlign: "left", margin: "0 0 10px" }}>
              Used only for this request, never stored on our server — kept in your
              browser&apos;s local storage.{" "}
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
                Get an API key
              </a>
            </p>
            <input
              className="bld-key-input"
              type="password"
              placeholder="sk-ant-…"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              onBlur={() => saveKey(keyDraft)}
              onKeyDown={(e) => { if (e.key === "Enter") saveKey(keyDraft); }}
            />
            {apiKey && (
              <button className="bld-key-clear" onClick={() => saveKey("")}>
                Clear saved key
              </button>
            )}
          </div>
        </aside>

        {/* Right: preview / code */}
        <main className="bld-main">
          <div className="bld-toolbar">
            <div className="bld-tabs">
              <button className={view === "preview" ? "on" : ""} onClick={() => setView("preview")}>Preview</button>
              <button className={view === "code" ? "on" : ""} onClick={() => setView("code")} disabled={!tree}>Code</button>
            </div>
            {tree && view === "code" && (
              <button className="bld-copy" onClick={() => navigator.clipboard.writeText(code)}>Copy</button>
            )}
          </div>

          <div className="bld-canvas">
            {loading && <div className="bld-state"><div className="bld-spinner" /><span>Generating your interface…</span></div>}
            {!loading && error && (
              <div className="bld-state bld-error">
                <strong>{needsKey ? "API key needed" : "Couldn't generate"}</strong>
                <span>{error}</span>
                {needsKey && (
                  <div className="bld-key-inline">
                    <input
                      className="bld-key-input"
                      type="password"
                      placeholder="sk-ant-…"
                      value={keyDraft}
                      onChange={(e) => setKeyDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { saveKey(keyDraft); generate(); } }}
                      autoFocus
                    />
                    <button className="bld-go" onClick={() => { saveKey(keyDraft); generate(); }} disabled={!keyDraft.trim()}>
                      Save &amp; retry
                    </button>
                    <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="bld-hint">
                      Get an API key
                    </a>
                  </div>
                )}
              </div>
            )}
            {!loading && !error && !tree && (
              <div className="bld-state bld-empty">
                <span>Your generated interface will appear here.</span>
              </div>
            )}
            {!loading && !error && tree && (
              view === "preview"
                ? <div className="bld-surface"><RenderTree tree={tree} /></div>
                : <pre className="bld-code">{code}</pre>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
