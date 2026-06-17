/* @ds-bundle: {"format":3,"namespace":"SandhataDesignSystem_081a0e","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"StatCard","sourcePath":"components/data-display/StatCard.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"fa5f5b16b47d","components/buttons/IconButton.jsx":"5449b352551b","components/cardshell.js":"454842022dbd","components/data-display/Avatar.jsx":"09d8312a7c81","components/data-display/Badge.jsx":"2f294ac9b0f5","components/data-display/Card.jsx":"7d4baf5fde73","components/data-display/StatCard.jsx":"379a5a51c843","components/data-display/Tag.jsx":"59613c506dc9","components/feedback/Alert.jsx":"eedb7a93c08d","components/feedback/Spinner.jsx":"3b362fe57373","components/feedback/Tooltip.jsx":"a83fbcbc4bb2","components/forms/Checkbox.jsx":"42e573ed9def","components/forms/Input.jsx":"daabd9e2a69a","components/forms/Radio.jsx":"ce88285ed7a6","components/forms/Select.jsx":"260db81c38ad","components/forms/Switch.jsx":"6c6e12561cd8","components/forms/Textarea.jsx":"e2e1fd28a3a0","components/navigation/Tabs.jsx":"a9385edeceef","docs/DocsApp.jsx":"80a983296ce3","docs/DocsData.jsx":"2e41aac078ef","docs/DocsShell.jsx":"275fcf061873","docs/DocumentationApp.jsx":"dcd9710ea0ec","docs/DocumentationData.jsx":"9b8a4041dbc1","docs/highlight.js":"0b6a195b2b24","motion/IntroApp.jsx":"f4067572ef6e","motion/IntroScenes1.jsx":"1c049e984a78","motion/IntroScenes2.jsx":"d68c99de13d6","motion/animations.jsx":"ebe6809a6cbe","ui_kits/showcase/Charts.jsx":"5fa65f42c3b8","ui_kits/showcase/Chrome.jsx":"4bd8c99ec02e","ui_kits/showcase/DashboardView.jsx":"a80c8ab1843a","ui_kits/showcase/DataTable.jsx":"f97820d28d3b","ui_kits/showcase/FormsView.jsx":"be973f8c29f0","ui_kits/showcase/ProductCardsView.jsx":"59d5e4783d6d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SandhataDesignSystem_081a0e = window.SandhataDesignSystem_081a0e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sandhata Button — the primary interactive control.
 * Hierarchies map to the Figma button set: primary (royal blue),
 * secondary (tinted), tertiary (ghost), inverse (dark) and danger (red).
 */
function Button({
  children,
  hierarchy = "primary",
  size = "medium",
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  style = {},
  ...rest
}) {
  const sizes = {
    small: {
      height: 32,
      padding: "0 12px",
      font: "var(--body-small-size)",
      gap: 6
    },
    medium: {
      height: 40,
      padding: "0 16px",
      font: "var(--body-medium-size)",
      gap: 8
    },
    large: {
      height: 48,
      padding: "0 24px",
      font: "var(--body-large-size)",
      gap: 8
    }
  };
  const palettes = {
    primary: {
      "--bg": "var(--colour-primaryblue-500)",
      "--bg-hover": "var(--colour-primaryblue-700)",
      "--fg": "var(--colour-neutral-0)",
      "--bd": "transparent"
    },
    secondary: {
      "--bg": "var(--colour-primaryblue-50)",
      "--bg-hover": "var(--colour-primaryblue-100)",
      "--fg": "var(--colour-primaryblue-600)",
      "--bd": "transparent"
    },
    tertiary: {
      "--bg": "transparent",
      "--bg-hover": "var(--colour-neutral-100)",
      "--fg": "var(--colour-neutral-800)",
      "--bd": "var(--colour-neutral-300)"
    },
    inverse: {
      "--bg": "var(--colour-neutral-900)",
      "--bg-hover": "var(--colour-neutral-700)",
      "--fg": "var(--colour-neutral-0)",
      "--bd": "transparent"
    },
    danger: {
      "--bg": "var(--colour-error-500)",
      "--bg-hover": "var(--colour-error-700)",
      "--fg": "var(--colour-neutral-0)",
      "--bd": "transparent"
    },
    ghost: {
      "--bg": "transparent",
      "--bg-hover": "var(--colour-neutral-100)",
      "--fg": "var(--colour-primaryblue-600)",
      "--bd": "transparent"
    }
  };
  const s = sizes[size] || sizes.medium;
  const p = palettes[hierarchy] || palettes.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      ...p,
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : "auto",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontFamily: "var(--font-normal)",
      fontSize: s.font,
      lineHeight: 1,
      fontWeight: 400,
      color: "var(--fg)",
      background: "var(--bg)",
      border: "1px solid var(--bd)",
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast)",
      whiteSpace: "nowrap",
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = "var(--bg-hover)";
    },
    onMouseLeave: e => {
      if (!disabled) e.currentTarget.style.background = "var(--bg)";
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexShrink: 0
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexShrink: 0
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sandhata IconButton — a square button holding a single icon.
 * Same hierarchies as Button. Sizes keep a 40px hit target by default.
 */
function IconButton({
  icon,
  hierarchy = "tertiary",
  size = "medium",
  disabled = false,
  ariaLabel,
  style = {},
  ...rest
}) {
  const dims = {
    small: 32,
    medium: 40,
    large: 48
  };
  const palettes = {
    primary: {
      bg: "var(--colour-primaryblue-500)",
      hover: "var(--colour-primaryblue-700)",
      fg: "var(--colour-neutral-0)",
      bd: "transparent"
    },
    secondary: {
      bg: "var(--colour-primaryblue-50)",
      hover: "var(--colour-primaryblue-100)",
      fg: "var(--colour-primaryblue-600)",
      bd: "transparent"
    },
    tertiary: {
      bg: "transparent",
      hover: "var(--colour-neutral-100)",
      fg: "var(--colour-neutral-700)",
      bd: "var(--colour-neutral-300)"
    },
    ghost: {
      bg: "transparent",
      hover: "var(--colour-neutral-100)",
      fg: "var(--colour-neutral-700)",
      bd: "transparent"
    },
    danger: {
      bg: "transparent",
      hover: "var(--colour-error-50)",
      fg: "var(--colour-error-500)",
      bd: "transparent"
    }
  };
  const d = dims[size] || 40;
  const p = palettes[hierarchy] || palettes.tertiary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: d,
      height: d,
      color: p.fg,
      background: p.bg,
      border: `1px solid ${p.bd}`,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--duration-fast) var(--ease-standard)",
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = p.hover;
    },
    onMouseLeave: e => {
      if (!disabled) e.currentTarget.style.background = p.bg;
    }
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/cardshell.js
try { (() => {
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
  var h = function () {
    return window.React.createElement.apply(null, arguments);
  };
  function Icon(d) {
    return h("svg", {
      width: 13,
      height: 13,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      dangerouslySetInnerHTML: {
        __html: d
      }
    });
  }
  var EYE = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>';
  var CODE = '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>';
  window.CardShell = function (props) {
    var R = window.React;
    var st = R.useState("preview");
    var tab = st[0],
      setTab = st[1];
    function btn(key, label, icon) {
      return h("button", {
        className: tab === key ? "on" : "",
        onClick: function () {
          setTab(key);
        }
      }, Icon(icon), " " + label);
    }
    return h("div", {
      className: "card-shell"
    }, h("div", {
      className: "shell-tabs"
    }, btn("preview", "Preview", EYE), btn("code", "Code", CODE)), tab === "preview" ? h("div", {
      className: "shell-body"
    }, props.children) : h("pre", {
      className: "code",
      dangerouslySetInnerHTML: {
        __html: props.code
      }
    }));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cardshell.js", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
/** Avatar — circular user marker. Shows `src` image or `name` initials. */
function Avatar({
  name = "",
  src,
  size = 36,
  tone = "action",
  style = {}
}) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const tones = {
    action: {
      bg: "var(--colour-primaryblue-100)",
      fg: "var(--colour-primaryblue-700)"
    },
    purple: {
      bg: "var(--colour-alternativepurple-100)",
      fg: "var(--colour-alternativepurple-600)"
    },
    neutral: {
      bg: "var(--colour-neutral-200)",
      fg: "var(--colour-neutral-700)"
    }
  };
  const t = tones[tone] || tones.action;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      overflow: "hidden",
      background: t.bg,
      color: t.fg,
      flexShrink: 0,
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: size * 0.36,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/**
 * Status Badge — small status pill. Tones map to the semantic palette.
 * `variant="subtle"` (default) uses a tinted background; "solid" fills.
 */
function Badge({
  children,
  tone = "neutral",
  variant = "subtle",
  dot = false,
  style = {}
}) {
  const tones = {
    neutral: {
      subtleBg: "var(--colour-neutral-100)",
      subtleFg: "var(--colour-neutral-700)",
      solidBg: "var(--colour-neutral-700)"
    },
    info: {
      subtleBg: "var(--colour-info-50)",
      subtleFg: "var(--colour-info-700)",
      solidBg: "var(--colour-info-500)"
    },
    success: {
      subtleBg: "var(--colour-success-50)",
      subtleFg: "var(--colour-success-700)",
      solidBg: "var(--colour-success-500)"
    },
    warning: {
      subtleBg: "var(--colour-alert-50)",
      subtleFg: "var(--colour-alert-700)",
      solidBg: "var(--colour-alert-500)"
    },
    error: {
      subtleBg: "var(--colour-error-50)",
      subtleFg: "var(--colour-error-700)",
      solidBg: "var(--colour-error-500)"
    },
    action: {
      subtleBg: "var(--colour-primaryblue-50)",
      subtleFg: "var(--colour-primaryblue-600)",
      solidBg: "var(--colour-primaryblue-500)"
    },
    highlight: {
      subtleBg: "var(--colour-alternativepurple-50)",
      subtleFg: "var(--colour-alternativepurple-600)",
      solidBg: "var(--colour-alternativepurple-500)"
    }
  };
  const t = tones[tone] || tones.neutral;
  const solid = variant === "solid";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 22,
      padding: "0 8px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-normal)",
      fontSize: "var(--caption-size)",
      lineHeight: 1,
      letterSpacing: "var(--caption-tracking)",
      background: solid ? t.solidBg : t.subtleBg,
      color: solid ? "var(--colour-neutral-0)" : t.subtleFg,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: solid ? "var(--colour-neutral-0)" : t.solidBg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sandhata Card — the base surface for grouped content. White layer,
 * subtle border, small radius and a faint shadow. Optional title /
 * subtitle header and a trailing `action` slot.
 */
function Card({
  title,
  subtitle,
  action,
  children,
  padding = 24,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-raised)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
      ...style
    }
  }, rest), (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
      padding: `${padding}px ${padding}px 0`
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    className: "sd-h2",
    style: {
      fontFamily: "var(--font-bold)",
      fontSize: "var(--heading-h2-size)",
      lineHeight: "var(--heading-h2-line)",
      color: "var(--text-title)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: "var(--body-medium-size)",
      color: "var(--text-caption)"
    }
  }, subtitle)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatCard.jsx
try { (() => {
/**
 * StatCard — a KPI tile: label, large value and an optional trend.
 * Used across the Sandhata dashboard (e.g. Desktop / Mobile visitors).
 */
function StatCard({
  label,
  value,
  trend,
  trendDirection = "up",
  style = {}
}) {
  const up = trendDirection === "up";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      padding: 20,
      minWidth: 140,
      background: "var(--surface-raised)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: "var(--body-medium-size)",
      color: "var(--text-caption)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: "var(--display-small-size)",
      lineHeight: 1.1,
      color: "var(--text-title)"
    }
  }, value), trend && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-small-size)",
      color: up ? "var(--text-success)" : "var(--text-error)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: up ? "none" : "scaleY(-1)"
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 17 9 11 13 15 21 7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 7 21 7 21 14"
  })), trend));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
/** Tag / chip — a removable label. Pass `onRemove` to show the × button. */
function Tag({
  children,
  onRemove,
  tone = "neutral",
  style = {}
}) {
  const tones = {
    neutral: {
      bg: "var(--colour-neutral-100)",
      fg: "var(--colour-neutral-800)",
      bd: "var(--colour-neutral-200)"
    },
    action: {
      bg: "var(--colour-primaryblue-50)",
      fg: "var(--colour-primaryblue-700)",
      bd: "var(--colour-primaryblue-100)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: onRemove ? "0 6px 0 10px" : "0 10px",
      borderRadius: "var(--radius-sm)",
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-small-size)",
      lineHeight: 1,
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 16,
      height: 16,
      padding: 0,
      border: "none",
      background: "transparent",
      color: "inherit",
      cursor: "pointer",
      borderRadius: "var(--radius-xs)",
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
/** Inline Alert / banner. Tone sets the colour and default icon. */
function Alert({
  tone = "info",
  title,
  children,
  onClose,
  style = {}
}) {
  const tones = {
    info: {
      bg: "var(--colour-info-50)",
      bd: "var(--colour-info-200)",
      fg: "var(--colour-info-700)",
      icon: "info"
    },
    success: {
      bg: "var(--colour-success-50)",
      bd: "var(--colour-success-200)",
      fg: "var(--colour-success-700)",
      icon: "check"
    },
    warning: {
      bg: "var(--colour-alert-50)",
      bd: "var(--colour-alert-300)",
      fg: "var(--colour-alert-700)",
      icon: "warn"
    },
    error: {
      bg: "var(--colour-error-50)",
      bd: "var(--colour-error-200)",
      fg: "var(--colour-error-700)",
      icon: "warn"
    }
  };
  const t = tones[tone] || tones.info;
  const paths = {
    info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })),
    check: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "8 12 11 15 16 9"
    })),
    warn: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    }))
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: "flex",
      gap: 12,
      padding: "12px 14px",
      background: t.bg,
      border: `1px solid ${t.bd}`,
      borderRadius: "var(--radius-md)",
      color: "var(--text-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: t.fg,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }, paths[t.icon]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: "var(--body-medium-size)",
      color: t.fg,
      marginBottom: children ? 2 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      color: "var(--text-subtitle)"
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--icon-secondary)",
      padding: 0,
      height: 20
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Spinner.jsx
try { (() => {
/** Spinner — indeterminate loading indicator in brand blue. */
function Spinner({
  size = 20,
  stroke = 2.5,
  color = "var(--colour-primaryblue-500)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: {
      animation: "sd-spin 0.7s linear infinite",
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes sd-spin { to { transform: rotate(360deg); } }`), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    fill: "none",
    stroke: "var(--colour-neutral-200)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3 a9 9 0 0 1 9 9",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round"
  }));
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/**
 * Tooltip — dark label on hover/focus. Wraps its child trigger.
 * `side` controls placement. Matches the Figma dark tooltip chip.
 */
function Tooltip({
  label,
  side = "top",
  children,
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    bottom: {
      top: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    left: {
      right: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)"
    },
    right: {
      left: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, open && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      zIndex: 50,
      whiteSpace: "nowrap",
      ...pos[side],
      padding: "6px 10px",
      borderRadius: "var(--radius-sm)",
      background: "var(--colour-neutral-900)",
      color: "var(--colour-neutral-0)",
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-small-size)",
      lineHeight: 1.3,
      boxShadow: "var(--shadow-md)",
      pointerEvents: "none"
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with label. Supports checked / indeterminate / disabled. */
function Checkbox({
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  style = {},
  ...rest
}) {
  const active = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      flexShrink: 0,
      background: active ? "var(--colour-primaryblue-500)" : "var(--field-02)",
      border: `1px solid ${active ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-xs)",
      transition: "all var(--duration-fast)"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: "inherit"
    }
  }, rest)), indeterminate ? /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    stroke: "white",
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })) : checked ? /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })) : null), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sandhata text Input — field with optional label, helper text, and
 * error/disabled states. Matches the Figma form-field anatomy.
 */
