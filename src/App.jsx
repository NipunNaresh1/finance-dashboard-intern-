// ─── App.jsx — Root Router ────────────────────────────────────────────────────
// Decides: show Login OR main dashboard layout based on auth state.

import React, { useState } from "react";
import { useApp } from "./context/AppContext";
import LoginPage from "./views/LoginPage";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import TransactionsView from "./views/TransactionsView";
import InsightsView from "./views/InsightsView";
import "./App.css";

export default function App() {
  const { state } = useApp();
  const { user, activeTab } = state;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Not logged in → show login page
  if (!user) return <LoginPage />;

  // Map tab name to component
  const VIEW = {
    dashboard:    <DashboardView />,
    transactions: <TransactionsView />,
    insights:     <InsightsView />,
  };

  return (
    <div className="app-layout">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="app-main">
        {/* Mobile top bar */}
        <header className="mobile-header">
          <button className="hamburger" onClick={() => setMobileNavOpen(true)}>☰</button>
          <span className="mobile-logo">FinTrack</span>
          <div />
        </header>

        <main className="app-content">
          {VIEW[activeTab] || <DashboardView />}
        </main>
      </div>
    </div>
  );
}
