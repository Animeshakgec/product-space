import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api/client.js";
import { Button, Card, Container, Input } from "../components/ui.jsx";

export default function Signup({ onAuthed }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await api.signup({ name: name || undefined, email, password });
      setToken(token);
      onAuthed?.(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-md">
        <Card>
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Create account</h1>
            <p className="mt-1 text-sm text-slate-600">Takes 10 seconds.</p>
          </div>
          {error ? <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input label="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} type="text" />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            <Button disabled={loading} className="w-full" type="submit">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-medium text-slate-900 underline" to="/login">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
}

