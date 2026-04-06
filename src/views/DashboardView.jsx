// ─── VIEW: DashboardView ─────────────────────────────────────────────────────
// Main dashboard with summary cards, charts, and recent transactions.

import React from "react";
import { useApp } from "../context/AppContext";
import { computeSummary, groupByCategory } from "../models/Transaction";
import { MONTHLY_TREND } from "../data/mockData";
import BalanceTrendChart from "../components/charts/BalanceTrendChart";
import SpendingPieChart from "../components/charts/SpendingPieChart";
import "./DashboardView.css";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function SummaryCard({ icon, label, amount, color, sub }) {
  return (
    <div className={`summary-card card ${color}`}>
      <div className="summary-top">
        <span className="summary-icon">{icon}</span>
        <span className="summary-label">{label}</span>
      </div>
      <div className="summary-amount">{fmt(amount)}</div>
      {sub && <div className="summary-sub">{sub}</div>}
    </div>
  );
}

export default function DashboardView() {
  const { state, actions } = useApp();
  const { transactions } = state;

  // Only current month transactions for summary cards
  const juneTransactions = transactions.filter(t => t.date.startsWith("2024-06"));
  const { totalIncome, totalExpenses, balance } = computeSummary(juneTransactions);

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const categoryData = groupByCategory(juneTransactions);

  return (
    <div className="dashboard-view fade-in">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="view-header">
        <div>
          <h2 className="view-title">Dashboard</h2>
          <p className="view-sub">June 2024 — Your financial overview</p>
        </div>
        <div className="header-badge">
          <span className="live-dot" /> Live
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      <div className="summary-grid">
        <SummaryCard
          icon="💰" label="Total Balance" amount={balance}
          color="card-accent" sub="Available funds"
        />
        <SummaryCard
          icon="📈" label="Total Income"   amount={totalIncome}
          color="card-green" sub={`${juneTransactions.filter(t => t.type === "income").length} transactions`}
        />
        <SummaryCard
          icon="📉" label="Total Expenses" amount={totalExpenses}
          color="card-red"   sub={`${juneTransactions.filter(t => t.type === "expense").length} transactions`}
        />
        <SummaryCard
          icon="💹" label="Savings Rate"
          amount={Math.round((balance / totalIncome) * 100)}
          color="card-yellow"
          sub="% of income saved"
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Balance Trend</h3>
            <p className="chart-sub">Income vs Expenses — Jan to Jun 2024</p>
          </div>
          <BalanceTrendChart data={MONTHLY_TREND} />
        </div>

        <div className="card chart-card chart-narrow">
          <div className="chart-header">
            <h3>Spending Breakdown</h3>
            <p className="chart-sub">By category, June 2024</p>
          </div>
          <SpendingPieChart data={categoryData} />
        </div>
      </div>

      {/* ── Recent Transactions ─────────────────────────────────────────────── */}
      <div className="card recent-card">
        <div className="recent-header">
          <div>
            <h3>Recent Transactions</h3>
            <p className="chart-sub">Last 5 activities</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => actions.setTab("transactions")}>
            View All →
          </button>
        </div>
        <div className="recent-list">
          {recentTx.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Add one to get started!</p>
            </div>
          ) : recentTx.map(tx => (
            <div key={tx.id} className="recent-item">
              <div className="recent-left">
                <div className={`tx-dot ${tx.type}`} />
                <div>
                  <p className="tx-desc">{tx.description}</p>
                  <p className="tx-meta">{tx.formattedDate} · {tx.category}</p>
                </div>
              </div>
              <span className={`tx-amount ${tx.type}`}>
                {tx.type === "income" ? "+" : "−"}{tx.formattedAmount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
