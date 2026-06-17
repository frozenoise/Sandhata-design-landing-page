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