function Input({
  label,
  helper,
  error,
  required = false,
  size = "medium",
  iconRight = null,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const heights = {
    small: 32,
    medium: 40,
    large: 48
  };
  const h = heights[size] || 40;
  const fieldId = id || (label ? `sd-input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--border-error)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--label-size)",
      letterSpacing: "var(--label-tracking)",
      fontWeight: 700,
      color: "var(--text-subtitle)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-error)"
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    disabled: disabled,
    style: {
      width: "100%",
      height: h,
      padding: iconRight ? "0 36px 0 12px" : "0 12px",
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      color: "var(--text-body)",
      background: disabled ? "var(--surface-disabled)" : "var(--field-02)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      outline: "none",
      transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)",
      cursor: disabled ? "not-allowed" : "text",
      boxSizing: "border-box"
    },
    onFocus: e => {
      if (!error) e.currentTarget.style.borderColor = "var(--border-action)";
      e.currentTarget.style.boxShadow = "var(--shadow-focus)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = borderColor;
      e.currentTarget.style.boxShadow = "none";
    }
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 10,
      display: "inline-flex",
      color: "var(--icon-secondary)",
      pointerEvents: "none"
    }
  }, iconRight)), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--helper-size)",
      lineHeight: "var(--helper-line)",
      letterSpacing: "var(--helper-tracking)",
      color: error ? "var(--text-error)" : "var(--text-caption)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Radio button with label. Group several with a shared `name`. */
function Radio({
  label,
  checked = false,
  disabled = false,
  name,
  value,
  onChange,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      flexShrink: 0,
      borderRadius: "var(--radius-pill)",
      background: "var(--field-02)",
      border: `1px solid ${checked ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`,
      transition: "all var(--duration-fast)"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: "inherit"
    }
  }, rest)), checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "var(--radius-pill)",
      background: "var(--colour-primaryblue-500)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select styled to match Sandhata fields, with chevron + label. */
function Select({
  label,
  helper,
  error,
  options = [],
  value,
  onChange,
  placeholder = "Select…",
  size = "medium",
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const heights = {
    small: 32,
    medium: 40,
    large: 48
  };
  const h = heights[size] || 40;
  const fieldId = id || (label ? `sd-sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--border-error)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--label-size)",
      letterSpacing: "var(--label-tracking)",
      fontWeight: 700,
      color: "var(--text-subtitle)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    value: value,
    onChange: onChange,
    disabled: disabled,
    style: {
      width: "100%",
      height: h,
      padding: "0 36px 0 12px",
      appearance: "none",
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      color: value ? "var(--text-body)" : "var(--text-caption)",
      background: disabled ? "var(--surface-disabled)" : "var(--field-02)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      boxSizing: "border-box"
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 10,
      color: "var(--icon-secondary)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--helper-size)",
      lineHeight: "var(--helper-line)",
      letterSpacing: "var(--helper-tracking)",
      color: error ? "var(--text-error)" : "var(--text-caption)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Toggle switch. Controlled via `checked` + `onChange`. */
function Switch({
  checked = false,
  disabled = false,
  onChange,
  label,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (!disabled && onChange) onChange(!checked);
    },
    style: {
      position: "relative",
      width: 40,
      height: 22,
      flexShrink: 0,
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--colour-primaryblue-500)" : "var(--colour-neutral-300)",
      transition: "background var(--duration-base) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: checked ? 20 : 2,
      width: 18,
      height: 18,
      borderRadius: "var(--radius-pill)",
      background: "var(--colour-neutral-0)",
      boxShadow: "var(--shadow-sm)",
      transition: "left var(--duration-base) var(--ease-standard)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      display: "none"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line text field with optional label, helper and error. */
function Textarea({
  label,
  helper,
  error,
  required = false,
  rows = 4,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const fieldId = id || (label ? `sd-ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--border-error)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--label-size)",
      letterSpacing: "var(--label-tracking)",
      fontWeight: 700,
      color: "var(--text-subtitle)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-error)"
    }
  }, " *")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    rows: rows,
    disabled: disabled,
    style: {
      width: "100%",
      padding: "10px 12px",
      resize: "vertical",
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-medium-size)",
      lineHeight: "var(--body-medium-line)",
      color: "var(--text-body)",
      background: disabled ? "var(--surface-disabled)" : "var(--field-02)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)"
    },
    onFocus: e => {
      if (!error) e.currentTarget.style.borderColor = "var(--border-action)";
      e.currentTarget.style.boxShadow = "var(--shadow-focus)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = borderColor;
      e.currentTarget.style.boxShadow = "none";
    }
  }, rest)), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: "var(--helper-size)",
      lineHeight: "var(--helper-line)",
      letterSpacing: "var(--helper-tracking)",
      color: error ? "var(--text-error)" : "var(--text-caption)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * Tabs — underline-style tab bar. Controlled via `value` + `onChange`.
 * Each tab: { value, label, icon? }.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: 4,
      borderBottom: "1px solid var(--border-subtle)",
      ...style
    }
  }, tabs.map(t => {
    const active = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(t.value),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        fontFamily: active ? "var(--font-bold)" : "var(--font-normal)",
        fontWeight: active ? 700 : 400,
        fontSize: "var(--body-medium-size)",
        color: active ? "var(--colour-primaryblue-600)" : "var(--text-caption)",
        transition: "color var(--duration-fast)"
      }
    }, t.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex"
      }
    }, t.icon), t.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        background: active ? "var(--colour-primaryblue-500)" : "transparent",
        borderRadius: "2px 2px 0 0"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// docs/DocsApp.jsx
try { (() => {
// Sandhata docs — Components page. Uses the shared shell (DocsShell.jsx).

function AllComponents({
  groups,
  setCurrent
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "doc-main",
    style: {
      maxWidth: 1000
    }
  }, /*#__PURE__*/React.createElement("header", {
    className: "doc-head"
  }, /*#__PURE__*/React.createElement("h1", null, "All Components"), /*#__PURE__*/React.createElement("p", null, groups.reduce((n, g) => n + g.items.length, 0), " components across ", groups.length, " groups. Select one to view its full documentation.")), /*#__PURE__*/React.createElement("div", {
    className: "doc-rule"
  }), groups.map(g => /*#__PURE__*/React.createElement("section", {
    key: g.label,
    className: "doc-section"
  }, /*#__PURE__*/React.createElement("h2", null, g.label), /*#__PURE__*/React.createElement("div", {
    className: "all-grid"
  }, g.items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    className: "all-card",
    onClick: () => setCurrent(it.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "all-card-name"
  }, it.name), /*#__PURE__*/React.createElement("div", {
    className: "all-card-desc"
  }, it.description)))))));
}
function App() {
  const groups = window.SANDHATA_DOCS;
  const flat = groups.flatMap(g => g.items);
  const [current, setCurrent] = React.useState("button");
  React.useEffect(() => {
    const sc = document.querySelector(".doc-scroll");
    if (sc) sc.scrollTo({
      top: 0
    });
  }, [current]);
  const comp = flat.find(c => c.id === current);
  return /*#__PURE__*/React.createElement("div", {
    className: "doc-root"
  }, /*#__PURE__*/React.createElement(SdTopNav, {
    active: "Components"
  }), /*#__PURE__*/React.createElement("div", {
    className: "doc-body"
  }, /*#__PURE__*/React.createElement(SdSidebar, {
    groups: groups,
    current: current,
    setCurrent: setCurrent,
    topItem: {
      id: "__all",
      label: "All Components"
    },
    searchPlaceholder: "Search components"
  }), /*#__PURE__*/React.createElement("main", {
    className: "doc-scroll"
  }, current === "__all" || !comp ? /*#__PURE__*/React.createElement(AllComponents, {
    groups: groups,
    setCurrent: setCurrent
  }) : /*#__PURE__*/React.createElement(SdDocPage, {
    page: comp
  }))));
}
if (typeof document !== "undefined" && !window.__sdDocsMounted && document.getElementById("app") && window.SANDHATA_DOCS) {
  window.__sdDocsMounted = true;
  ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/DocsApp.jsx", error: String((e && e.message) || e) }); }

// docs/DocsData.jsx
try { (() => {
// Sandhata docs — component documentation registry.
// Each component: { id, name, description, sections:[...], props:[...] }
// Section kinds: bullets (intro list), demo (live preview + code), table (states), props.

const S = () => window.SandhataDesignSystem_081a0e;
const Plus = () => /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "5",
  x2: "12",
  y2: "19"
}), /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const Pencil = () => /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 20h9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
}));
const ArrowR = () => /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 5 19 12 12 19"
}));

// ---- BUTTON (full treatment, mirrors the reference page) -------------------
const Button = {
  id: "button",
  name: "Button",
  description: "Buttons trigger actions or events. They guide users toward key interactions and are used across forms, dialogs, and navigation flows.",
  sections: [{
    id: "when-to-use",
    title: "When to Use",
    bullets: [["Container", "Visual background and shape"], ["Label", "Describes the action"], ["Left Icon (optional)", "Supports recognition"], ["Right Icon (optional)", "Indicates direction or outcome"]],
    demo: () => {
      const {
        Button: B
      } = S();
      return /*#__PURE__*/React.createElement(B, {
        hierarchy: "primary",
        iconLeft: /*#__PURE__*/React.createElement(Plus, null),
        iconRight: /*#__PURE__*/React.createElement(ArrowR, null)
      }, "Button");
    },
    code: `import { Button } from "sandhata-ui";\n\nconst Example = () => (\n  <Button hierarchy="primary" iconLeft={<Plus/>}>Button</Button>\n);`
  }, {
    id: "hierarchy",
    title: "Hierarchy",
    bullets: [["Primary", "Main call-to-action on a page"], ["Secondary", "Supporting actions"], ["Tertiary", "Low emphasis actions"], ["Ghost", "Minimal, no background"], ["Danger", "Destructive actions (delete, remove)"]],
    demo: () => {
      const {
        Button: B
      } = S();
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(B, {
        hierarchy: "primary"
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "secondary"
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "tertiary"
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "ghost"
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "danger"
      }, "Button"));
    },
    code: `<Button hierarchy="primary">Button</Button>\n<Button hierarchy="secondary">Button</Button>\n<Button hierarchy="tertiary">Button</Button>\n<Button hierarchy="ghost">Button</Button>\n<Button hierarchy="danger">Button</Button>`
  }, {
    id: "sizes",
    title: "Sizes",
    bullets: [["Large", "High emphasis, landing pages or key actions"], ["Medium", "Default size for most use cases"], ["Small", "Dense layouts (tables, modals)"]],
    demo: () => {
      const {
        Button: B
      } = S();
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 16,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(B, {
        size: "large"
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        size: "medium"
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        size: "small"
      }, "Button"));
    },
    code: `<Button size="large">Button</Button>\n<Button size="medium">Button</Button>\n<Button size="small">Button</Button>`
  }, {
    id: "states",
    title: "States",
    table: {
      head: ["State", "Description"],
      rows: [["Default", "Normal state"], ["Hover", "On pointer hover"], ["Active", "On click / pressed"], ["Focus", "Keyboard focus state"], ["Disabled", "Non-interactive"]],
      codeCol: 0
    },
    note: "All hierarchies inherit these state behaviors.",
    demo: () => {
      const {
        Button: B
      } = S();
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(B, {
        hierarchy: "primary"
      }, "Default"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "secondary"
      }, "Hover"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "inverse"
      }, "Active"), /*#__PURE__*/React.createElement(B, {
        disabled: true
      }, "Disabled"), /*#__PURE__*/React.createElement(B, {
        hierarchy: "primary",
        style: {
          boxShadow: "var(--shadow-focus)"
        }
      }, "Focus"));
    },
    code: `<Button hierarchy="primary">Default</Button>\n<Button disabled>Disabled</Button>\n// Focus: 3px violet ring via --shadow-focus`
  }, {
    id: "variants",
    title: "Variants & Modifiers",
    bullets: [["With Left Icon", ""], ["With Right Icon", ""], ["Text Only", ""], ["Icon Only", ""]],
    demo: () => {
      const {
        Button: B,
        IconButton
      } = S();
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 16,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(B, {
        iconLeft: /*#__PURE__*/React.createElement(Plus, null)
      }, "Button"), /*#__PURE__*/React.createElement(B, {
        iconRight: /*#__PURE__*/React.createElement(ArrowR, null)
      }, "Button"), /*#__PURE__*/React.createElement(B, null, "Button"), /*#__PURE__*/React.createElement(IconButton, {
        icon: /*#__PURE__*/React.createElement(Plus, null),
        ariaLabel: "Add",
        hierarchy: "primary"
      }));
    },
    code: `<Button iconLeft={<Plus/>}>Button</Button>\n<Button iconRight={<ArrowR/>}>Button</Button>\n<Button>Button</Button>\n<IconButton icon={<Plus/>} ariaLabel="Add" hierarchy="primary" />`
  }],
  props: [["hierarchy", "enum", "Primary, Secondary, Tertiary, Ghost, Danger, Inverse"], ["size", "enum", "Large, Medium, Small"], ["iconLeft", "node", "Icon rendered before the label"], ["iconRight", "node", "Icon rendered after the label"], ["fullWidth", "boolean", "Stretch to fill the container width"], ["disabled", "boolean", "Non-interactive state"]]
};

// ---- generic builders ------------------------------------------------------
function usage(demo, code) {
  return {
    id: "usage",
    title: "Usage",
    demo,
    code
  };
}
function propsOf(rows) {
  return rows;
}
const IconButtonDoc = {
  id: "icon-button",
  name: "Icon Button",
  description: "A square button holding a single icon. Use for toolbars, table row actions and compact controls. Always provide an accessible label.",
  sections: [usage(() => {
    const {
      IconButton
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(Pencil, null),
      ariaLabel: "Edit",
      hierarchy: "tertiary"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(Pencil, null),
      ariaLabel: "Edit",
      hierarchy: "primary"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(Pencil, null),
      ariaLabel: "Edit",
      hierarchy: "danger"
    }));
  }, `<IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="tertiary" />\n<IconButton icon={<Pencil/>} ariaLabel="Edit" hierarchy="primary" />`)],
  props: [["icon", "node", "Icon node"], ["ariaLabel", "string", "Accessible label (required)"], ["hierarchy", "enum", "Primary, Secondary, Tertiary, Ghost, Danger"], ["size", "enum", "Small, Medium, Large"]]
};
const Input = {
  id: "text-input",
  name: "Single-line Text input",
  description: "A labelled text field with built-in helper text and error handling — the standard Sandhata form control.",
  sections: [usage(() => {
    const {
      Input: I
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 360
      }
    }, /*#__PURE__*/React.createElement(I, {
      label: "Field label",
      placeholder: "John Doe",
      helper: "Help or instruction text goes here"
    }), /*#__PURE__*/React.createElement(I, {
      label: "Mandatory field",
      required: true,
      error: "This is a mandatory field!",
      placeholder: "John Doe"
    }));
  }, `<Input label="Field label" placeholder="John Doe"\n  helper="Help or instruction text goes here" />\n<Input label="Mandatory field" required\n  error="This is a mandatory field!" />`)],
  props: [["label", "string", "Label rendered above the control"], ["helper", "string", "Helper / instruction text"], ["error", "string", "Error message (red border + message)"], ["required", "boolean", "Show required asterisk"], ["size", "enum", "Small, Medium, Large"], ["iconRight", "node", "Trailing icon"]]
};
const Textarea = {
  id: "textarea",
  name: "Multi-line Text input",
  description: "Multi-line text field with the same label / helper / error anatomy as the text input.",
  sections: [usage(() => {
    const {
      Textarea: T
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 380
      }
    }, /*#__PURE__*/React.createElement(T, {
      label: "Notes",
      placeholder: "Enter your text here",
      rows: 3,
      helper: "Help or instruction text goes here"
    }));
  }, `<Textarea label="Notes" rows={3}\n  placeholder="Enter your text here"\n  helper="Help or instruction text goes here" />`)],
  props: [["label", "string", "Field label"], ["helper", "string", "Helper text"], ["error", "string", "Error message"], ["rows", "number", "Visible rows"]]
};
const SelectDoc = {
  id: "dropdown",
  name: "Dropdown",
  description: "A styled native select with label, chevron, helper and error states.",
  sections: [usage(() => {
    const {
      Select
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 320
      }
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Party",
      placeholder: "Select party",
      options: ["Federalist", "Democratic-Republican", "Whig"]
    }));
  }, `<Select label="Party" placeholder="Select party"\n  options={["Federalist", "Democratic-Republican", "Whig"]} />`)],
  props: [["label", "string", "Field label"], ["options", "array", "string[] or {value,label}[]"], ["value", "string", "Selected value"], ["onChange", "func", "Change handler"], ["size", "enum", "Small, Medium, Large"]]
};
const CheckboxDoc = {
  id: "checkbox",
  name: "Checkbox",
  description: "Checkbox with label. Supports checked, indeterminate and disabled states.",
  sections: [usage(() => {
    const {
      Checkbox
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      label: "Checked",
      checked: true
    }), /*#__PURE__*/React.createElement(Checkbox, {
      label: "Indeterminate",
      indeterminate: true
    }), /*#__PURE__*/React.createElement(Checkbox, {
      label: "Unchecked"
    }), /*#__PURE__*/React.createElement(Checkbox, {
      label: "Disabled",
      disabled: true
    }));
  }, `<Checkbox label="Remember me" checked={on} onChange={e => setOn(e.target.checked)} />\n<Checkbox label="Indeterminate" indeterminate />`)],
  props: [["label", "string", "Label text"], ["checked", "boolean", "Checked state"], ["indeterminate", "boolean", "Dash state"], ["disabled", "boolean", "Non-interactive"], ["onChange", "func", "Change handler"]]
};
const RadioDoc = {
  id: "radio",
  name: "Radio button",
  description: "Radio button with label. Share a `name` across a group so only one can be selected.",
  sections: [usage(() => {
    const {
      Radio
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Radio, {
      name: "plan",
      label: "Basic"
    }), /*#__PURE__*/React.createElement(Radio, {
      name: "plan",
      label: "Pro",
      checked: true
    }), /*#__PURE__*/React.createElement(Radio, {
      name: "plan",
      label: "Team"
    }));
  }, `<Radio name="plan" label="Basic" />\n<Radio name="plan" label="Pro" checked />\n<Radio name="plan" label="Team" />`)],
  props: [["label", "string", "Label text"], ["name", "string", "Group name"], ["value", "string", "Value"], ["checked", "boolean", "Selected"], ["onChange", "func", "Change handler"]]
};
const SwitchDoc = {
  id: "switch",
  name: "Switch",
  description: "Toggle switch for binary on/off settings. Controlled via `checked` and `onChange(next)`.",
  sections: [usage(() => {
    const {
      Switch
    } = S();
    const [a, setA] = React.useState(true);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Switch, {
      checked: a,
      onChange: setA,
      label: "Dark mode"
    }), /*#__PURE__*/React.createElement(Switch, {
      checked: false,
      label: "Notifications"
    }));
  }, `const [dark, setDark] = useState(true);\n<Switch checked={dark} onChange={setDark} label="Dark mode" />`)],
  props: [["checked", "boolean", "On/off state"], ["onChange", "func", "(next: boolean) => void"], ["label", "string", "Label text"], ["disabled", "boolean", "Non-interactive"]]
};
const TagDoc = {
  id: "tag-input",
  name: "Tag input",
  description: "Removable chips / tags. Pass `onRemove` to render a dismiss button.",
  sections: [usage(() => {
    const {
      Tag
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Tag, null, "Federalist"), /*#__PURE__*/React.createElement(Tag, {
      tone: "action",
      onRemove: () => {}
    }, "Democratic-Republican"), /*#__PURE__*/React.createElement(Tag, {
      onRemove: () => {}
    }, "Whig"));
  }, `<Tag>Federalist</Tag>\n<Tag tone="action" onRemove={() => drop(id)}>Democratic-Republican</Tag>`)],
  props: [["tone", "enum", "Neutral, Action"], ["onRemove", "func", "Renders a dismiss button"]]
};
const CardDoc = {
  id: "card",
  name: "Card",
  description: "The base content surface: white layer, subtle border, soft shadow. Supports an optional title / subtitle header and a trailing action slot.",
  sections: [usage(() => {
    const {
      Card,
      Button: B
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 420
      }
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Line Chart",
      subtitle: "Showing total visitors for the last 3 months",
      action: /*#__PURE__*/React.createElement(B, {
        size: "small",
        hierarchy: "tertiary"
      }, "Export")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-normal)",
        fontSize: 14,
        color: "var(--text-body)"
      }
    }, "Card body content goes here.")));
  }, `<Card title="Line Chart" subtitle="Last 3 months" action={<Button size="small">Export</Button>}>\n  Card body content goes here.\n</Card>`)],
  props: [["title", "node", "Header title"], ["subtitle", "node", "Header subtitle (light)"], ["action", "node", "Trailing header slot"], ["padding", "number", "Inner padding (default 24)"]]
};
const StatCardDoc = {
  id: "stat-card",
  name: "Stat Card",
  description: "A KPI tile: label, large value and an optional trend indicator.",
  sections: [usage(() => {
    const {
      StatCard
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Desktop",
      value: "24,828",
      trend: "5.2% this month"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Mobile",
      value: "25,010",
      trend: "1.1% this month",
      trendDirection: "down"
    }));
  }, `<StatCard label="Desktop" value="24,828" trend="5.2% this month" />\n<StatCard label="Mobile" value="25,010" trend="1.1% this month" trendDirection="down" />`)],
  props: [["label", "string", "KPI label"], ["value", "node", "Large value"], ["trend", "string", "Trend text"], ["trendDirection", "enum", "up, down"]]
};
const BadgeDoc = {
  id: "badge",
  name: "Badge",
  description: "Small status pill. Tones map to the semantic palette; `subtle` is the default look, `solid` for emphasis.",
  sections: [usage(() => {
    const {
      Badge
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Active"), /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "Pending"), /*#__PURE__*/React.createElement(Badge, {
      tone: "error",
      dot: true
    }, "Failed"), /*#__PURE__*/React.createElement(Badge, {
      tone: "info"
    }, "Info"), /*#__PURE__*/React.createElement(Badge, {
      tone: "action",
      variant: "solid"
    }, "New"), /*#__PURE__*/React.createElement(Badge, {
      tone: "highlight"
    }, "Beta"));
  }, `<Badge tone="success" dot>Active</Badge>\n<Badge tone="action" variant="solid">New</Badge>`)],
  props: [["tone", "enum", "neutral, info, success, warning, error, action, highlight"], ["variant", "enum", "subtle, solid"], ["dot", "boolean", "Leading status dot"]]
};
const AvatarDoc = {
  id: "avatar",
  name: "Avatar",
  description: "Circular user marker. Shows an image (`src`) or auto-generated initials from `name`.",
  sections: [usage(() => {
    const {
      Avatar
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "John Adams"
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "Thomas Jefferson",
      tone: "purple"
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "James Madison",
      tone: "neutral"
    }));
  }, `<Avatar name="John Adams" />\n<Avatar name="Thomas Jefferson" tone="purple" />`)],
  props: [["name", "string", "Used for initials + alt"], ["src", "string", "Image URL"], ["size", "number", "Diameter in px"], ["tone", "enum", "action, purple, neutral"]]
};
const TabsDoc = {
  id: "tabs",
  name: "Tabs",
  description: "Underline-style tab bar — the Sandhata navigation pattern. Active tab is bold + blue with a 2px underline.",
  sections: [usage(() => {
    const {
      Tabs
    } = S();
    const [t, setT] = React.useState("dashboard");
    return /*#__PURE__*/React.createElement(Tabs, {
      value: t,
      onChange: setT,
      tabs: [{
        value: "dashboard",
        label: "Dashboard"
      }, {
        value: "forms",
        label: "Forms"
      }, {
        value: "cards",
        label: "Product Cards"
      }]
    });
  }, `const [tab, setTab] = useState("dashboard");\n<Tabs value={tab} onChange={setTab} tabs={[\n  { value: "dashboard", label: "Dashboard" },\n  { value: "forms", label: "Forms" },\n]} />`)],
  props: [["tabs", "array", "{ value, label, icon? }[]"], ["value", "string", "Active value"], ["onChange", "func", "(value) => void"]]
};
const AlertDoc = {
  id: "tooltip-alert",
  name: "Alert",
  description: "Inline alert / banner with tone-based colour and icon. Pass `onClose` for a dismissible banner.",
  sections: [usage(() => {
    const {
      Alert
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 460
      }
    }, /*#__PURE__*/React.createElement(Alert, {
      tone: "success",
      title: "Saved"
    }, "Your changes were saved successfully."), /*#__PURE__*/React.createElement(Alert, {
      tone: "warning",
      title: "Heads up",
      onClose: () => {}
    }, "Your trial ends in 3 days."), /*#__PURE__*/React.createElement(Alert, {
      tone: "error"
    }, "Something went wrong. Try again."));
  }, `<Alert tone="success" title="Saved">Your changes were saved.</Alert>\n<Alert tone="warning" title="Heads up" onClose={dismiss}>Trial ends soon.</Alert>`)],
  props: [["tone", "enum", "info, success, warning, error"], ["title", "node", "Bold heading"], ["onClose", "func", "Renders a dismiss button"]]
};
const TooltipDoc = {
  id: "tooltip",
  name: "Tooltip",
  description: "Dark label shown on hover / focus of its child trigger.",
  sections: [usage(() => {
    const {
      Tooltip,
      Button: B
    } = S();
    return /*#__PURE__*/React.createElement(Tooltip, {
      label: "This is a tooltip"
    }, /*#__PURE__*/React.createElement(B, {
      hierarchy: "tertiary"
    }, "Hover me"));
  }, `<Tooltip label="Copy to clipboard" side="top">\n  <IconButton icon={<Copy/>} ariaLabel="Copy" />\n</Tooltip>`)],
  props: [["label", "node", "Tooltip text"], ["side", "enum", "top, bottom, left, right"]]
};
const SpinnerDoc = {
  id: "spinner",
  name: "Spinner",
  description: "Indeterminate loading indicator in brand blue.",
  sections: [usage(() => {
    const {
      Spinner
    } = S();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 18,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Spinner, {
      size: 18
    }), /*#__PURE__*/React.createElement(Spinner, {
      size: 24
    }), /*#__PURE__*/React.createElement(Spinner, {
      size: 32
    }));
  }, `<Spinner size={20} />`)],
  props: [["size", "number", "Diameter in px"], ["stroke", "number", "Stroke width"], ["color", "string", "Override colour"]]
};

