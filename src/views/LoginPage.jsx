import React, { useState } from "react";
import { authenticateUser } from "../models/Auth";
import { useApp } from "../context/AppContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { actions } = useApp();
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = authenticateUser(username.trim(), password);

      if (user) {
        actions.login(user);
      } else {
        setError("Invalid username or password. Please try again.");
      }

      setLoading(false);
    }, 600);
  }

  return (
    <div className="login-page center-layout">
      <div className="login-card slide-up">

        {/* Logo */}
        <div className="brand-logo">
          <span className="logo-icon">₹</span>
          <span className="logo-text">FinTrack</span>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Sign In
          </button>

          <button
            className={`login-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => { setTab("signup"); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        {tab === "login" ? (
          <>
            <div className="login-welcome">
              <h2>Welcome back 👋</h2>
              <p>Sign in to continue to your dashboard</p>
            </div>

            {/* Demo credentials */}
            <div className="cred-hint">
              <span className="cred-label">Demo credentials</span>

              <div className="cred-row">
                <span>Admin:</span>
                <strong>nipunnaresh1 / Nipun@123</strong>
              </div>

              <div className="cred-row">
                <span>Viewer:</span>
                <strong> viewer01    / View@123</strong>
              </div>
            </div>

            <form onSubmit={handleLogin} className="login-form">

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="login-error">⚠️ {error}</p>}

              <button className="login-btn" disabled={loading}>
                {loading ? "Loading..." : "Sign In →"}
              </button>

            </form>
          </>
        ) : (
          <div className="signup-placeholder">
            <h3>🚀 Coming Soon</h3>
            <p>Sign up is not available in this demo.</p>
            <button onClick={() => setTab("login")}>
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}