// ─── CONTROLLER / STATE: AppContext ──────────────────────────────────────────
// Central state management. This is the "C" in MVC.
// All state changes go through here — views just call these functions.

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { INITIAL_TRANSACTIONS } from "../data/mockData";
import { Transaction, generateId } from "../models/Transaction";
import { loadSession, saveSession, clearSession } from "../models/Auth";

// ── State shape ───────────────────────────────────────────────────────────────
const initialState = {
  user:         null,           // logged-in user object or null
  transactions: INITIAL_TRANSACTIONS.map(t => new Transaction(t)),
  filters: {
    search:   "",
    type:     "all",           // "all" | "income" | "expense"
    category: "all",
    sortBy:   "date",
    sortDir:  "desc",
  },
  activeTab:    "dashboard",   // "dashboard" | "transactions" | "insights"
  darkMode:     false,
};

// ── Actions ───────────────────────────────────────────────────────────────────
const A = {
  LOGIN:              "LOGIN",
  LOGOUT:             "LOGOUT",
  ADD_TRANSACTION:    "ADD_TRANSACTION",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  SET_FILTER:         "SET_FILTER",
  RESET_FILTERS:      "RESET_FILTERS",
  SET_TAB:            "SET_TAB",
  TOGGLE_DARK:        "TOGGLE_DARK",
};

// ── Reducer (pure function — easy to read, easy to test) ─────────────────────
function reducer(state, action) {
  switch (action.type) {

    case A.LOGIN:
      return { ...state, user: action.payload };

    case A.LOGOUT:
      return { ...state, user: null };

    case A.ADD_TRANSACTION: {
      const newTx = new Transaction({
        ...action.payload,
        id: generateId(state.transactions),
      });
      const updated = [newTx, ...state.transactions];
      localStorage.setItem("fd_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case A.UPDATE_TRANSACTION: {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? new Transaction(action.payload) : t
      );
      localStorage.setItem("fd_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case A.DELETE_TRANSACTION: {
      const updated = state.transactions.filter(t => t.id !== action.payload);
      localStorage.setItem("fd_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }

    case A.SET_FILTER:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case A.RESET_FILTERS:
      return { ...state, filters: initialState.filters };

    case A.SET_TAB:
      return { ...state, activeTab: action.payload };

    case A.TOGGLE_DARK:
      return { ...state, darkMode: !state.darkMode };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    // Rehydrate from localStorage on first load
    const session = loadSession();
    const storedTx = localStorage.getItem("fd_transactions");
    return {
      ...init,
      user: session,
      transactions: storedTx
        ? JSON.parse(storedTx).map(t => new Transaction(t))
        : init.transactions,
    };
  });

  // Sync session to localStorage on login/logout
  useEffect(() => {
    if (state.user) saveSession(state.user);
    else clearSession();
  }, [state.user]);

  // Apply dark mode class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  // ── Action creators (what views call) ──────────────────────────────────────
  const actions = {
    login:             (user)    => dispatch({ type: A.LOGIN,              payload: user }),
    logout:            ()        => dispatch({ type: A.LOGOUT }),
    addTransaction:    (data)    => dispatch({ type: A.ADD_TRANSACTION,    payload: data }),
    updateTransaction: (data)    => dispatch({ type: A.UPDATE_TRANSACTION, payload: data }),
    deleteTransaction: (id)      => dispatch({ type: A.DELETE_TRANSACTION, payload: id }),
    setFilter:         (filters) => dispatch({ type: A.SET_FILTER,         payload: filters }),
    resetFilters:      ()        => dispatch({ type: A.RESET_FILTERS }),
    setTab:            (tab)     => dispatch({ type: A.SET_TAB,            payload: tab }),
    toggleDark:        ()        => dispatch({ type: A.TOGGLE_DARK }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Custom hook (makes consuming easy) ───────────────────────────────────────
export function useApp() {
  return useContext(AppContext);
}
