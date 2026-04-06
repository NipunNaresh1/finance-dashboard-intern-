// ─── MODEL: Auth ─────────────────────────────────────────────────────────────
// Handles user authentication logic (no UI, pure logic).

import { USERS } from "../data/mockData";

export function authenticateUser(username, password) {
  const user = USERS.find(
    u => u.username === username && u.password === password
  );
  return user || null;
}

export function saveSession(user) {
  localStorage.setItem("fd_session", JSON.stringify(user));
}

export function loadSession() {
  try {
    const raw = localStorage.getItem("fd_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("fd_session");
}
