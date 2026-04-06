// ─── COMPONENT: TransactionModal ─────────────────────────────────────────────
// Modal form for adding or editing a transaction (Admin only).

import React, { useState } from "react";
import { CATEGORIES } from "../data/mockData";
import "./TransactionModal.css";

const today = new Date().toISOString().split("T")[0];

export default function TransactionModal({ initialData, onSave, onClose }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    date:        initialData?.date        || today,
    description: initialData?.description || "",
    amount:      initialData?.amount      || "",
    category:    initialData?.category    || CATEGORIES[0],
    type:        initialData?.type        || "expense",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) { setError("Description is required."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Enter a valid amount."); return; }
    onSave({ ...form, amount: Number(form.amount) });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box slide-up">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type toggle */}
          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${form.type === "income" ? "active-income" : ""}`}
              onClick={() => setForm(p => ({ ...p, type: "income" }))}
            >
              ↑ Income
            </button>
            <button
              type="button"
              className={`toggle-btn ${form.type === "expense" ? "active-expense" : ""}`}
              onClick={() => setForm(p => ({ ...p, type: "expense" }))}
            >
              ↓ Expense
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Description *</label>
              <input
                name="description"
                type="text"
                placeholder="e.g. Monthly Salary"
                value={form.description}
                onChange={handleChange}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                name="amount"
                type="number"
                placeholder="e.g. 5000"
                value={form.amount}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
