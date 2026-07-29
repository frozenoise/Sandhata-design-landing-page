/* Sandhata docs — tiny JSX syntax highlighter (light theme). */
export function sdHighlight(src: string): string {
  const esc = String(src).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const RX = /(\/\/[^\n]*)|("[^"]*"|'[^']*')|\b(import|from|const|let|return|export|default|function|useState)\b|(&lt;\/?[A-Za-z][\w.]*)|([A-Za-z_][\w]*)(?=={|="|=')/g;
  return esc.replace(RX, function (m, com, str, kw, tag, prop) {
    if (com) return '<span class="c-com">' + com + "</span>";
    if (str) return '<span class="c-str">' + str + "</span>";
    if (kw) return '<span class="c-kw">' + kw + "</span>";
    if (tag) return '<span class="c-tag">' + tag + "</span>";
    if (prop) return '<span class="c-prop">' + prop + "</span>";
    return m;
  });
}

/* Per-line variant for the code block's line-number gutter (SdCodeBlock).
   Splits the RAW source on "\n" first, then runs sdHighlight() on each line
   individually, rather than highlighting the whole snippet once and slicing
   the resulting HTML on line-boundary markers. Safe to do because every
   branch of RX above is inherently single-line: the comment alt is
   "[^\n]*" (stops at a newline itself), the keyword/tag/prop alts are bare
   word patterns, and the only alt that could in principle span lines — the
   quoted-string alt "[^"]*"/'[^']*' — would require a genuine multi-line
   string literal inside one of these illustrative JSX/CSS/HTML snippets,
   which none of the doc/component data does. So per-line and whole-string
   highlighting produce identical token spans here; per-line is simpler and
   sidesteps ever having to locate "line boundaries" inside already-escaped,
   already-tagged HTML.
   Each line is wrapped in a block-level span carrying its own CSS counter
   increment (see .doc-code-line in docs.css) — the number itself is drawn
   entirely by a ::before pseudo-element reading that counter, so it never
   exists as a real text node. That means it can't be selected or copied as
   part of the code text by construction (generated content is never
   selectable in any browser), on top of the copy button already sending the
   original `code` string verbatim rather than reading rendered DOM text. */
export function sdHighlightLines(src: string): string {
  const lines = String(src).split("\n");
  return lines
    .map(function (line) {
      return '<span class="doc-code-line">' + sdHighlight(line) + "</span>";
    })
    .join("");
}
