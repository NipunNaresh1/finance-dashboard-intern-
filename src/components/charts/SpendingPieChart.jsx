// ─── COMPONENT: SpendingPieChart ─────────────────────────────────────────────
// Donut chart showing spending by category. Pure SVG.

import React, { useState } from "react";
import "./Charts.css";

const COLORS = [
  "#6c63ff", "#10b981", "#ef4444", "#f59e0b",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

export default function SpendingPieChart({ data }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return <div className="chart-empty">No expense data</div>;
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 90, cy = 90, R = 70, r = 42; // outer R, inner r (donut hole)
  let cumAngle = -Math.PI / 2;

  function polar(cx, cy, r, angle) {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const [x1, y1] = polar(cx, cy, R, startAngle);
    const [x2, y2] = polar(cx, cy, R, endAngle);
    const [ix1, iy1] = polar(cx, cy, r, startAngle);
    const [ix2, iy2] = polar(cx, cy, r, endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    return { path, color: COLORS[i % COLORS.length], ...d, pct: ((d.value / total) * 100).toFixed(1) };
  });

  const activeSlice = hovered !== null ? slices[hovered] : null;

  return (
    <div className="pie-wrapper">
      <svg viewBox="0 0 180 180" className="pie-chart">
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={hovered === null || hovered === i ? 1 : 0.4}
            style={{ transition: "opacity 0.2s", cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="var(--text3)">
          {activeSlice ? activeSlice.pct + "%" : "Total"}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">
          {activeSlice ? activeSlice.name.split(" ")[0] : fmt(total)}
        </text>
      </svg>

      {/* Category list */}
      <div className="pie-legend">
        {slices.slice(0, 5).map((s, i) => (
          <div
            key={i}
            className={`pie-legend-item ${hovered === i ? "active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="legend-color" style={{ background: s.color }} />
            <span className="legend-name">{s.name}</span>
            <span className="legend-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
