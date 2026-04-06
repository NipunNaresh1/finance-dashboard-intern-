# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React. This is a frontend-only project using mock data, built as an internship evaluation task.

---

## 🚀 Setup & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

App runs at: `http://localhost:5173`

---

## 🔐 Login Credentials

| Username       | Password    | Role   |
|----------------|-------------|--------|
| nipunnaresh1   | Nipun@123   | Admin  |
| viewer01       | View@123    | Viewer |

---

## 📁 Project Structure (MVC Architecture)

```
src/
├── models/           ← M: Pure data logic (no UI)
│   ├── Transaction.js    Transaction class, filtering, summary functions
│   └── Auth.js           Login/logout logic, localStorage session
│
├── context/          ← C: Controller — global state via useReducer
│   └── AppContext.jsx     All state changes go through here
│
├── views/            ← V: Pages (consume state, render UI)
│   ├── LoginPage.jsx
│   ├── DashboardView.jsx
│   ├── TransactionsView.jsx
│   └── InsightsView.jsx
│
├── components/       ← Reusable UI pieces
│   ├── Sidebar.jsx
│   ├── TransactionModal.jsx
│   └── charts/
│       ├── BalanceTrendChart.jsx   (pure SVG bar chart)
│       └── SpendingPieChart.jsx    (pure SVG donut chart)
│
├── data/
│   └── mockData.js       All dummy data lives here
│
└── styles/
    └── global.css        CSS variables, resets, utility classes
```

---

## ✨ Features

### Dashboard
- Summary cards: Total Balance, Income, Expenses, Savings Rate
- Bar chart: Income vs Expenses over 6 months (pure SVG)
- Donut chart: Spending breakdown by category (pure SVG)
- Recent 5 transactions

### Transactions
- Full list with Date, Description, Category, Type, Amount
- Search (by name or category)
- Filter by Type (income/expense) and Category
- Sort by Date, Amount, Category
- CSV Export
- Admin: Add, Edit, Delete transactions

### Insights
- Top spending category
- Month-on-month comparison (May vs June)
- Savings rate calculation
- 6-month mini trend chart
- Horizontal category bar chart
- Smart observations (auto-generated from data)

### Role-Based UI
- **Admin**: Can add, edit, delete transactions
- **Viewer**: Read-only — no add/edit/delete buttons shown
- Switch by logging in with different credentials

### Other
- 🌙 Dark mode toggle
- 💾 Data persists in localStorage (transactions survive page refresh)
- 📱 Fully responsive — works on mobile, tablet, desktop
- ⚡ No chart libraries — all charts are pure SVG

---

## 🏗️ Architecture Decisions

**Why MVC?**
- Models (`Transaction.js`, `Auth.js`) contain pure functions with zero UI dependency — easy to test, easy to replace with a real API later
- Controller (`AppContext.jsx`) uses `useReducer` so all state transitions are explicit and traceable
- Views are dumb — they just read state and call actions

**Why no chart library?**
- Pure SVG charts keep the bundle small and show understanding of how charts actually work under the hood

**Why CSS variables?**
- Dark mode is just toggling one class on `<html>` — all colors flip automatically via CSS variables

---

## 🔧 Tech Stack

- **React 18** — UI
- **Vite** — Build tool
- **CSS Variables** — Theming + dark mode
- **useReducer + Context** — State management
- **localStorage** — Data persistence
- **Pure SVG** — Charts (no recharts/chart.js)