// ---- groups (mirrors the reference sidebar structure) ----------------------
const GROUPS = [{
  label: "Inputs & Form Controls",
  items: [Input, Textarea, SelectDoc, CheckboxDoc, RadioDoc, SwitchDoc, TagDoc]
}, {
  label: "Actions",
  items: [Button, IconButtonDoc]
}, {
  label: "Data Display",
  items: [CardDoc, StatCardDoc, BadgeDoc, AvatarDoc]
}, {
  label: "Navigation",
  items: [TabsDoc]
}, {
  label: "Feedback & Status",
  items: [AlertDoc, TooltipDoc, SpinnerDoc]
}];
window.SANDHATA_DOCS = GROUPS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/DocsData.jsx", error: String((e && e.message) || e) }); }

// docs/DocsShell.jsx
try { (() => {
// Sandhata docs — shared shell: top nav (page links), sidebar, doc page with
// right-rail quick scroll navigation (scroll-spy). Loaded before each page's app.

function SdCodeBlock({
  code
}) {
  return /*#__PURE__*/React.createElement("pre", {
    className: "doc-code",
    dangerouslySetInnerHTML: {
      __html: window.sdHighlight(code)
    }
  });
}
function SdExample({
  section
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "doc-example"
  }, section.demo && /*#__PURE__*/React.createElement("div", {
    className: "doc-preview"
  }, section.demo()), section.demo && section.code && /*#__PURE__*/React.createElement("div", {
    className: "doc-divider"
  }), section.code && /*#__PURE__*/React.createElement(SdCodeBlock, {
    code: section.code
  }));
}
function SdBullets({
  items
}) {
  return /*#__PURE__*/React.createElement("ul", {
    className: "doc-bullets"
  }, items.map(([term, desc], i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("b", null, term), desc ? ` — ${desc}` : "")));
}
function SdStatesTable({
  table
}) {
  return /*#__PURE__*/React.createElement("table", {
    className: "doc-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, table.head.map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, table.rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, r.map((c, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    className: j === table.codeCol ? "mono-cell" : ""
  }, c))))));
}
function SdPropsTable({
  rows
}) {
  return /*#__PURE__*/React.createElement("table", {
    className: "doc-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Prop"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Description"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    className: "prop-pill"
  }, r[0])), /*#__PURE__*/React.createElement("td", {
    className: "type-cell"
  }, r[1]), /*#__PURE__*/React.createElement("td", null, r[2])))));
}
function SdSection({
  section
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: `sec-${section.id}`,
    className: "doc-section"
  }, /*#__PURE__*/React.createElement("h2", null, section.title), section.bullets && /*#__PURE__*/React.createElement(SdBullets, {
    items: section.bullets
  }), section.table && /*#__PURE__*/React.createElement(SdStatesTable, {
    table: section.table
  }), section.note && /*#__PURE__*/React.createElement("p", {
    className: "doc-note"
  }, section.note), (section.demo || section.code) && /*#__PURE__*/React.createElement(SdExample, {
    section: section
  }));
}

/* A full doc page: title, sections, optional props table, and the right-rail
   quick nav. The rail tracks the scroll position (scroll-spy) and clicking a
   link scrolls smoothly to that section. */
function SdDocPage({
  page
}) {
  const toc = (page.sections || []).map(s => ({
    id: s.id,
    title: s.title
  })).concat(page.props ? [{
    id: "props",
    title: "Props"
  }] : []);
  const [active, setActive] = React.useState(toc[0] && toc[0].id);
  React.useEffect(() => {
    const sc = document.querySelector(".doc-scroll");
    if (!sc) return;
    const onScroll = () => {
      let cur = toc[0] && toc[0].id;
      for (const t of toc) {
        const el = document.getElementById(`sec-${t.id}`);
        if (el && el.offsetTop - 80 <= sc.scrollTop) cur = t.id;
      }
      setActive(cur);
    };
    onScroll();
    sc.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => sc.removeEventListener("scroll", onScroll);
  }, [page.id]);
  const jump = id => {
    const el = document.getElementById(`sec-${id}`);
    const sc = document.querySelector(".doc-scroll");
    if (el && sc) sc.scrollTo({
      top: el.offsetTop - 24,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "doc-page-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc-main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "doc-head"
  }, /*#__PURE__*/React.createElement("h1", null, page.name), /*#__PURE__*/React.createElement("p", null, page.description)), /*#__PURE__*/React.createElement("div", {
    className: "doc-rule"
  }), (page.sections || []).map(s => /*#__PURE__*/React.createElement(SdSection, {
    key: s.id,
    section: s
  })), page.props && /*#__PURE__*/React.createElement("section", {
    id: "sec-props",
    className: "doc-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Props"), /*#__PURE__*/React.createElement(SdPropsTable, {
    rows: page.props
  }))), /*#__PURE__*/React.createElement("aside", {
    className: "doc-toc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toc-inner"
  }, toc.map(t => /*#__PURE__*/React.createElement("a", {
    key: t.id,
    className: active === t.id ? "on" : "",
    onClick: () => jump(t.id)
  }, t.title)))));
}
function SdSidebar({
  groups,
  current,
  setCurrent,
  topItem,
  searchPlaceholder
}) {
  const [q, setQ] = React.useState("");
  const ql = q.trim().toLowerCase();
  return /*#__PURE__*/React.createElement("nav", {
    className: "doc-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "doc-search"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), /*#__PURE__*/React.createElement("input", {
    placeholder: searchPlaceholder || "Search",
    value: q,
    onChange: e => setQ(e.target.value)
  })), topItem && /*#__PURE__*/React.createElement("a", {
    className: "doc-nav-all" + (current === topItem.id ? " on" : ""),
    onClick: () => setCurrent(topItem.id)
  }, topItem.label), groups.map(g => {
    const items = g.items.filter(it => !ql || it.name.toLowerCase().includes(ql));
    if (!items.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: g.label,
      className: "doc-group"
    }, /*#__PURE__*/React.createElement("div", {
      className: "doc-group-label"
    }, g.label), items.map(it => /*#__PURE__*/React.createElement("a", {
      key: it.id,
      className: "doc-nav-item" + (current === it.id ? " on" : ""),
      onClick: () => setCurrent(it.id)
    }, it.name)));
  }));
}

