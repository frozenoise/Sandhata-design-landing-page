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

function LineChart({ height = 220, color = "var(--colour-alternativepurple-400)", seed = 1, fill = true }) {
  const W = 800, H = height, pad = 12;
  const n = 40;
  const vals = [];
  let r = seed * 9301;
  const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  for (let i = 0; i < n; i++) vals.push(0.25 + 0.6 * Math.abs(Math.sin(i * 0.6 + seed) * rnd()));
  const pts = vals.map((v, i) => [pad + (i / (n - 1)) * (W - pad * 2), H - pad - v * (H - pad * 2)]);
  const line = smoothPath(pts);
  const area = `${line} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`;
  const gid = `g${seed}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function PieChart({ size = 150, data }) {
  const slices = data || [
    { v: 35, c: "var(--colour-primaryblue-500)" },
    { v: 25, c: "var(--colour-alternativepurple-400)" },
    { v: 20, c: "var(--colour-primaryblue-300)" },
    { v: 12, c: "var(--colour-secondarycyan-500)" },
    { v: 8,  c: "var(--colour-primaryblue-800)" },
  ];
  const total = slices.reduce((a, s) => a + s.v, 0);
  const R = size / 2, cx = R, cy = R;
  let angle = -Math.PI / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {slices.map((s, i) => {
        const a0 = angle;
        const a1 = angle + (s.v / total) * Math.PI * 2;
        angle = a1;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
        const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
        return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill={s.c} />;
      })}
    </svg>
  );
}

function RadialChart({ size = 150 }) {
  const rings = [
    { r: 0.92, c: "var(--colour-alternativepurple-300)", v: 0.7 },
    { r: 0.72, c: "var(--colour-primaryblue-400)", v: 0.55 },
    { r: 0.52, c: "var(--colour-alternativepurple-500)", v: 0.85 },
    { r: 0.32, c: "var(--colour-primaryblue-700)", v: 0.4 },
  ];
  const cx = size / 2, cy = size / 2, base = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {rings.map((ring, i) => {
        const R = base * ring.r;
        const a0 = -Math.PI / 2;
        const a1 = a0 + ring.v * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
        const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--colour-neutral-100)" strokeWidth="7" />
            <path d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`} fill="none" stroke={ring.c} strokeWidth="7" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

function RadarChart({ size = 170 }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 16;
  const axes = 6;
  const vals = [0.8, 0.55, 0.7, 0.45, 0.9, 0.6];
  const pt = (i, f) => {
    const a = -Math.PI / 2 + (i / axes) * Math.PI * 2;
    return [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)];
  };
  const grid = [0.33, 0.66, 1].map((f) =>
    Array.from({ length: axes }, (_, i) => pt(i, f).join(",")).join(" ")
  );
  const poly = Array.from({ length: axes }, (_, i) => pt(i, vals[i]).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {grid.map((g, i) => <polygon key={i} points={g} fill="none" stroke="var(--colour-neutral-200)" strokeWidth="1" />)}
      {Array.from({ length: axes }, (_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--colour-neutral-200)" strokeWidth="1" />; })}
      <polygon points={poly} fill="var(--colour-alternativepurple-400)" fillOpacity="0.25" stroke="var(--colour-alternativepurple-500)" strokeWidth="2" />
    </svg>
  );
}

Object.assign(window, { LineChart, PieChart, RadialChart, RadarChart });
