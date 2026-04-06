// ─── MODEL: Transaction ───────────────────────────────────────────────────────
// Defines the shape of a transaction and helper functions.
// This is the "M" in MVC — pure data logic, no UI.

export class Transaction {
  constructor({ id, date, description, amount, category, type }) {
    this.id          = id;
    this.date        = date;          // "YYYY-MM-DD"
    this.description = description;
    this.amount      = amount;        // always positive number
    this.category    = category;
    this.type        = type;          // "income" | "expense"
  }

  // Signed amount: positive for income, negative for expense
  get signedAmount() {
    return this.type === "income" ? this.amount : -this.amount;
  }

  get formattedDate() {
    return new Date(this.date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

  get formattedAmount() {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(this.amount);
  }
}

// ─── Pure helper functions (no state, easy to test) ──────────────────────────

export function computeSummary(transactions) {
  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, balance };
}

export function groupByCategory(transactions) {
  const expenseOnly = transactions.filter(t => t.type === "expense");
  const map = {};
  expenseOnly.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getHighestCategory(transactions) {
  const groups = groupByCategory(transactions);
  return groups[0] || null;
}

export function filterTransactions(transactions, { search, type, category, sortBy, sortDir }) {
  let result = [...transactions];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  if (type && type !== "all")     result = result.filter(t => t.type === type);
  if (category && category !== "all") result = result.filter(t => t.category === category);

  result.sort((a, b) => {
    let valA = a[sortBy], valB = b[sortBy];
    if (sortBy === "amount") { valA = a.amount; valB = b.amount; }
    if (sortBy === "date")   { valA = new Date(a.date); valB = new Date(b.date); }
    return sortDir === "asc"
      ? (valA > valB ? 1 : -1)
      : (valA < valB ? 1 : -1);
  });

  return result;
}

export function generateId(transactions) {
  return Math.max(0, ...transactions.map(t => t.id)) + 1;
}