/* Top navigation — each tab is its own page. */
function SdTopNav({
  active
}) {
  const tabs = [["Components", "index.html"], ["Documentation", "documentation.html"], ["Demo", "../ui_kits/showcase/index.html"]];
  return /*#__PURE__*/React.createElement("header", {
    className: "doc-topbar"
  }, /*#__PURE__*/React.createElement("a", {
    className: "doc-logo-link",
    href: "index.html"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo/sandhata-logo.svg",
    alt: "Sandhata",
    style: {
      height: 28
    }
  })), /*#__PURE__*/React.createElement("nav", {
    className: "doc-topnav"
  }, tabs.map(([label, href]) => /*#__PURE__*/React.createElement("a", {
    key: label,
    className: active === label ? "on" : "",
    href: href
  }, label))));
}
Object.assign(window, {
  SdCodeBlock,
  SdExample,
  SdBullets,
  SdStatesTable,
  SdPropsTable,
  SdSection,
  SdDocPage,
  SdSidebar,
  SdTopNav
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/DocsShell.jsx", error: String((e && e.message) || e) }); }

// docs/DocumentationApp.jsx
try { (() => {
// Sandhata documentation — design-system page. Uses the shared shell (DocsShell.jsx).

function App() {
  const groups = window.SANDHATA_DOC_PAGES;
  const flat = groups.flatMap(g => g.items);
  const [current, setCurrent] = React.useState("overview");
  React.useEffect(() => {
    const sc = document.querySelector(".doc-scroll");
    if (sc) sc.scrollTo({
      top: 0
    });
  }, [current]);
  const page = flat.find(p => p.id === current) || flat[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "doc-root"
  }, /*#__PURE__*/React.createElement(SdTopNav, {
    active: "Documentation"
  }), /*#__PURE__*/React.createElement("div", {
    className: "doc-body"
  }, /*#__PURE__*/React.createElement(SdSidebar, {
    groups: groups,
    current: current,
    setCurrent: setCurrent,
    searchPlaceholder: "Search documentation"
  }), /*#__PURE__*/React.createElement("main", {
    className: "doc-scroll"
  }, /*#__PURE__*/React.createElement(SdDocPage, {
    page: page
  }))));
}
if (typeof document !== "undefined" && !window.__sdDocumentationMounted && document.getElementById("app") && window.SANDHATA_DOC_PAGES) {
  window.__sdDocumentationMounted = true;
  ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/DocumentationApp.jsx", error: String((e && e.message) || e) }); }

// docs/DocumentationData.jsx
try { (() => {
// Sandhata documentation — design-system pages (foundations, guidelines, theming).
// Same shape as the components registry: { id, name, description, sections:[...] }.

const Sw = ({
  c,
  name,
  hex
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: 96
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    height: 52,
    borderRadius: "var(--radius-md)",
    background: c,
    border: "1px solid rgba(20,22,24,0.08)"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "700 12px/1.5 var(--font-bold)",
    color: "var(--text-title)",
    marginTop: 6
  }
}, name), /*#__PURE__*/React.createElement("div", {
  style: {
    font: "11px/1.4 var(--font-mono)",
    color: "var(--text-caption)"
  }
}, hex));
const SwRow = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14
  }
}, children);
const docOverview = {
  id: "overview",
  name: "Overview",
  description: "Sandhata UI is a set of beautifully designed components that you can customise, extend, and build on. It spans colour, type, spacing and elevation tokens, reusable React primitives, and full product surfaces.",
  sections: [{
    id: "quick-start",
    title: "Quick start",
    bullets: [["Link the stylesheet", "styles.css imports every token and font file"], ["Load the bundle", "components live on window.SandhataDesignSystem_081a0e"], ["Tokens first", "prefer semantic aliases over raw scale steps"]],
    code: `<link rel="stylesheet" href="styles.css" />\n<script src="_ds_bundle.js"></script>\n\nconst { Button, Card } = window.SandhataDesignSystem_081a0e;\n\n<Button hierarchy="primary">Get started</Button>`
  }, {
    id: "whats-included",
    title: "What's included",
    bullets: [["Foundations", "colour scales, type, 8-point spacing, radii, elevation, motion"], ["Components", "buttons, forms, data display, feedback and navigation primitives"], ["UI kit", "dashboard, forms and pricing surfaces built from the components"], ["Docs", "this site — component API references and these guidelines"]]
  }, {
    id: "principles",
    title: "Principles",
    bullets: [["Crisp and enterprise-grade", "restrained radii, hairline borders, faint shadows"], ["White space dominates", "colour is used sparingly and purposefully"], ["Tokens first", "semantic aliases keep surfaces re-themeable"], ["Quiet motion", "fast, functional easing — no bounces, no decorative loops"]]
  }]
};
const docColour = {
  id: "colour",
  name: "Colour",
  description: "Clean, cool and corporate. A royal electric blue is the action colour; neutrals are slightly cool greys. Data visualisation leans on violet, blues and cyan.",
  sections: [{
    id: "brand-action",
    title: "Brand & action",
    bullets: [["Primary blue 500", "the action colour — buttons, links, selected states"], ["Primary blue 400", "brighter emphasis variant"], ["Alternative purple 500", "focus ring and data-viz lead"], ["Secondary blue 500", "deep navy for dense chrome"]],
    demo: () => /*#__PURE__*/React.createElement(SwRow, null, /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-primaryblue-500)",
      name: "primaryblue-500",
      hex: "#0036DD"
    }), /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-primaryblue-400)",
      name: "primaryblue-400",
      hex: "#445CFF"
    }), /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-alternativepurple-500)",
      name: "purple-500",
      hex: "#602DEA"
    }), /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-secondaryblue-500)",
      name: "secondaryblue-500",
      hex: "#1F2A54"
    }))
  }, {
    id: "neutrals",
    title: "Neutral scale",
    note: "Slightly cool greys, 0–950. Text sits at 600–900; borders at 200–300; surfaces at 0–100.",
    demo: () => /*#__PURE__*/React.createElement(SwRow, null, [["0", "#FFFFFF"], ["50", "#F5F6F8"], ["100", "#E9EBEE"], ["200", "#D5DBDE"], ["300", "#C0C7CF"], ["500", "#98A3AD"], ["700", "#585F65"], ["900", "#202225"], ["950", "#141618"]].map(([s, hex]) => /*#__PURE__*/React.createElement(Sw, {
      key: s,
      c: `var(--colour-neutral-${s})`,
      name: `neutral-${s}`,
      hex: hex
    })))
  }, {
    id: "status",
    title: "Status colours",
    demo: () => /*#__PURE__*/React.createElement(SwRow, null, /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-success-500)",
      name: "success-500",
      hex: "#00A300"
    }), /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-error-500)",
      name: "error-500",
      hex: "#D21B00"
    }), /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-alert-500)",
      name: "alert-500",
      hex: "#FFC228"
    }), /*#__PURE__*/React.createElement(Sw, {
      c: "var(--colour-info-500)",
      name: "info-500",
      hex: "#508FED"
    }))
  }, {
    id: "semantic",
    title: "Semantic aliases",
    note: "Reference these in product UI, not the raw scales. Aliases re-map automatically in the dark theme.",
    table: {
      head: ["Token", "Maps to", "Use"],
      rows: [["--surface-page", "neutral-0", "Page background"], ["--text-body", "neutral-800", "Body copy"], ["--text-action", "primaryblue-500", "Links and actions"], ["--background-action", "primaryblue-500", "Primary buttons"], ["--border-subtle", "neutral-200", "Hairlines and card borders"], ["--focus-ring", "purple-500", "Keyboard focus halo"]],
      codeCol: 0
    }
  }, {
    id: "data-viz",
    title: "Data visualisation",
    note: "Charts run violet → blue → cyan, with soft area fills fading to transparent.",
    demo: () => /*#__PURE__*/React.createElement(SwRow, null, [1, 2, 3, 4, 5, 6].map(n => /*#__PURE__*/React.createElement(Sw, {
      key: n,
      c: `var(--viz-${n})`,
      name: `viz-${n}`,
      hex: ["#602DEA", "#445CFF", "#00D4D4", "#00208F", "#9A8AF5", "#608FEC"][n - 1]
    })))
  }, {
    id: "gradient",
    title: "Brand gradient",
    note: "Magenta → deep blue, reserved for brand and marketing surfaces. Product UI stays white.",
    demo: () => /*#__PURE__*/React.createElement("div", {
      style: {
        height: 72,
        borderRadius: "var(--radius-lg)",
        background: "var(--gradient-brand)"
      }
    }),
    code: `background: var(--gradient-brand);\n/* linear-gradient(114.77deg, #DF00C1 1.85%, #002289 98.15%) */`
  }]
};
const docTypography = {
  id: "typography",
  name: "Typography",
  description: "Akkurat throughout — Light for soft body and captions, Regular for UI, Bold for display and headings, Mono for code and numbers. The scale follows an 8-point rhythm.",
  sections: [{
    id: "families",
    title: "Families",
    bullets: [["Akkurat Bold", "display and headings, tight negative tracking"], ["Akkurat Regular", "UI and body copy"], ["Akkurat Light", "soft body, captions, secondary copy"], ["Akkurat Mono", "code, tokens and tabular numbers"]],
    demo: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "700 32px/1.2 var(--font-bold)",
        letterSpacing: "-0.25px",
        color: "var(--text-title)"
      }
    }, "Beautifully designed components"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "16px/1.5 var(--font-normal)",
        color: "var(--text-body)"
      }
    }, "Components you can customise, extend, and build on."), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "300 16px/1.5 var(--font-light)",
        color: "var(--text-subtitle)"
      }
    }, "Help or instruction text goes here."), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "13px/1.5 var(--font-mono)",
        color: "var(--text-body)"
      }
    }, "--colour-primaryblue-500: rgb(0, 54, 221);"))
  }, {
    id: "scale",
    title: "Type scale",
    table: {
      head: ["Token", "Size / line", "Tracking", "Family"],
      rows: [["display-large", "48 / 64", "−1px", "Bold"], ["display-medium", "40 / 48", "−0.5px", "Bold"], ["display-small", "32 / 40", "−0.25px", "Bold"], ["heading-h1", "24 / 32", "−0.25px", "Bold"], ["heading-h2", "20 / 24", "−0.25px", "Bold"], ["heading-h3", "16 / 20", "0", "Bold"], ["body-large", "16 / 24", "0", "Regular"], ["body-medium", "14 / 20", "0", "Regular"], ["body-small", "12 / 16", "0", "Regular"], ["caption", "12 / 16", "0.1px", "Light"], ["label", "12 / 16", "0.5px", "Regular"], ["code", "12 / 16", "0", "Mono"]],
      codeCol: 0
    }
  }, {
    id: "type-usage",
    title: "Usage",
    bullets: [["Sentence case everywhere", "headings, buttons, labels, tabs — never Title Case"], ["Display sizes carry tight negative tracking", "body is neutral"], ["Comfortable line lengths", "body copy maxes around 720px"]],
    code: `h1 { font: 700 var(--heading-h1-size)/var(--heading-h1-line) var(--font-bold); }\nbody { font: var(--body-medium-size)/var(--body-medium-line) var(--font-normal); }`
  }]
};
const docSpacing = {
  id: "spacing",
  name: "Spacing & layout",
  description: "A strict 8-point grid with half-steps. Generous internal card padding and a centred max-width container keep layouts calm and consistent.",
  sections: [{
    id: "grid",
    title: "8-point grid",
    demo: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: 10
      }
    }, [["space-1", 4], ["space-2", 8], ["space-3", 12], ["space-4", 16], ["space-6", 24], ["space-8", 32], ["space-12", 48], ["space-16", 64]].map(([t, px]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("code", {
      style: {
        font: "12px/1 var(--font-mono)",
        color: "var(--c-kw)",
        width: 84,
        flexShrink: 0
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        width: px,
        height: 16,
        background: "var(--colour-primaryblue-200)",
        borderRadius: 2,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "12px/1 var(--font-mono)",
        color: "var(--text-caption)"
      }
    }, px, "px"))))
  }, {
    id: "layout",
    title: "Layout",
    bullets: [["Container", "centred max-width 1320px with 24px gutters"], ["Card padding", "24px internal padding as the default"], ["Gutters", "24–32px between major regions"]],
    code: `.container { max-width: var(--container-max); padding: 0 var(--container-pad); margin: 0 auto; }`
  }]
};
const docShape = {
  id: "shape",
  name: "Radius & elevation",
  description: "Restrained corners and soft, low-contrast shadows. Cards lean on a 1px subtle border with a faint shadow — never heavy elevation.",
  sections: [{
    id: "radius",
    title: "Border radius",
    table: {
      head: ["Token", "Value", "Use"],
      rows: [["--radius-xs", "2px", "Code pills, tiny chips"], ["--radius-sm", "4px", "Inputs, inner elements"], ["--radius-md", "6px", "Buttons"], ["--radius-lg", "8px", "Cards"], ["--radius-xl", "12px", "Featured / pricing cards"], ["--radius-pill", "999px", "Badges, avatars, toggles"]],
      codeCol: 0
    },
    demo: () => /*#__PURE__*/React.createElement(SwRow, null, [["sm", "4px"], ["md", "6px"], ["lg", "8px"], ["xl", "12px"], ["pill", "999px"]].map(([t, v]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 72,
        height: 52,
        background: "var(--colour-primaryblue-50)",
        border: "1px solid var(--colour-primaryblue-200)",
        borderRadius: `var(--radius-${t})`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "11px/1.6 var(--font-mono)",
        color: "var(--text-caption)",
        marginTop: 6
      }
    }, t, " \xB7 ", v))))
  }, {
    id: "shadows",
    title: "Shadows",
    note: "Soft neutral shadows, rgba(20,22,24,…). The only coloured glow is the focus ring — a 3px violet halo.",
    demo: () => /*#__PURE__*/React.createElement(SwRow, null, ["xs", "sm", "md", "lg"].map(s => /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        width: 110,
        height: 64,
        background: "#fff",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: `var(--shadow-${s})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: "12px/1 var(--font-mono)",
        color: "var(--text-caption)"
      }
    }, "shadow-", s)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 110,
        height: 64,
        background: "#fff",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-focus)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        font: "12px/1 var(--font-mono)",
        color: "var(--text-caption)"
      }
    }, "focus"))
  }, {
    id: "borders",
    title: "Borders & dividers",
    bullets: [["Hairlines", "1px neutral-200/300 for dividers and card borders"], ["Tables", "bordered grids with hairline rows"], ["Emphasis", "2px for tab underlines and selected accents"]]
  }]
};
const docMotion = {
  id: "motion",
  name: "Motion",
  description: "Quiet and functional. Standard easing, fast for hovers, base for toggles. No bounces, no infinite decorative loops.",
  sections: [{
    id: "tokens",
    title: "Easing & duration",
    table: {
      head: ["Token", "Value", "Use"],
      rows: [["--ease-standard", "cubic-bezier(0.2, 0, 0, 1)", "Default for most transitions"], ["--ease-entrance", "cubic-bezier(0, 0, 0.2, 1)", "Elements entering"], ["--ease-exit", "cubic-bezier(0.4, 0, 1, 1)", "Elements leaving"], ["--duration-fast", "120ms", "Hovers, small state changes"], ["--duration-base", "200ms", "Toggles, reveals"], ["--duration-slow", "320ms", "Large surfaces, overlays"]],
      codeCol: 0
    },
    code: `transition: background var(--duration-fast) var(--ease-standard);`
  }]
};
const docContent = {
  id: "content",
  name: "Content & voice",
  description: "Confident, plain, builder-to-builder. Short, active, benefit-first copy that addresses the reader as you.",
  sections: [{
    id: "voice",
    title: "Voice & tone",
    bullets: [["Benefit-first", "\u201cA set of beautifully designed components that you can customise, extend, and build on.\u201d"], ["Second person", "components you can customise — avoid \u201cwe\u201d and \u201cour\u201d"], ["Calm and instructional", "helper text is neutral and descriptive, never cute"], ["No emoji", "in UI or copy, ever"]]
  }, {
    id: "mechanics",
    title: "Mechanics",
    bullets: [["Sentence case", "headings, buttons, labels, tabs — proper nouns only"], ["British spelling", "colour, customise, organise"], ["Numbers", "grouped with commas (24,828); compact currency ($0/mo)"], ["Errors", "direct — \u201cThis is a mandatory field!\u201d"], ["CTAs", "verb-first and short — Submit, Get started, View documentation"]]
  }]
};
const docBrand = {
  id: "brand",
  name: "Iconography & brand",
  description: "A custom icon library drawn on a 24px grid; the dominant UI style is a clean 1.5–2px single-weight stroke with rounded caps and joins.",
  sections: [{
    id: "logo",
    title: "Logo",
    bullets: [["Lockup", "sandhata-logo.svg for headers and marketing"], ["Mark", "sandhata-mark.svg — cyan twist + orange dot — for square and favicon use"], ["Mark colours", "cyan #00A4DC, orange #F68136, ink #48484F"]],
    demo: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 40
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo/sandhata-logo.svg",
      alt: "Sandhata logo",
      style: {
        height: 36
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo/sandhata-mark.svg",
      alt: "Sandhata mark",
      style: {
        height: 44
      }
    }))
  }, {
    id: "icons",
    title: "Icons",
    bullets: [["24px grid", "1.5–2px strokes, rounded caps and joins"], ["Style", "Light (Stroke) is the dominant UI set; Lucide-style icons are the closest substitute"], ["No glyph icons", "never use emoji or unicode characters as icons"]],
    code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"\n     stroke="currentColor" stroke-width="2" stroke-linecap="round">\n  <line x1="12" y1="5" x2="12" y2="19" />\n  <line x1="5" y1="12" x2="19" y2="12" />\n</svg>`
  }]
};
const docTheming = {
  id: "theming",
  name: "Theming",
  description: "Every surface reads semantic aliases, so re-theming is a matter of remapping tokens. A dark theme ships with the system.",
  sections: [{
    id: "dark",
    title: "Dark theme",
    note: "Apply data-theme=\"dark\" (or class .dark) to any container; the semantic aliases remap automatically.",
    demo: () => /*#__PURE__*/React.createElement("div", {
      className: "dark",
      style: {
        background: "var(--surface-page)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "700 16px/1.4 var(--font-bold)",
        color: "var(--text-title)",
        marginBottom: 6
      }
    }, "Dark surface"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: "14px/1.5 var(--font-normal)",
        color: "var(--text-subtitle)"
      }
    }, "Same components, same aliases \u2014 remapped values.")),
    code: `<body data-theme="dark">\n  <!-- or scope it: -->\n  <section class="dark">…</section>\n</body>`
  }, {
    id: "accent",
    title: "Re-skinning the action colour",
    bullets: [["Override --background-action and friends", "the showcase's accent switcher does exactly this"], ["Keep contrast", "action colours should pass 4.5:1 on white"]],
    code: `:root[data-accent="purple"] {\n  --background-action: var(--colour-alternativepurple-500);\n  --background-action-hover: var(--colour-alternativepurple-700);\n  --text-action: var(--colour-alternativepurple-500);\n}`
  }]
};
window.SANDHATA_DOC_PAGES = [{
  label: "Getting started",
  items: [docOverview]
}, {
  label: "Foundations",
  items: [docColour, docTypography, docSpacing, docShape, docMotion]
}, {
  label: "Guidelines",
  items: [docContent, docBrand, docTheming]
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/DocumentationData.jsx", error: String((e && e.message) || e) }); }

// docs/highlight.js
try { (() => {
/* Sandhata docs — tiny JSX syntax highlighter (light theme). window.sdHighlight(src) -> HTML. */
(function () {
  window.sdHighlight = function (src) {
    var esc = String(src).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var RX = /(\/\/[^\n]*)|("[^"]*"|'[^']*')|\b(import|from|const|let|return|export|default|function|useState)\b|(&lt;\/?[A-Za-z][\w.]*)|([A-Za-z_][\w]*)(?=={|="|=')/g;
    return esc.replace(RX, function (m, com, str, kw, tag, prop) {
      if (com) return '<span class="c-com">' + com + "</span>";
      if (str) return '<span class="c-str">' + str + "</span>";
      if (kw) return '<span class="c-kw">' + kw + "</span>";
      if (tag) return '<span class="c-tag">' + tag + "</span>";
      if (prop) return '<span class="c-prop">' + prop + "</span>";
      return m;
    });
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/highlight.js", error: String((e && e.message) || e) }); }

// motion/IntroApp.jsx
try { (() => {
// Sandhata intro film — stage composition.

function SdTimecode() {
  const t = useTime();
  const sec = Math.floor(t);
  React.useEffect(() => {
    const el = document.getElementById("video-root");
    if (el) el.setAttribute("data-screen-label", `Sandhata intro @ ${sec}s`);
  }, [sec]);
  return null;
}
function SdIntroApp() {
  return /*#__PURE__*/React.createElement(Stage, {
    width: 1920,
    height: 1080,
    duration: 36,
    background: "#FFFFFF",
    persistKey: "sandhata-intro"
  }, /*#__PURE__*/React.createElement(SdTimecode, null), /*#__PURE__*/React.createElement(SdScene1, null), /*#__PURE__*/React.createElement(SdScene2, null), /*#__PURE__*/React.createElement(SdScene3, null), /*#__PURE__*/React.createElement(SdScene4, null), /*#__PURE__*/React.createElement(SdScene5, null), /*#__PURE__*/React.createElement(SdScene6, null));
}
if (!window.__sdIntroMounted && document.getElementById("video-root")) {
  window.__sdIntroMounted = true;
  ReactDOM.createRoot(document.getElementById("video-root")).render(/*#__PURE__*/React.createElement(SdIntroApp, null));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "motion/IntroApp.jsx", error: String((e && e.message) || e) }); }

// motion/IntroScenes1.jsx
try { (() => {
// Sandhata intro film — shared helpers + scenes 1–3 (logo, colour, typography).
// Loaded after animations.jsx; exports to window for IntroScenes2/IntroApp.

const sdC = {
  blue: "#0036DD",
  blueBright: "#445CFF",
  blue50: "#EBEFFF",
  blue200: "#B8C4FF",
  purple: "#602DEA",
  navy: "#1F2A54",
  ink: "#141618",
  n900: "#202225",
  n700: "#585F65",
  n500: "#98A3AD",
  n300: "#C0C7CF",
  n200: "#D5DBDE",
  n100: "#E9EBEE",
  n50: "#F5F6F8",
  success: "#00A300",
  error: "#D21B00",
  alert: "#FFC228",
  info: "#508FED",
  cyan: "#00A4DC",
  orange: "#F68136",
  leafGrey: "#B7B7B6",
  viz: ["#602DEA", "#445CFF", "#00D4D4", "#00208F", "#9A8AF5", "#608FEC"]
};
const sdF = {
  bold: "var(--font-bold, 'Akkurat', sans-serif)",
  normal: "var(--font-normal, 'Akkurat', sans-serif)",
  light: "var(--font-light, 'Akkurat', sans-serif)",
  mono: "var(--font-mono, ui-monospace, monospace)"
};
const sdP = (lt, at, dur, ease = Easing.easeOutCubic) => ease(clamp((lt - at) / dur, 0, 1));

// Absolute-positioned element that rises + fades in at scene-local time `at`.
function SdItem({
  x,
  y,
  at = 0,
  dur = 0.55,
  dy = 26,
  scaleFrom = null,
  ease = Easing.easeOutCubic,
  w,
  style,
  children
}) {
  const {
    localTime
  } = useSprite();
  const o = clamp((localTime - at) / (dur * 0.6), 0, 1);
  const e = sdP(localTime, at, dur, ease);
  const s = scaleFrom == null ? 1 : scaleFrom + (1 - scaleFrom) * e;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity: o,
      transform: `translateY(${(1 - e) * dy}px) scale(${s})`,
      transformOrigin: "center",
      willChange: "transform, opacity",
      ...style
    }
  }, children);
}

// Scene shell: gates to [start,end], crossfades at both ends, slow camera zoom.
function SdScene({
  start,
  end,
  zoomFrom = 1,
  zoomTo = 1.035,
  origin = "center",
  fadeIn = 0.35,
  fadeOut = 0.45,
  children
}) {
  return /*#__PURE__*/React.createElement(Sprite, {
    start: start,
    end: end
  }, ({
    localTime,
    duration,
    progress
  }) => {
    const o = Math.min(clamp(localTime / fadeIn, 0, 1), clamp((duration - localTime) / fadeOut, 0, 1));
    const z = zoomFrom + (zoomTo - zoomFrom) * progress;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        opacity: o,
        transform: `scale(${z})`,
        transformOrigin: origin
      }
    }, children);
  });
}

// Numbered section label, top-left, with a hairline that draws across.
function SdSceneLabel({
  num,
  title
}) {
  const {
    localTime
  } = useSprite();
  const rule = sdP(localTime, 0.5, 0.9, Easing.easeInOutCubic);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SdItem, {
    x: 160,
    y: 120,
    at: 0.2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 26,
      color: sdC.blue
    }
  }, num), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.bold,
      fontWeight: 700,
      fontSize: 46,
      letterSpacing: "-0.5px",
      color: sdC.ink
    }
  }, title))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 160,
      top: 200,
      height: 1,
      width: 1600 * rule,
      background: sdC.n200
    }
  }));
}

