import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { api, getToken, setToken } from "./api/client.js";
import { NavBar } from "./components/ui.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Tasks from "./pages/Tasks.jsx";

function Protected({ authed, children }) {
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function boot() {
      const token = getToken();
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { user: me } = await api.me();
        setUser(me);
      } catch (err) {
        // token invalid/expired
        setToken(null);
        setUser(null);
      } finally {
        setBooting(false);
      }
    }
    boot();
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
  }

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar userEmail={user?.email} onLogout={user ? logout : null} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onAuthed={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup onAuthed={setUser} />} />
        <Route
          path="/"
          element={
            <Protected authed={!!user}>
              <Tasks user={user} />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

