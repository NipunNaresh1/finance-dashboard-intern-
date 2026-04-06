// ─── VIEW: InsightsView ───────────────────────────────────────────────────────
// Shows spending patterns, monthly comparison, observations, and budget tracker.

import React from "react";
import { useApp } from "../context/AppContext";
import { computeSummary, groupByCategory, getHighestCategory } from "../models/Transaction";
import "./InsightsView.css";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function InsightCard({ emoji, title, value, desc, color }) {
  return (
    <div className={`insight-card card ${color}`}>
      <div className="insight-emoji">{emoji}</div>
      <div className="insight-title">{title}</div>
      <div className="insight-value">{value}</div>
      <div className="insight-desc">{desc}</div>
    </div>
  );
}

const CATEGORY_COLORS = [
  "#6c63ff","#10b981","#ef4444","#f59e0b",
  "#3b82f6","#8b5cf6","#ec4899","#14b8a6","#f97316","#84cc16",
];

export default function InsightsView() {
  const { state } = useApp();
  const { transactions } = state;

  const juneTx = transactions.filter(t => t.date.startsWith("2024-06"));
  const mayTx  = transactions.filter(t => t.date.startsWith("2024-05"));

  const juneStats = computeSummary(juneTx);
  const mayStats  = computeSummary(mayTx);

  const topCategory  = getHighestCategory(juneTx);
  const categoryData = groupByCategory(juneTx);

  const expenseDiff = juneStats.totalExpenses - mayStats.totalExpenses;
  const incomeDiff  = juneStats.totalIncome   - mayStats.totalIncome;
  const savingsRate = juneStats.totalIncome > 0
    ? ((juneStats.balance / juneStats.totalIncome) * 100).toFixed(1)
    : 0;

  const maxBar = categoryData[0]?.value || 1;

  // Monthly trend for mini line chart
  const monthlyData = [
    { m: "Jan", i: 85000,  e: 32000 },
    { m: "Feb", i: 90000,  e: 28000 },
    { m: "Mar", i: 85000,  e: 35000 },
    { m: "Apr", i: 95000,  e: 30000 },
    { m: "May", i: 103000, e: mayStats.totalExpenses  },
    { m: "Jun", i: juneStats.totalIncome, e: juneStats.totalExpenses },
  ];

  return (
    <div className="insights-view fade-in">
      {/* Header */}
      <div className="view-header">
        <div>
          <h2 className="view-title">Insights</h2>
          <p className="view-sub">Patterns & observations from your financial data</p>
        </div>
      </div>

      {/* ── Key Metrics Cards ─────────────────────────────────────────────── */}
      <div className="insights-grid">
        <InsightCard
          emoji="🏆" title="Top Spending Category"
          value={topCategory?.name || "—"}
          desc={topCategory ? `${fmt(topCategory.value)} spent in June` : "No expense data"}
          color="card-accent"
        />
        <InsightCard
          emoji={expenseDiff > 0 ? "📈" : "📉"} title="Expense Change vs May"
          value={`${expenseDiff > 0 ? "+" : ""}${fmt(expenseDiff)}`}
          desc={expenseDiff > 0 ? "Expenses went up vs May" : "Expenses went down ✓"}
          color={expenseDiff > 0 ? "card-red" : "card-green"}
        />
        <InsightCard
          emoji="💰" title="Savings Rate"
          value={`${savingsRate}%`}
          desc="Of income saved in June"
          color="card-green"
        />
        <InsightCard
          emoji={incomeDiff >= 0 ? "🚀" : "📊"} title="Income Change vs May"
          value={`${incomeDiff >= 0 ? "+" : ""}${fmt(incomeDiff)}`}
          desc="Month-on-month income delta"
          color={incomeDiff >= 0 ? "card-accent" : "card-yellow"}
        />
      </div>

      {/* ── Row: Monthly Comparison + Category Breakdown ─────────────────── */}
      <div className="insights-row">

        {/* Monthly Comparison */}
        <div className="card compare-card">
          <h3>May vs June</h3>
          <p className="sub-text">Month-on-month comparison</p>
          <div className="compare-list">
            {[
              { label: "Income",   may: mayStats.totalIncome,   june: juneStats.totalIncome   },
              { label: "Expenses", may: mayStats.totalExpenses, june: juneStats.totalExpenses },
              { label: "Savings",  may: Math.max(0, mayStats.balance), june: Math.max(0, juneStats.balance) },
            ].map(row => {
              const pct = row.may > 0
                ? (((row.june - row.may) / row.may) * 100).toFixed(0)
                : 0;
              const up = row.june >= row.may;
              return (
                <div key={row.label} className="compare-row-item">
                  <div className="compare-row-label">{row.label}</div>
                  <div className="compare-row-bar-row">
                    <span className="compare-val may">{fmt(row.may)}</span>
                    <span className="compare-arrow">→</span>
                    <span className="compare-val june">{fmt(row.june)}</span>
                    <span className={`compare-badge ${up ? "up" : "down"}`}>
                      {up ? "▲" : "▼"} {Math.abs(pct)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Trend Chart (SVG) */}
          <div className="mini-chart-title">6-Month Trend</div>
          <svg viewBox="0 0 300 80" className="mini-line-chart">
            {/* Income line */}
            {monthlyData.map((d, i) => {
              if (i === 0) return null;
              const prev = monthlyData[i - 1];
              const maxI = Math.max(...monthlyData.map(x => x.i));
              const x1 = ((i-1) / (monthlyData.length-1)) * 280 + 10;
              const x2 = (i / (monthlyData.length-1)) * 280 + 10;
              const y1 = 70 - (prev.i / maxI) * 60;
              const y2 = 70 - (d.i   / maxI) * 60;
              return <line key={`i${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>;
            })}
            {/* Expense line */}
            {monthlyData.map((d, i) => {
              if (i === 0) return null;
              const prev = monthlyData[i - 1];
              const maxI = Math.max(...monthlyData.map(x => x.i));
              const x1 = ((i-1) / (monthlyData.length-1)) * 280 + 10;
              const x2 = (i / (monthlyData.length-1)) * 280 + 10;
              const y1 = 70 - (prev.e / maxI) * 60;
              const y2 = 70 - (d.e   / maxI) * 60;
              return <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>;
            })}
            {/* Month labels */}
            {monthlyData.map((d, i) => (
              <text
                key={d.m}
                x={(i / (monthlyData.length-1)) * 280 + 10}
                y="80" textAnchor="middle" fontSize="9" fill="var(--text3)"
              >{d.m}</text>
            ))}
          </svg>
          <div className="mini-chart-legend">
            <span><span style={{background:"#10b981"}} className="legend-dot-sm"/>Income</span>
            <span><span style={{background:"#ef4444"}} className="legend-dot-sm"/>Expenses</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card category-card">
          <h3>Spending by Category</h3>
          <p className="sub-text">June 2024 breakdown</p>
          <div className="category-bars">
            {categoryData.length === 0 ? (
              <div className="empty-state">No expense data</div>
            ) : categoryData.map((c, i) => (
              <div key={c.name} className="cat-bar-row">
                <div className="cat-bar-label" title={c.name}>{c.name}</div>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: `${(c.value / maxBar) * 100}%`,
                      background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }}
                  />
                </div>
                <div className="cat-bar-val">{fmt(c.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Observations ─────────────────────────────────────────────────── */}
      <div className="card obs-card">
        <h3>💡 Smart Observations</h3>
        <div className="obs-list">
          {topCategory && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--accent)"}} />
              <p>Your biggest expense is <strong>{topCategory.name}</strong> at {fmt(topCategory.value)}. Consider reviewing this category.</p>
            </div>
          )}
          {expenseDiff < 0 && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--green)"}} />
              <p>Great news! Expenses dropped by {fmt(Math.abs(expenseDiff))} vs May. Keep it up! 🎉</p>
            </div>
          )}
          {expenseDiff > 0 && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--red)"}} />
              <p>Expenses increased by {fmt(expenseDiff)} vs last month. Review your discretionary spending.</p>
            </div>
          )}
          {Number(savingsRate) >= 20 && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--green)"}} />
              <p>Excellent! Your savings rate is {savingsRate}% — above the recommended 20% benchmark. 🌟</p>
            </div>
          )}
          {Number(savingsRate) < 20 && Number(savingsRate) > 0 && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--yellow)"}} />
              <p>Your savings rate is {savingsRate}%. Try to reach 20% by cutting down non-essential spends.</p>
            </div>
          )}
          {incomeDiff > 0 && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--accent)"}} />
              <p>Income grew by {fmt(incomeDiff)} this month — consider investing the surplus! 📈</p>
            </div>
          )}
          {categoryData.length > 3 && (
            <div className="obs-item">
              <span className="obs-dot" style={{background:"var(--yellow)"}} />
              <p>You have spending across <strong>{categoryData.length} categories</strong>. Consolidating can help you budget better.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