// The Sandhata mark, self-assembling: cyan twist spins in, grey leaves rise, orange dot drops.
function SdLogoMark({
  lt,
  width = 300,
  at = 0.2
}) {
  const swirl = sdP(lt, at, 0.9, Easing.easeOutBack);
  const swirlO = clamp((lt - at) / 0.4, 0, 1);
  const leaves = sdP(lt, at + 0.55, 0.6);
  const dot = sdP(lt, at + 0.85, 0.55, Easing.easeOutBack);
  const dotO = clamp((lt - at - 0.85) / 0.2, 0, 1);
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    viewBox: "0 0 184 145",
    fill: "none",
    style: {
      display: "block",
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(44.655,51.555)",
    opacity: leaves
  }, /*#__PURE__*/React.createElement("g", {
    style: {
      transform: `translateY(${(1 - leaves) * 16}px)`
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 81.339 92.734 L 81.338 92.737 L 81.328 92.734 L 81.339 92.734 Z M 55.933 38.051 C 37.677 41.597 21.069 45.002 15.529 47.437 C 11.905 45.572 8.092 43.598 4.079 41.504 C -1.801 38.615 -0.563 32.713 3.015 27.607 C 12.551 22.485 26.12 18.831 40.844 15.665 C 43.298 19.358 45.819 23.082 48.339 26.807 C 50.898 30.587 53.459 34.366 55.933 38.051 Z M 123.793 19.186 C 112.883 25.871 97.472 29.795 79.895 33.378 C 75.854 27.056 71.468 20.577 67.083 14.098 L 64.904 10.88 C 86.556 6.704 107.275 2.614 111.93 0 C 114.136 1.165 116.395 2.363 118.72 3.601 C 125.137 6.641 128.332 13.028 123.793 19.186 Z",
    fill: sdC.leafGrey,
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(32.63,0)",
    opacity: swirlO
  }, /*#__PURE__*/React.createElement("g", {
    style: {
      transform: `scale(${0.7 + 0.3 * swirl}) rotate(${(1 - swirl) * -16}deg)`,
      transformBox: "fill-box",
      transformOrigin: "center"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 130.745 55.156 C 73.126 24.485 52.721 16.054 51.203 18.906 C 49.559 21.998 64.324 43.819 79.108 65.654 C 97.718 93.144 116.345 120.668 108.441 135.837 C 100.785 150.53 77.151 150.584 5.62 113.23 C -2.472 108.633 -3.79 88.197 15.044 79.161 C 11.462 84.262 10.528 89.916 16.104 93.06 C 68.304 120.279 86.957 127.879 88.275 125.348 C 89.97 122.096 75.159 100.213 60.364 78.363 C 41.753 50.865 23.158 23.387 31.214 8.244 C 39.125 -6.626 68.813 -3.481 141.405 35.162 C 152.208 40.571 158.984 55.266 135.818 70.744 C 140.364 64.582 137.163 58.197 130.745 55.156 Z",
    fill: sdC.cyan,
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("g", {
    transform: "translate(0,24.687)",
    opacity: dotO
  }, /*#__PURE__*/React.createElement("g", {
    style: {
      transform: `translateY(${(1 - dot) * -80}px) scale(${0.5 + 0.5 * dot})`,
      transformBox: "fill-box",
      transformOrigin: "center"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 19.023 0 C 29.53 0 38.049 8.521 38.049 19.031 C 38.049 29.539 29.53 38.061 19.023 38.061 C 8.518 38.059 0 29.539 0 19.031 C 0 8.52 8.518 0 19.023 0 Z",
    fill: sdC.orange,
    fillRule: "evenodd"
  }))));
}

// ── Scene 1 · Logo open (0–5.5) ─────────────────────────────────────────────
function SdScene1() {
  return /*#__PURE__*/React.createElement(SdScene, {
    start: 0,
    end: 5.5,
    zoomFrom: 1.02,
    zoomTo: 1,
    fadeIn: 0.01
  }, /*#__PURE__*/React.createElement(Sprite, {
    start: 0,
    end: 5.5,
    keepMounted: true
  }, ({
    localTime
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 960,
      top: 330,
      transform: "translateX(-50%)"
    }
  }, /*#__PURE__*/React.createElement(SdLogoMark, {
    lt: localTime,
    width: 310,
    at: 0.3
  }))), /*#__PURE__*/React.createElement(SdItem, {
    x: 0,
    y: 620,
    at: 2.1,
    dur: 0.7,
    w: 1920,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.bold,
      fontWeight: 700,
      fontSize: 96,
      letterSpacing: "-2px",
      color: sdC.ink
    }
  }, "Sandhata UI")), /*#__PURE__*/React.createElement(SdItem, {
    x: 0,
    y: 760,
    at: 2.7,
    dur: 0.7,
    w: 1920,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.light,
      fontWeight: 300,
      fontSize: 34,
      color: sdC.n700
    }
  }, "Beautifully designed components you can customise, extend, and build on.")));
}

