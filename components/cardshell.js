/* Sandhata DS — shared "Preview / Code" card shell for @dsCard component cards.
   Plain JS (no JSX) so it loads via a normal <script src> before Babel.
   Usage in a card:  <window.CardShell code={htmlString}> …preview… </window.CardShell>
   `code` is an HTML string; wrap tokens in <span class="t|p|s"> for colour. */
(function () {
  // Inject the shell styles once.
  var css = `
  body { margin: 0; padding: 0; background: var(--surface-page); }
  .card-shell { border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
  .shell-tabs { display: flex; gap: 2px; padding: 8px 12px; border-bottom: 1px solid var(--border-subtle); background: var(--surface-secondary); }
  .shell-tabs button { height: 28px; padding: 0 12px; border: none; border-radius: var(--radius-sm); cursor: pointer; background: transparent; font: var(--body-small-size)/1 var(--font-normal); color: var(--text-caption); display: inline-flex; align-items: center; gap: 6px; }
  .shell-tabs button.on { background: var(--surface-raised); color: var(--text-title); font-family: var(--font-bold); font-weight: 700; box-shadow: var(--shadow-xs); }
  .shell-body { padding: 24px; }
  pre.code { margin: 0; padding: 20px 24px; background: var(--colour-neutral-950); color: var(--colour-neutral-100); font: 12.5px/1.7 var(--font-mono); overflow: auto; white-space: pre; }
  pre.code .t { color: var(--colour-secondarycyan-300); }
  pre.code .p { color: var(--colour-alternativepurple-300); }
  pre.code .s { color: var(--colour-success-300); }`;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var h = function () { return window.React.createElement.apply(null, arguments); };

  function Icon(d) {
    return h("svg", { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", dangerouslySetInnerHTML: { __html: d } });
  }
  var EYE = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>';
  var CODE = '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>';

  window.CardShell = function (props) {
    var R = window.React;
    var st = R.useState("preview");
    var tab = st[0], setTab = st[1];
    function btn(key, label, icon) {
      return h("button", { className: tab === key ? "on" : "", onClick: function () { setTab(key); } }, Icon(icon), " " + label);
    }
    return h("div", { className: "card-shell" },
      h("div", { className: "shell-tabs" }, btn("preview", "Preview", EYE), btn("code", "Code", CODE)),
      tab === "preview"
        ? h("div", { className: "shell-body" }, props.children)
        : h("pre", { className: "code", dangerouslySetInnerHTML: { __html: props.code } })
    );
  };
})();
