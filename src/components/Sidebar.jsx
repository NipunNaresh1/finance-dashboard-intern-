// ─── COMPONENT: Sidebar ──────────────────────────────────────────────────────
// Navigation sidebar with logo, nav links, role badge, and dark mode toggle.

import React from "react";
import { useApp } from "../context/AppContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard",    icon: "⊡",  label: "Dashboard"    },
  { id: "transactions", icon: "⇄",  label: "Transactions" },
  { id: "insights",     icon: "◎",  label: "Insights"     },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, actions } = useApp();
  const { activeTab, user, darkMode } = state;

  function handleLogout() {
    actions.logout();
    if (onClose) onClose();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">₹</div>
          <span className="sidebar-logo-text">FinTrack</span>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <span className={`badge badge-${user?.role}`}>
              {user?.role === "admin" ? "⚙ Admin" : "👁 Viewer"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-label">Menu</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => { actions.setTab(item.id); if (onClose) onClose(); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activeTab === item.id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={actions.toggleDark}>
            <span className="nav-icon">{darkMode ? "☀" : "☾"}</span>
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">⇠</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