// ── Scene 2 · Colour (5.5–11.5) ─────────────────────────────────────────────
function SdSwatchCard({
  x,
  y,
  at,
  color,
  name,
  hex
}) {
  return /*#__PURE__*/React.createElement(SdItem, {
    x: x,
    y: y,
    at: at,
    dur: 0.6,
    dy: 34
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 210,
      borderRadius: 12,
      background: color,
      boxShadow: "0 1px 2px rgba(20,22,24,0.06)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.bold,
      fontWeight: 700,
      fontSize: 24,
      color: sdC.ink,
      marginTop: 18
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 20,
      color: sdC.n500,
      marginTop: 6
    }
  }, hex)));
}
function SdScene2() {
  const neutrals = [["0", "#FFFFFF"], ["50", sdC.n50], ["100", sdC.n100], ["200", sdC.n200], ["300", sdC.n300], ["500", sdC.n500], ["700", sdC.n700], ["900", sdC.n900], ["950", sdC.ink]];
  const status = [["Success", sdC.success], ["Error", sdC.error], ["Alert", sdC.alert], ["Info", sdC.info]];
  return /*#__PURE__*/React.createElement(SdScene, {
    start: 5.5,
    end: 11.5
  }, /*#__PURE__*/React.createElement(SdSceneLabel, {
    num: "01",
    title: "Colour"
  }), /*#__PURE__*/React.createElement(SdSwatchCard, {
    x: 160,
    y: 300,
    at: 0.6,
    color: sdC.blue,
    name: "primaryblue-500",
    hex: "#0036DD"
  }), /*#__PURE__*/React.createElement(SdSwatchCard, {
    x: 593,
    y: 300,
    at: 0.75,
    color: sdC.blueBright,
    name: "primaryblue-400",
    hex: "#445CFF"
  }), /*#__PURE__*/React.createElement(SdSwatchCard, {
    x: 1026,
    y: 300,
    at: 0.9,
    color: sdC.purple,
    name: "purple-500",
    hex: "#602DEA"
  }), /*#__PURE__*/React.createElement(SdSwatchCard, {
    x: 1459,
    y: 300,
    at: 1.05,
    color: sdC.navy,
    name: "secondaryblue-500",
    hex: "#1F2A54"
  }), /*#__PURE__*/React.createElement(Sprite, {
    start: 5.5,
    end: 11.5,
    keepMounted: true
  }, ({
    localTime
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 160,
      top: 660,
      display: "flex"
    }
  }, neutrals.map(([step, hex], i) => {
    const e = sdP(localTime, 1.9 + i * 0.09, 0.5);
    return /*#__PURE__*/React.createElement("div", {
      key: step,
      style: {
        opacity: e,
        transform: `translateY(${(1 - e) * 22}px)`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 178,
        height: 96,
        background: hex,
        border: "1px solid rgba(20,22,24,0.08)",
        borderRadius: i === 0 ? "10px 0 0 10px" : i === neutrals.length - 1 ? "0 10px 10px 0" : 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: sdF.mono,
        fontSize: 18,
        color: sdC.n500,
        marginTop: 12
      }
    }, step));
  }))), /*#__PURE__*/React.createElement(SdItem, {
    x: 160,
    y: 850,
    at: 3.1,
    dur: 0.5
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.light,
      fontWeight: 300,
      fontSize: 26,
      color: sdC.n700
    }
  }, "A cool neutral scale \u2014 colour is used sparingly and purposefully.")), /*#__PURE__*/React.createElement(Sprite, {
    start: 5.5,
    end: 11.5,
    keepMounted: true
  }, ({
    localTime
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 160,
      top: 930,
      display: "flex",
      gap: 28
    }
  }, status.map(([name, hex], i) => {
    const e = sdP(localTime, 3.6 + i * 0.12, 0.5, Easing.easeOutBack);
    return /*#__PURE__*/React.createElement("div", {
      key: name,
      style: {
        opacity: clamp(e * 2, 0, 1),
        transform: `scale(${0.6 + 0.4 * e})`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        border: `1px solid ${sdC.n200}`,
        borderRadius: 999,
        padding: "12px 26px",
        background: "#fff"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 999,
        background: hex,
        display: "block"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.normal,
        fontSize: 22,
        color: sdC.n900
      }
    }, name));
  }))));
}

// ── Scene 3 · Typography (11.5–17.5) ────────────────────────────────────────
function SdScene3() {
  const rows = [{
    label: "Light",
    family: sdF.light,
    weight: 300,
    text: "Soft body and captions",
    at: 1.7
  }, {
    label: "Regular",
    family: sdF.normal,
    weight: 400,
    text: "Interface and body copy",
    at: 1.9
  }, {
    label: "Bold",
    family: sdF.bold,
    weight: 700,
    text: "Display and headings",
    at: 2.1
  }];
  const scaleLine = "display-large 48/64   ·   heading-h1 24/32   ·   body-medium 14/20   ·   caption 12/16";
  return /*#__PURE__*/React.createElement(SdScene, {
    start: 11.5,
    end: 17.5
  }, /*#__PURE__*/React.createElement(SdSceneLabel, {
    num: "02",
    title: "Typography"
  }), /*#__PURE__*/React.createElement(Sprite, {
    start: 11.5,
    end: 17.5,
    keepMounted: true
  }, ({
    localTime
  }) => {
    const e = sdP(localTime, 0.5, 1.3, Easing.easeOutQuart);
    const o = clamp((localTime - 0.5) / 0.6, 0, 1);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 160,
        top: 270,
        opacity: o,
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 210,
        lineHeight: 1,
        color: sdC.ink,
        letterSpacing: `${0.09 - 0.095 * e}em`,
        whiteSpace: "nowrap"
      }
    }, "Akkurat");
  }), rows.map((r, i) => /*#__PURE__*/React.createElement(SdItem, {
    key: r.label,
    x: 160,
    y: 570 + i * 92,
    at: r.at,
    dur: 0.6
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 20,
      color: sdC.blue,
      width: 110
    }
  }, r.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: r.family,
      fontWeight: r.weight,
      fontSize: 46,
      color: sdC.n900
    }
  }, r.text)))), /*#__PURE__*/React.createElement(SdItem, {
    x: 160,
    y: 570 + 3 * 92,
    at: 2.3,
    dur: 0.6
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 20,
      color: sdC.blue,
      width: 110
    }
  }, "Mono"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 38,
      color: sdC.n900
    }
  }, "Code and tabular numbers \u2014 24,828"))), /*#__PURE__*/React.createElement(Sprite, {
    start: 11.5,
    end: 17.5,
    keepMounted: true
  }, ({
    localTime
  }) => {
    const n = Math.floor(sdP(localTime, 3.4, 1.6, Easing.linear) * scaleLine.length);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 160,
        top: 968,
        fontFamily: sdF.mono,
        fontSize: 22,
        color: sdC.n500,
        whiteSpace: "pre"
      }
    }, scaleLine.slice(0, n), /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: n < scaleLine.length ? 1 : 0,
        color: sdC.blue
      }
    }, "\u258C"));
  }));
}
Object.assign(window, {
  sdC,
  sdF,
  sdP,
  SdItem,
  SdScene,
  SdSceneLabel,
  SdLogoMark,
  SdScene1,
  SdScene2,
  SdScene3
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "motion/IntroScenes1.jsx", error: String((e && e.message) || e) }); }

// motion/IntroScenes2.jsx
try { (() => {
// Sandhata intro film — scenes 4–6 (components, surfaces, outro).
// Uses helpers from IntroScenes1.jsx (sdC, sdF, sdP, SdItem, SdScene, …).

// ── Scene 4 · Components (17.5–24.5) ────────────────────────────────────────
// A primary button assembles from tokens, then the wider kit pops in around it.

function SdCallout({
  lt,
  at,
  x,
  y,
  text,
  lineTo
}) {
  const e = sdP(lt, at, 0.5);
  const out = 1 - sdP(lt, 3.55, 0.4, Easing.easeInQuad); // all callouts retire together
  const o = clamp(e * out, 0, 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: x,
      top: y,
      opacity: o
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 22,
      color: sdC.purple,
      whiteSpace: "nowrap"
    }
  }, text), lineTo && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: lineTo.x,
      top: lineTo.y,
      width: lineTo.w * e,
      height: 1,
      background: sdC.n300,
      transformOrigin: "left"
    }
  }));
}
function SdScene4() {
  return /*#__PURE__*/React.createElement(SdScene, {
    start: 17.5,
    end: 24.5,
    zoomFrom: 1.07,
    zoomTo: 1,
    origin: "50% 48%"
  }, /*#__PURE__*/React.createElement(SdSceneLabel, {
    num: "03",
    title: "Components"
  }), /*#__PURE__*/React.createElement(Sprite, {
    start: 17.5,
    end: 24.5,
    keepMounted: true
  }, ({
    localTime: lt
  }) => {
    const outline = sdP(lt, 0.6, 0.5);
    const fill = sdP(lt, 1.15, 0.5);
    const label = sdP(lt, 1.55, 0.4);
    const settle = sdP(lt, 3.55, 0.6, Easing.easeOutBack); // little confirm-pop when callouts leave
    const pop = at => ({
      e: sdP(lt, at, 0.55, Easing.easeOutBack),
      o: clamp((lt - at) / 0.25, 0, 1)
    });
    const sat = (at, style = {}) => {
      const {
        e,
        o
      } = pop(at);
      return {
        opacity: o,
        transform: `translateY(${(1 - e) * 18}px) scale(${0.7 + 0.3 * e})`,
        transformOrigin: "center",
        ...style
      };
    };
    const knob = sdP(lt, 5.2, 0.35, Easing.easeInOutCubic);
    const halo = sdP(lt, 5.45, 0.4);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 820,
        top: 504,
        width: 280,
        height: 72,
        borderRadius: 8,
        border: `2px dashed ${sdC.blue200}`,
        opacity: outline * (1 - fill),
        transform: `scale(${0.92 + 0.08 * outline})`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 820,
        top: 504,
        width: 280,
        height: 72,
        borderRadius: 8,
        background: sdC.blue,
        opacity: fill,
        transform: `scale(${1 + 0.05 * Math.sin(settle * Math.PI)})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,54,221,0.25)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 28,
        color: "#fff",
        opacity: label
      }
    }, "Get started")), /*#__PURE__*/React.createElement(SdCallout, {
      lt: lt,
      at: 1.9,
      x: 1150,
      y: 420,
      text: "--radius-md: 6px",
      lineTo: {
        x: -10,
        y: 40,
        w: -0
      }
    }), /*#__PURE__*/React.createElement(SdCallout, {
      lt: lt,
      at: 2.15,
      x: 500,
      y: 530,
      text: "--background-action",
      lineTo: {
        x: 250,
        y: 14,
        w: 60
      }
    }), /*#__PURE__*/React.createElement(SdCallout, {
      lt: lt,
      at: 2.4,
      x: 830,
      y: 620,
      text: "font: 700 16px var(--font-bold)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 648,
        top: 386,
        ...sat(3.9)
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 20,
        color: sdC.blue,
        background: sdC.blue50,
        borderRadius: 999,
        padding: "8px 22px"
      }
    }, "New")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 1218,
        top: 372,
        ...sat(4.05)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 68,
        height: 68,
        borderRadius: 999,
        background: sdC.navy,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 24
      }
    }, "SD")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 1268,
        top: 548,
        ...sat(4.2)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 84,
        height: 48,
        borderRadius: 999,
        background: knob > 0.5 ? sdC.blue : sdC.n300,
        transition: "background 200ms",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 5,
        left: 6 + knob * 36,
        width: 38,
        height: 38,
        borderRadius: 999,
        background: "#fff",
        boxShadow: "0 1px 3px rgba(20,22,24,0.3)"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 420,
        top: 656,
        ...sat(4.35)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: sdF.normal,
        fontSize: 19,
        color: sdC.n700,
        marginBottom: 8
      }
    }, "Email"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 330,
        height: 58,
        borderRadius: 6,
        border: `1.5px solid ${halo > 0.1 ? sdC.purple : sdC.n300}`,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        fontFamily: sdF.normal,
        fontSize: 22,
        color: sdC.n500,
        boxShadow: `0 0 0 ${4 * halo}px rgba(96,45,234,0.18)`
      }
    }, "you@company.com")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 700,
        top: 812,
        ...sat(4.5)
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily: sdF.normal,
        fontSize: 21,
        color: sdC.n900,
        background: sdC.n100,
        borderRadius: 999,
        padding: "10px 24px"
      }
    }, "Design tokens ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: sdC.n500,
        fontSize: 24,
        lineHeight: 0
      }
    }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 1080,
        top: 776,
        ...sat(4.65)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: `1px solid ${sdC.n200}`,
        borderLeft: `3px solid ${sdC.success}`,
        borderRadius: 8,
        background: "#fff",
        padding: "16px 26px",
        boxShadow: "0 2px 8px rgba(20,22,24,0.07)"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "26",
      height: "26",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: sdC.success,
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 12.5l2.6 2.6L16 9.5"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.normal,
        fontSize: 22,
        color: sdC.n900
      }
    }, "Changes saved"))));
  }));
}

// ── Scene 5 · Surfaces (24.5–30.5) ──────────────────────────────────────────
// A mini dashboard assembles itself: sidebar, stats, a chart drawing on.

function SdStat({
  label,
  value,
  delta,
  up
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      border: `1px solid ${sdC.n200}`,
      borderRadius: 8,
      padding: "16px 20px",
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.normal,
      fontSize: 14,
      color: sdC.n500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.bold,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: "-0.5px",
      color: sdC.ink
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: sdF.mono,
      fontSize: 14,
      color: up ? sdC.success : sdC.error
    }
  }, delta)));
}
function SdScene5() {
  const navItems = ["Overview", "Pipelines", "Releases", "Environments", "Settings"];
  const s1 = "0,150 80,138 160,142 240,110 320,118 400,88 480,96 560,62 640,70 720,40 800,52 880,22 960,30";
  const s2 = "0,190 80,184 160,170 240,176 320,150 400,158 480,132 560,140 640,118 720,126 800,100 880,110 960,86";
  return /*#__PURE__*/React.createElement(SdScene, {
    start: 24.5,
    end: 30.5,
    zoomFrom: 1,
    zoomTo: 1.12,
    origin: "58% 40%"
  }, /*#__PURE__*/React.createElement(SdSceneLabel, {
    num: "04",
    title: "Surfaces"
  }), /*#__PURE__*/React.createElement(Sprite, {
    start: 24.5,
    end: 30.5,
    keepMounted: true
  }, ({
    localTime: lt
  }) => {
    const frame = sdP(lt, 0.25, 0.7);
    const side = sdP(lt, 0.55, 0.6);
    const head = sdP(lt, 0.8, 0.5);
    const draw = sdP(lt, 1.7, 1.5, Easing.easeInOutCubic);
    const area = sdP(lt, 2.6, 0.8);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 340,
        top: 246,
        width: 1240,
        height: 700,
        opacity: frame,
        transform: `scale(${0.96 + 0.04 * frame})`,
        transformOrigin: "center",
        borderRadius: 12,
        border: `1px solid ${sdC.n200}`,
        background: "#fff",
        boxShadow: "0 24px 64px rgba(20,22,24,0.12)",
        overflow: "hidden",
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 230,
        borderRight: `1px solid ${sdC.n100}`,
        background: sdC.n50,
        padding: "20px 14px",
        transform: `translateX(${(side - 1) * 230}px)`,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 10px 18px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../assets/logo/sandhata-mark.svg",
      alt: "",
      style: {
        height: 22
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 16,
        color: sdC.ink
      }
    }, "Sandhata")), navItems.map((n, i) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        padding: "10px 12px",
        borderRadius: 6,
        marginBottom: 2,
        background: i === 1 ? sdC.blue50 : "transparent",
        fontFamily: i === 1 ? sdF.bold : sdF.normal,
        fontWeight: i === 1 ? 700 : 400,
        fontSize: 15,
        color: i === 1 ? sdC.blue : sdC.n700,
        opacity: clamp((side - 0.3) * 2 - i * 0.12, 0, 1)
      }
    }, n))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: "22px 28px",
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: head,
        transform: `translateY(${(1 - head) * 14}px)`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: "-0.25px",
        color: sdC.ink
      }
    }, "Pipelines"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 15,
        color: "#fff",
        background: sdC.blue,
        borderRadius: 6,
        padding: "10px 18px"
      }
    }, "New pipeline")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16,
        marginTop: 20
      }
    }, [{
      label: "Active pipelines",
      value: "24,828",
      delta: "+12%",
      up: true,
      at: 1.0
    }, {
      label: "Deployments today",
      value: "312",
      delta: "+4%",
      up: true,
      at: 1.15
    }, {
      label: "Failed runs",
      value: "7",
      delta: "−18%",
      up: true,
      at: 1.3
    }].map(s => {
      const e = sdP(lt, s.at, 0.5, Easing.easeOutBack);
      return /*#__PURE__*/React.createElement("div", {
        key: s.label,
        style: {
          flex: 1,
          opacity: clamp(e * 2, 0, 1),
          transform: `translateY(${(1 - e) * 16}px)`,
          display: "flex"
        }
      }, /*#__PURE__*/React.createElement(SdStat, s));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${sdC.n200}`,
        borderRadius: 8,
        marginTop: 16,
        padding: "18px 22px",
        opacity: sdP(lt, 1.45, 0.5)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.bold,
        fontWeight: 700,
        fontSize: 17,
        color: sdC.ink
      }
    }, "Throughput"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: sdF.mono,
        fontSize: 13,
        color: sdC.n500
      }
    }, "last 90 days")), /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      height: "220",
      viewBox: "0 0 960 220",
      preserveAspectRatio: "none",
      style: {
        display: "block"
      }
    }, [55, 110, 165].map(y => /*#__PURE__*/React.createElement("line", {
      key: y,
      x1: "0",
      y1: y,
      x2: "960",
      y2: y,
      stroke: sdC.n100,
      strokeWidth: "1"
    })), /*#__PURE__*/React.createElement("polygon", {
      points: `${s1} 960,220 0,220`,
      fill: sdC.purple,
      opacity: 0.07 * area
    }), /*#__PURE__*/React.createElement("polyline", {
      points: s1,
      fill: "none",
      stroke: sdC.purple,
      strokeWidth: "3",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - draw,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: s2,
      fill: "none",
      stroke: sdC.blueBright,
      strokeWidth: "3",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - sdP(lt, 1.9, 1.5, Easing.easeInOutCubic),
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })))));
  }), /*#__PURE__*/React.createElement(SdItem, {
    x: 160,
    y: 990,
    at: 3.4,
    dur: 0.6
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.light,
      fontWeight: 300,
      fontSize: 26,
      color: sdC.n700
    }
  }, "Whole surfaces, assembled from the same tokens.")));
}

