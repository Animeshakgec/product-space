import React from "react";
import { Link } from "react-router-dom";

export function Container({ children }) {
  return <div className="mx-auto w-full max-w-5xl px-4 py-10">{children}</div>;
}

export function Card({ children }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>;
}

export function Button({ children, kind = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    kind === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900"
      : kind === "danger"
        ? "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-600"
        : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-slate-700">{label}</div> : null}
      <input
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 ${
          error ? "border-rose-300" : "border-slate-200"
        }`}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </label>
  );
}

export function TextArea({ label, error, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-slate-700">{label}</div> : null}
      <textarea
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 ${
          error ? "border-rose-300" : "border-slate-200"
        }`}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </label>
  );
}

export function NavBar({ userEmail, onLogout }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-sm font-semibold tracking-wide text-slate-900">
          Mini SaaS Task Manager
        </Link>
        <div className="flex items-center gap-3">
          {userEmail ? <div className="text-xs text-slate-600">{userEmail}</div> : null}
          {onLogout ? (
            <Button kind="secondary" onClick={onLogout}>
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

