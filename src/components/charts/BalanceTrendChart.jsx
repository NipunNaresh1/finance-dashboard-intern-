// ─── COMPONENT: BalanceTrendChart ────────────────────────────────────────────
// Simple SVG bar chart for income vs expense over months.
// Pure SVG — no chart library needed.

import React from "react";
import "./Charts.css";

const FMT = n => n >= 1000 ? `${(n/1000).toFixed(0)}k` : n;

export default function BalanceTrendChart({ data }) {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses]));
  const W = 500, H = 180, PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = data.length;
  const groupW = innerW / n;
  const barW = (groupW * 0.3);

  function y(val) { return PAD.top + innerH - (val / maxVal) * innerH; }
  function barX(i, isSecond) { return PAD.left + i * groupW + groupW * 0.15 + (isSecond ? barW + 4 : 0); }

  return (
    <div className="chart-wrapper">
      <svg viewBox={`0 0 ${W} ${H}`} className="bar-chart">
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(r => (
          <g key={r}>
            <line
              x1={PAD.left} x2={W - PAD.right}
              y1={PAD.top + innerH * (1 - r)} y2={PAD.top + innerH * (1 - r)}
              stroke="var(--border)" strokeWidth="1"
            />
            <text
              x={PAD.left - 6}
              y={PAD.top + innerH * (1 - r) + 4}
              textAnchor="end" fontSize="10" fill="var(--text3)"
            >
              {FMT(Math.round(maxVal * r))}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const incH = (d.income / maxVal) * innerH;
          const expH = (d.expenses / maxVal) * innerH;
          return (
            <g key={d.month}>
              {/* Income bar */}
              <rect
                x={barX(i, false)} y={y(d.income)}
                width={barW} height={incH}
                rx="4" fill="var(--green)" opacity="0.85"
                className="bar-rect"
              />
              {/* Expense bar */}
              <rect
                x={barX(i, true)} y={y(d.expenses)}
                width={barW} height={expH}
                rx="4" fill="var(--red)" opacity="0.75"
                className="bar-rect"
              />
              {/* Month label */}
              <text
                x={barX(i, false) + barW}
                y={H - PAD.bottom + 16}
                textAnchor="middle" fontSize="11" fill="var(--text3)"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item"><span className="legend-dot green" /> Income</div>
        <div className="legend-item"><span className="legend-dot red" /> Expenses</div>
      </div>
    </div>
  );
}