// ── Scene 6 · Outro (30.5–36) ───────────────────────────────────────────────
function SdScene6() {
  return /*#__PURE__*/React.createElement(SdScene, {
    start: 30.5,
    end: 36,
    zoomFrom: 1,
    zoomTo: 1.03,
    fadeOut: 0.01
  }, /*#__PURE__*/React.createElement(Sprite, {
    start: 30.5,
    end: 36,
    keepMounted: true
  }, ({
    localTime
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 960,
      top: 300,
      transform: "translateX(-50%)"
    }
  }, /*#__PURE__*/React.createElement(SdLogoMark, {
    lt: localTime + 1.4,
    width: 170,
    at: 0
  }))), /*#__PURE__*/React.createElement(SdItem, {
    x: 0,
    y: 490,
    at: 0.5,
    dur: 0.7,
    w: 1920,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.bold,
      fontWeight: 700,
      fontSize: 80,
      letterSpacing: "-1.5px",
      color: sdC.ink
    }
  }, "Sandhata Design System")), /*#__PURE__*/React.createElement(SdItem, {
    x: 0,
    y: 610,
    at: 1.0,
    dur: 0.7,
    w: 1920,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: sdF.light,
      fontWeight: 300,
      fontSize: 32,
      color: sdC.n700
    }
  }, "Tokens, components and full surfaces \u2014 ready to build on.")), /*#__PURE__*/React.createElement(Sprite, {
    start: 30.5,
    end: 36,
    keepMounted: true
  }, ({
    localTime
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 720,
      width: 1920,
      display: "flex",
      justifyContent: "center",
      gap: 20
    }
  }, ["Components", "Documentation", "Demo"].map((n, i) => {
    const e = sdP(localTime, 1.5 + i * 0.14, 0.5, Easing.easeOutBack);
    return /*#__PURE__*/React.createElement("span", {
      key: n,
      style: {
        opacity: clamp(e * 2, 0, 1),
        transform: `scale(${0.7 + 0.3 * e})`,
        fontFamily: sdF.normal,
        fontSize: 24,
        color: i === 0 ? "#fff" : sdC.n900,
        background: i === 0 ? sdC.blue : "#fff",
        border: `1px solid ${i === 0 ? sdC.blue : sdC.n200}`,
        borderRadius: 999,
        padding: "14px 34px"
      }
    }, n);
  }))));
}
Object.assign(window, {
  SdScene4,
  SdScene5,
  SdScene6
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "motion/IntroScenes2.jsx", error: String((e && e.message) || e) }); }

// motion/animations.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// animations.jsx
// Reusable animation starter: Stage, Timeline, Sprite, easing helpers.
// Exports (to window): Stage, Sprite, PlaybackBar, TextSprite, ImageSprite, RectSprite,
//   useTime, useTimeline, useSprite, Easing, interpolate, animate, clamp.
//
// Usage (in an HTML file that loads React + Babel):
//
//   <Stage width={1280} height={720} duration={10} background="#f6f4ef">
//     <MyScene />
//   </Stage>
//
// <Stage> auto-scales to the viewport and provides the scrubber, play/pause,
// ←/→ seek, space, and 0-to-reset controls, and persists the playhead.
// Inside <Stage>, any child can call useTime() to read the current
// playhead (seconds). Or wrap content in <Sprite start={1} end={4}>...</Sprite>
// to only render during that window -- children receive a `localTime` and
// `progress` via the useSprite() hook. Use Easing + interpolate()/animate()
// for tweens; TextSprite / ImageSprite / RectSprite have built-in entry/exit.
// Build YOUR scenes by composing Sprites inside a Stage.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: t => t,
  // Quad
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // Cubic
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // Quart
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // Expo
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  // Sine
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  // Back (overshoot)
  easeOutBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: t => {
    const c1 = 1.70158,
      c2 = c1 * 1.525;
    return t < 0.5 ? Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  // Elastic
  easeOutElastic: t => {
    const c4 = 2 * Math.PI / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return t => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic
}) {
  return t => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({
  time: 0,
  duration: 10,
  playing: false
});
const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only when the playhead is inside [start, end]. Provides
// a sub-context with `localTime` (seconds since start) and `progress` (0..1).
//
//   <Sprite start={2} end={5}>
//     {({ localTime, progress }) => <Thing x={progress * 100} />}
//   </Sprite>
//
// Or as a plain wrapper — children can call useSprite() themselves.

const SpriteContext = React.createContext({
  localTime: 0,
  progress: 0,
  duration: 0
});
const useSprite = () => React.useContext(SpriteContext);
function Sprite({
  start = 0,
  end = Infinity,
  children,
  keepMounted = false
}) {
  const {
    time
  } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;
  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;
  const value = {
    localTime,
    progress,
    duration,
    visible
  };
  return /*#__PURE__*/React.createElement(SpriteContext.Provider, {
    value: value
  }, typeof children === 'function' ? children(value) : children);
}

// ── Sample sprite components ────────────────────────────────────────────────

// TextSprite: fades/slides text in on entry, holds, then fades out on exit.
// Props: text, x, y, size, color, font, entryDur, exitDur, align
function TextSprite({
  text,
  x = 0,
  y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em'
}) {
  const {
    localTime,
    duration
  } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let ty = 0;
  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * 8;
  }
  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity'
    }
  }, text);
}

// ImageSprite: scales + fades in; optional Ken Burns drift during hold.
function ImageSprite({
  src,
  x = 0,
  y = 0,
  width = 400,
  height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null // {label: string} for striped placeholder
}) {
  const {
    localTime,
    duration
  } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let scale = 1;
  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0;
    scale = 1 + (kenBurnsScale - 1) * holdT;
  }
  const content = placeholder ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, placeholder.label || 'image') : /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: fit,
      display: 'block'
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity'
    }
  }, content);
}

// RectSprite: simple rectangle that animates position/size/color via props.
// Useful demo primitive — takes a `render` fn for per-frame customization.
function RectSprite({
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render // optional: (ctx) => style overrides
}) {
  const spriteCtx = useSprite();
  const {
    localTime,
    duration
  } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let scale = 1;
  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1);
    scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = 1 - 0.15 * t;
  }
  const overrides = render ? render(spriteCtx) : {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides
    }
  });
}
function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children
}) {
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch {
      return 0;
    }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey + ':t', String(time));
    } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(el.clientWidth / width, (el.clientHeight - barH) / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = ts => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);
  const displayTime = hoverTime != null ? hoverTime : time;
  const ctxValue = React.useMemo(() => ({
    time: displayTime,
    duration,
    playing,
    setTime,
    setPlaying
  }), [displayTime, duration, playing]);
  return /*#__PURE__*/React.createElement("div", {
    ref: stageRef,
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#0a0a0a',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: canvasRef,
    style: {
      width,
      height,
      background,
      position: 'relative',
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      flexShrink: 0,
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(TimelineContext.Provider, {
    value: ctxValue
  }, children))), /*#__PURE__*/React.createElement(PlaybackBar, {
    time: displayTime,
    actualTime: time,
    duration: duration,
    playing: playing,
    onPlayPause: () => setPlaying(p => !p),
    onReset: () => {
      setTime(0);
    },
    onSeek: t => setTime(t),
    onHover: t => setHoverTime(t)
  }));
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const timeFromEvent = React.useCallback(e => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);
  const onTrackMove = e => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };
  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };
  const onTrackDown = e => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };
  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = e => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);
  const pct = duration > 0 ? time / duration * 100 : 0;
  const fmt = t => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor(total * 100 % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };
  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    onClick: onReset,
    title: "Return to start (0)"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2v10M12 2L5 7l7 5V2z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement(IconButton, {
    onClick: onPlayPause,
    title: "Play/pause (space)"
  }, playing ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2l9 5-9 5V2z",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'right',
      color: '#f6f4ef'
    }
  }, fmt(time)), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseMove: onTrackMove,
    onMouseLeave: onTrackLeave,
    onMouseDown: onTrackDown,
    style: {
      flex: 1,
      height: 22,
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 4,
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      width: `${pct}%`,
      height: 4,
      background: 'oklch(72% 0.12 250)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${pct}%`,
      top: '50%',
      width: 12,
      height: 12,
      marginLeft: -6,
      marginTop: -6,
      background: '#fff',
      borderRadius: 6,
      boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'left',
      color: 'rgba(246,244,239,0.55)'
    }
  }, fmt(duration)));
}
function IconButton({
  children,
  onClick,
  title
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 6,
      color: '#f6f4ef',
      cursor: 'pointer',
      padding: 0,
      transition: 'background 120ms'
    }
  }, children);
}
Object.assign(window, {
  Easing,
  interpolate,
  animate,
  clamp,
  TimelineContext,
  useTime,
  useTimeline,
  Sprite,
  SpriteContext,
  useSprite,
  TextSprite,
  ImageSprite,
  RectSprite,
  Stage,
  PlaybackBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "motion/animations.jsx", error: String((e && e.message) || e) }); }

