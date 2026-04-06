// ─── VIEW: TransactionsView ───────────────────────────────────────────────────
// Full transactions list with filter, sort, search, and CRUD (admin only).

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { filterTransactions } from "../models/Transaction";
import { CATEGORIES } from "../data/mockData";
import TransactionModal from "../components/TransactionModal";
import "./TransactionsView.css";

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

export default function TransactionsView() {
  const { state, actions } = useApp();
  const { transactions, filters, user } = state;
  const isAdmin = user?.role === "admin";

  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = new, obj = edit

  // Apply filters from the model's pure function
  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  function openAdd()      { setEditTarget(null);  setModalOpen(true); }
  function openEdit(tx)   { setEditTarget(tx);    setModalOpen(true); }
  function closeModal()   { setModalOpen(false); setEditTarget(null); }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) actions.deleteTransaction(id);
  }

  function setSortBy(col) {
    if (filters.sortBy === col) {
      actions.setFilter({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      actions.setFilter({ sortBy: col, sortDir: "desc" });
    }
  }

  function SortIcon({ col }) {
    if (filters.sortBy !== col) return <span className="sort-icon">⇅</span>;
    return <span className="sort-icon active">{filters.sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  function exportCSV() {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = filtered.map(t =>
      `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  }

  return (
    <div className="transactions-view fade-in">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="view-header">
        <div>
          <h2 className="view-title">Transactions</h2>
          <p className="view-sub">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportCSV} title="Export CSV">
            ⬇ Export
          </button>
          {isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="card filters-card">
        <div className="filters-row">
          <div className="filter-group search-group">
            <span className="filter-icon">⌕</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => actions.setFilter({ search: e.target.value })}
            />
          </div>

          <select value={filters.type} onChange={e => actions.setFilter({ type: e.target.value })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={filters.category} onChange={e => actions.setFilter({ category: e.target.value })}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button className="btn btn-ghost btn-sm" onClick={actions.resetFilters}>
            ✕ Reset
          </button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="card table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new transaction.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="tx-table">
              <thead>
                <tr>
                  <th onClick={() => setSortBy("date")} className="sortable">
                    Date <SortIcon col="date" />
                  </th>
                  <th>Description</th>
                  <th onClick={() => setSortBy("category")} className="sortable">
                    Category <SortIcon col="category" />
                  </th>
                  <th>Type</th>
                  <th onClick={() => setSortBy("amount")} className="sortable text-right">
                    Amount <SortIcon col="amount" />
                  </th>
                  {isAdmin && <th className="text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id} className="tx-row">
                    <td className="tx-date">{tx.formattedDate}</td>
                    <td className="tx-desc">{tx.description}</td>
                    <td>
                      <span className="category-tag">{tx.category}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${tx.type}`}>
                        {tx.type === "income" ? "↑ Income" : "↓ Expense"}
                      </span>
                    </td>
                    <td className={`tx-amount text-right ${tx.type}`}>
                      {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                    </td>
                    {isAdmin && (
                      <td className="text-right">
                        <div className="action-btns">
                          <button className="icon-btn edit" onClick={() => openEdit(tx)} title="Edit">✎</button>
                          <button className="icon-btn del"  onClick={() => handleDelete(tx.id)} title="Delete">✕</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <TransactionModal
          initialData={editTarget}
          onSave={data => {
            if (editTarget) actions.updateTransaction({ ...editTarget, ...data });
            else            actions.addTransaction(data);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