// ui_kits/showcase/Charts.jsx
try { (() => {
// Sandhata showcase — lightweight SVG data-viz mocks (purple/blue palette).
// Exported to window for use across showcase view files.

function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}
function LineChart({
  height = 220,
  color = "var(--colour-alternativepurple-400)",
  seed = 1,
  fill = true
}) {
  const W = 800,
    H = height,
    pad = 12;
  const n = 40;
  const vals = [];
  let r = seed * 9301;
  const rnd = () => {
    r = (r * 9301 + 49297) % 233280;
    return r / 233280;
  };
  for (let i = 0; i < n; i++) vals.push(0.25 + 0.6 * Math.abs(Math.sin(i * 0.6 + seed) * rnd()));
  const pts = vals.map((v, i) => [pad + i / (n - 1) * (W - pad * 2), H - pad - v * (H - pad * 2)]);
  const line = smoothPath(pts);
  const area = `${line} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`;
  const gid = `g${seed}`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: "100%",
      height,
      display: "block"
    },
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), fill && /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: `url(#${gid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "2"
  }));
}
function PieChart({
  size = 150,
  data
}) {
  const slices = data || [{
    v: 35,
    c: "var(--colour-primaryblue-500)"
  }, {
    v: 25,
    c: "var(--colour-alternativepurple-400)"
  }, {
    v: 20,
    c: "var(--colour-primaryblue-300)"
  }, {
    v: 12,
    c: "var(--colour-secondarycyan-500)"
  }, {
    v: 8,
    c: "var(--colour-primaryblue-800)"
  }];
  const total = slices.reduce((a, s) => a + s.v, 0);
  const R = size / 2,
    cx = R,
    cy = R;
  let angle = -Math.PI / 2;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    style: {
      width: size,
      height: size
    }
  }, slices.map((s, i) => {
    const a0 = angle;
    const a1 = angle + s.v / total * Math.PI * 2;
    angle = a1;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + R * Math.cos(a0),
      y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1),
      y1 = cy + R * Math.sin(a1);
    return /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`,
      fill: s.c
    });
  }));
}
function RadialChart({
  size = 150
}) {
  const rings = [{
    r: 0.92,
    c: "var(--colour-alternativepurple-300)",
    v: 0.7
  }, {
    r: 0.72,
    c: "var(--colour-primaryblue-400)",
    v: 0.55
  }, {
    r: 0.52,
    c: "var(--colour-alternativepurple-500)",
    v: 0.85
  }, {
    r: 0.32,
    c: "var(--colour-primaryblue-700)",
    v: 0.4
  }];
  const cx = size / 2,
    cy = size / 2,
    base = size / 2;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    style: {
      width: size,
      height: size
    }
  }, rings.map((ring, i) => {
    const R = base * ring.r;
    const a0 = -Math.PI / 2;
    const a1 = a0 + ring.v * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + R * Math.cos(a0),
      y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1),
      y1 = cy + R * Math.sin(a1);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: R,
      fill: "none",
      stroke: "var(--colour-neutral-100)",
      strokeWidth: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`,
      fill: "none",
      stroke: ring.c,
      strokeWidth: "7",
      strokeLinecap: "round"
    }));
  }));
}
function RadarChart({
  size = 170
}) {
  const cx = size / 2,
    cy = size / 2,
    R = size / 2 - 16;
  const axes = 6;
  const vals = [0.8, 0.55, 0.7, 0.45, 0.9, 0.6];
  const pt = (i, f) => {
    const a = -Math.PI / 2 + i / axes * Math.PI * 2;
    return [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)];
  };
  const grid = [0.33, 0.66, 1].map(f => Array.from({
    length: axes
  }, (_, i) => pt(i, f).join(",")).join(" "));
  const poly = Array.from({
    length: axes
  }, (_, i) => pt(i, vals[i]).join(",")).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    style: {
      width: size,
      height: size
    }
  }, grid.map((g, i) => /*#__PURE__*/React.createElement("polygon", {
    key: i,
    points: g,
    fill: "none",
    stroke: "var(--colour-neutral-200)",
    strokeWidth: "1"
  })), Array.from({
    length: axes
  }, (_, i) => {
    const [x, y] = pt(i, 1);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "var(--colour-neutral-200)",
      strokeWidth: "1"
    });
  }), /*#__PURE__*/React.createElement("polygon", {
    points: poly,
    fill: "var(--colour-alternativepurple-400)",
    fillOpacity: "0.25",
    stroke: "var(--colour-alternativepurple-500)",
    strokeWidth: "2"
  }));
}
Object.assign(window, {
  LineChart,
  PieChart,
  RadialChart,
  RadarChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/showcase/Charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/showcase/Chrome.jsx
try { (() => {
// Sandhata showcase chrome: top bar, hero, category nav, view sub-nav, colour-scheme switcher.

const SchemeOptions = [{
  key: "blue",
  label: "Blue",
  color: "var(--colour-primaryblue-500)"
}, {
  key: "purple",
  label: "Purple",
  color: "var(--colour-alternativepurple-500)"
}, {
  key: "cyan",
  label: "Cyan",
  color: "var(--colour-secondarycyan-500)"
}, {
  key: "rose",
  label: "Rose",
  color: "var(--colour-alternativerosepink-500)"
}];
function Ico({
  d,
  size = 16,
  stroke = 2
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, d);
}
function TopBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 72,
      padding: "0 32px",
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/sandhata-logo.svg",
    alt: "Sandhata",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      width: 340,
      height: 38,
      padding: "0 12px",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      color: "var(--icon-secondary)"
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    }))
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 14,
      color: "var(--text-caption)"
    }
  }, "Search anything here")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: "var(--text-subtitle)"
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    d: /*#__PURE__*/React.createElement("path", {
      d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25"
    }),
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 14
    }
  }, "95.7k"))));
}
function Hero() {
  const [copied, setCopied] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "56px 24px 40px",
      background: "var(--gradient-hero)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sd-display-md",
    style: {
      margin: 0
    }
  }, "Sandhata Design System"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px auto 28px",
      maxWidth: 460,
      fontFamily: "var(--font-normal)",
      fontSize: "var(--body-large-size)",
      color: "var(--text-subtitle)"
    }
  }, "A set of beautifully designed components that you can customise, extend, and build on."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      height: 40,
      padding: "0 8px 0 14px",
      background: "var(--surface-raised)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-body)"
    }
  }, "npm install sandhata-ui"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    },
    style: {
      display: "inline-flex",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--icon-secondary)"
    },
    "aria-label": "Copy"
  }, /*#__PURE__*/React.createElement(Ico, {
    d: copied ? /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "9",
      width: "13",
      height: "13",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    }))
  }))), /*#__PURE__*/React.createElement("a", {
    href: "../../docs/index.html",
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 15,
      color: "var(--text-body)",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, "View documentation ", /*#__PURE__*/React.createElement(Ico, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    })),
    size: 14
  }))));
}
function CategoryNav({
  scheme,
  setScheme
}) {
  const cats = ["All components", "Base components", "Complex components", "Colour", "Templates"];
  const [active, setActive] = React.useState("Base components");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      background: "var(--surface-secondary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, cats.map(c => {
    const on = c === active;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => setActive(c),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 38,
        padding: "0 14px",
        border: `1px solid ${on ? "var(--border-default)" : "transparent"}`,
        borderRadius: "var(--radius-md)",
        background: on ? "var(--surface-raised)" : "transparent",
        cursor: "pointer",
        fontFamily: "var(--font-normal)",
        fontSize: 14,
        color: on ? "var(--text-title)" : "var(--text-caption)",
        boxShadow: on ? "var(--shadow-xs)" : "none"
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z"
      })),
      size: 15
    }), c);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 13,
      color: "var(--text-caption)"
    }
  }, "Colour scheme"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      padding: 4,
      background: "var(--surface-raised)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)"
    }
  }, SchemeOptions.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    onClick: () => setScheme(s.key),
    title: s.label,
    "aria-label": s.label,
    style: {
      width: 26,
      height: 26,
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      border: `2px solid ${scheme === s.key ? "var(--text-title)" : "transparent"}`,
      background: s.color,
      padding: 0
    }
  })))));
}
Object.assign(window, {
  Ico,
  TopBar,
  Hero,
  CategoryNav,
  SchemeOptions
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/showcase/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/showcase/DashboardView.jsx
try { (() => {
// Sandhata showcase — Dashboard view: stat header, charts, data table.

function DashboardView() {
  const {
    Card,
    StatCard,
    Badge
  } = window.SandhataDesignSystem_081a0e;
  const Trend = () => /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: "var(--font-normal)",
      fontSize: 12,
      color: "var(--text-success)"
    }
  }, "Trending up by 5.2% this month", /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 17 9 11 13 15 21 7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 7 21 7 21 14"
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "20px 24px 0"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sd-h2"
  }, "Line Chart \u2014 Interactive"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: 14,
      color: "var(--text-caption)"
    }
  }, "Showing total visitors for the last 3 months")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 22px",
      borderRight: "1px solid var(--border-subtle)",
      background: "var(--surface-secondary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 12,
      color: "var(--text-caption)"
    }
  }, "Desktop"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 22,
      color: "var(--text-title)"
    }
  }, "24,828")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 12,
      color: "var(--text-caption)"
    }
  }, "Mobile"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 22,
      color: "var(--text-title)"
    }
  }, "25,010")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px 16px"
    }
  }, /*#__PURE__*/React.createElement(window.LineChart, {
    height: 210,
    color: "var(--colour-alternativepurple-400)",
    seed: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0 12px",
      fontFamily: "var(--font-normal)",
      fontSize: 11,
      color: "var(--text-caption)"
    }
  }, ["Apr 5", "Apr 15", "Apr 25", "May 5", "May 15", "May 25", "Jun 4", "Jun 14", "Jun 24"].map(m => /*#__PURE__*/React.createElement("span", {
    key: m
  }, m))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "sd-h3",
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700
    }
  }, "Radar Chart"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: 13,
      color: "var(--text-caption)",
      marginBottom: 8
    }
  }, "Last 6 months"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement(window.RadarChart, null)), /*#__PURE__*/React.createElement(Trend, null)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "sd-h3",
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700
    }
  }, "Radial Chart"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: 13,
      color: "var(--text-caption)",
      marginBottom: 8
    }
  }, "January \u2013 June 2024"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement(window.RadialChart, null)), /*#__PURE__*/React.createElement(Trend, null)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "sd-h3",
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700
    }
  }, "Pie Chart"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: 13,
      color: "var(--text-caption)",
      marginBottom: 8
    }
  }, "January \u2013 June 2024"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement(window.PieChart, null)), /*#__PURE__*/React.createElement(Trend, null))), /*#__PURE__*/React.createElement(window.DataTable, null));
}
window.DashboardView = DashboardView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/showcase/DashboardView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/showcase/DataTable.jsx
try { (() => {
// Sandhata showcase — interactive data table (bulk-edit pattern from the dashboard).

function DataTable() {
  const {
    Checkbox,
    IconButton,
    Badge,
    Button
  } = window.SandhataDesignSystem_081a0e;
  const seed = [{
    name: "John Adams",
    party: "None, Federalist",
    year: "1789–1797"
  }, {
    name: "Thomas Jefferson",
    party: "Democratic-Republican",
    year: "1801–1809"
  }, {
    name: "James Madison",
    party: "Democratic-Republican",
    year: "1809–1817"
  }, {
    name: "Andrew Jackson",
    party: "Democrat",
    year: "1829–1837"
  }, {
    name: "William H. Harrison",
    party: "Whig",
    year: "1841"
  }, {
    name: "Abraham Lincoln",
    party: "Republican",
    year: "1861–1865"
  }];
  const [sel, setSel] = React.useState({});
  const [page, setPage] = React.useState(1);
  const allOn = seed.every((_, i) => sel[i]);
  const Th = ({
    children,
    w
  }) => /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px 16px",
      width: w,
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 13,
      color: "var(--text-subtitle)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, children);
  const Td = ({
    children,
    muted
  }) => /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 16px",
      fontFamily: "var(--font-normal)",
      fontSize: 14,
      color: muted ? "var(--text-caption)" : "var(--text-body)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, children);
  const Edit = () => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20h9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
  }));
  const Trash = () => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  }));
  const Dots = () => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "5",
    r: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "1.6"
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      background: "var(--surface-raised)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--text-title)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h18M3 12h18M3 17h12"
  })), "Bulk Edit"), /*#__PURE__*/React.createElement(Button, {
    size: "small",
    hierarchy: "primary"
  }, "Add row")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(Th, {
    w: "44"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: allOn,
    onChange: () => {
      const v = !allOn;
      const next = {};
      seed.forEach((_, i) => next[i] = v);
      setSel(next);
    }
  })), /*#__PURE__*/React.createElement(Th, null, "Name"), /*#__PURE__*/React.createElement(Th, null, "Party"), /*#__PURE__*/React.createElement(Th, null, "Year"), /*#__PURE__*/React.createElement(Th, {
    w: "120"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, seed.map((r, i) => {
    const on = !!sel[i];
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        background: on ? "var(--colour-primaryblue-50)" : "transparent"
      }
    }, /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement(Checkbox, {
      checked: on,
      onChange: () => setSel({
        ...sel,
        [i]: !on
      })
    })), /*#__PURE__*/React.createElement(Td, null, r.name), /*#__PURE__*/React.createElement(Td, {
      muted: true
    }, r.party), /*#__PURE__*/React.createElement(Td, {
      muted: true
    }, r.year), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      size: "small",
      icon: /*#__PURE__*/React.createElement(Edit, null),
      ariaLabel: "Edit",
      hierarchy: "ghost"
    }), /*#__PURE__*/React.createElement(IconButton, {
      size: "small",
      icon: /*#__PURE__*/React.createElement(Trash, null),
      ariaLabel: "Delete",
      hierarchy: "danger"
    }), /*#__PURE__*/React.createElement(IconButton, {
      size: "small",
      icon: /*#__PURE__*/React.createElement(Dots, null),
      ariaLabel: "More",
      hierarchy: "ghost"
    }))));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 16,
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 13,
      color: "var(--text-caption)"
    }
  }, "Rows per page 6"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [1, 2, 3, 4, 5].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => setPage(p),
    style: {
      width: 30,
      height: 30,
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      border: `1px solid ${p === page ? "var(--colour-primaryblue-500)" : "var(--border-default)"}`,
      background: p === page ? "var(--colour-primaryblue-500)" : "transparent",
      color: p === page ? "#fff" : "var(--text-body)",
      fontFamily: "var(--font-normal)",
      fontSize: 13
    }
  }, p)))));
}
window.DataTable = DataTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/showcase/DataTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/showcase/FormsView.jsx
try { (() => {
// Sandhata showcase — Forms view: small, standard and stepper forms.

function FormsView() {
  const {
    Card,
    Input,
    Textarea,
    Button,
    Badge
  } = window.SandhataDesignSystem_081a0e;
  const colTitle = t => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 13,
      color: "var(--text-caption)",
      marginBottom: 10
    }
  }, t);
  const FormHead = () => /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sd-h2"
  }, "Form Title"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: 14,
      color: "var(--text-caption)"
    }
  }, "A brief description of the form's purpose"));
  const Upload = () => /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1.5px dashed var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "26px 16px",
      textAlign: "center",
      color: "var(--text-caption)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--icon-action)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-normal)",
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--text-action)"
    }
  }, "Click to Upload"), " or drag and drop"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-normal)",
      fontSize: 12
    }
  }, "(Max. File size: 25 MB)"));
  const Step = ({
    n,
    label,
    state
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: state === "done" || state === "active" ? "var(--font-bold)" : "var(--font-normal)",
      fontWeight: state === "done" || state === "active" ? 700 : 400,
      fontSize: 14,
      color: state === "active" ? "var(--text-action)" : state === "done" ? "var(--text-title)" : "var(--text-caption)"
    }
  }, "Step ", n), n < 3 && /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--icon-secondary)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1.3fr",
      gap: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, colTitle("Simple / Small Size Form"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(FormHead, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Field label",
    placeholder: "John Doe",
    helper: "Help or instruction text goes here"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Field label",
    placeholder: "John Doe",
    helper: "Help or instruction text goes here"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    hierarchy: "tertiary"
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    hierarchy: "primary"
  }, "Submit"))))), /*#__PURE__*/React.createElement("div", null, colTitle("Standard / Mid Size Form"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(FormHead, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Single date field",
    placeholder: "DD/MM/YYYY",
    iconRight: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "2",
      x2: "16",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "2",
      x2: "8",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "10",
      x2: "21",
      y2: "10"
    })),
    helper: "Help or instruction text goes here"
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Field label",
    placeholder: "Enter your text here",
    rows: 2,
    helper: "Help or instruction text goes here"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 16,
      color: "var(--text-title)",
      marginBottom: 8
    }
  }, "Upload files"), /*#__PURE__*/React.createElement(Upload, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    hierarchy: "tertiary"
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    hierarchy: "tertiary"
  }, "Reset"), /*#__PURE__*/React.createElement(Button, {
    hierarchy: "primary"
  }, "Submit"))))), /*#__PURE__*/React.createElement("div", null, colTitle("Complex / Stepper Form"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(FormHead, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Step, {
    n: 1,
    state: "done"
  }), /*#__PURE__*/React.createElement(Step, {
    n: 2,
    state: "active"
  }), /*#__PURE__*/React.createElement(Step, {
    n: 3,
    state: "todo"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Single date field",
    placeholder: "DD/MM/YYYY",
    helper: "Help or instruction text goes here"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Mandatory field label",
    required: true,
    error: "This is a mandatory field!",
    placeholder: "John Doe"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Field label",
    placeholder: "Placeholder text",
    helper: "Help or instruction text goes here"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Field label",
    placeholder: "John Doe",
    helper: "Help or instruction text goes here"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 16,
      color: "var(--text-title)",
      marginBottom: 8
    }
  }, "Upload files"), /*#__PURE__*/React.createElement(Upload, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    hierarchy: "tertiary"
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    hierarchy: "tertiary"
  }, "Reset"), /*#__PURE__*/React.createElement(Button, {
    hierarchy: "primary",
    iconRight: /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "9 18 15 12 9 6"
    }))
  }, "Next")))));
}
window.FormsView = FormsView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/showcase/FormsView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/showcase/ProductCardsView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Sandhata showcase — Product Cards view: pricing tiers (Basic / Extra / Pro).

function ProductCardsView() {
  const {
    Button
  } = window.SandhataDesignSystem_081a0e;
  const [cycle, setCycle] = React.useState("yearly");
  const Check = ({
    light
  }) => /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: light ? "#fff" : "var(--colour-primaryblue-500)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }));
  const plans = [{
    name: "Basic",
    featured: false
  }, {
    name: "Extra",
    featured: true
  }, {
    name: "Pro",
    featured: false
  }];
  const Plan = ({
    name,
    featured
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      borderRadius: "var(--radius-xl)",
      background: featured ? "var(--colour-alternativepurple-400)" : "var(--surface-secondary)",
      border: featured ? "none" : "1px solid var(--border-subtle)",
      color: featured ? "#fff" : "var(--text-body)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      boxShadow: featured ? "var(--shadow-lg)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 22,
      color: featured ? "#fff" : "var(--text-title)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-light)",
      fontWeight: 300,
      fontSize: 14,
      opacity: featured ? 0.85 : 1,
      color: featured ? "#fff" : "var(--text-caption)"
    }
  }, "3 team members")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-bold)",
      fontWeight: 700,
      fontSize: 34,
      color: featured ? "#fff" : "var(--text-title)"
    }
  }, "$", cycle === "yearly" ? name === "Basic" ? 0 : name === "Extra" ? 12 : 24 : name === "Basic" ? 0 : name === "Extra" ? 15 : 29, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 400
    }
  }, "/mo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, ["Unlimited projects", "Advanced analytics", "Priority support"].map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-normal)",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Check, {
    light: featured
  }), f))), featured ? /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      border: "none",
      borderRadius: "var(--radius-md)",
      background: "#fff",
      color: "var(--colour-alternativepurple-600)",
      fontFamily: "var(--font-normal)",
      fontSize: 14,
      cursor: "pointer",
      fontWeight: 700
    }
  }, "Get started") : /*#__PURE__*/React.createElement(Button, {
    hierarchy: "primary",
    fullWidth: true
  }, "Get started"));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sd-display-sm",
    style: {
      margin: 0
    }
  }, "Pricing"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 18px",
      fontFamily: "var(--font-normal)",
      fontSize: 15,
      color: "var(--text-subtitle)"
    }
  }, "No credit card required. Every plan includes a 30-day trial of all Pro features."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 4,
      padding: 4,
      background: "var(--surface-secondary)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)"
    }
  }, ["monthly", "yearly"].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setCycle(c),
    style: {
      height: 32,
      padding: "0 16px",
      border: "none",
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      textTransform: "capitalize",
      fontFamily: "var(--font-normal)",
      fontSize: 14,
      background: cycle === c ? "var(--surface-raised)" : "transparent",
      color: cycle === c ? "var(--text-title)" : "var(--text-caption)",
      boxShadow: cycle === c ? "var(--shadow-xs)" : "none"
    }
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 24,
      alignItems: "center"
    }
  }, plans.map(p => /*#__PURE__*/React.createElement(Plan, _extends({
    key: p.name
  }, p)))));
}
window.ProductCardsView = ProductCardsView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/showcase/ProductCardsView.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
