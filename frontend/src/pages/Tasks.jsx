import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";
import { Button, Card, Container, Input, TextArea } from "../components/ui.jsx";

function StatusPill({ status }) {
  const cls =
    status === "COMPLETED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
}

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setError("");
    const data = await api.listTasks();
    setTasks(data.tasks || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "PENDING").length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    return { pending, completed, total: tasks.length };
  }, [tasks]);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { task } = await api.createTask({ title, description: description || undefined });
      setTasks((prev) => [task, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(task) {
    setError("");
    setBusy(true);
    try {
      const next = task.status === "PENDING" ? "COMPLETED" : "PENDING";
      const { task: updated } = await api.updateTaskStatus(task.id, next);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(task) {
    setError("");
    setBusy(true);
    try {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">New task</h2>
              <p className="mt-1 text-sm text-slate-600">Create tasks that only you can see.</p>
            </div>
            {error ? <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
            <form className="space-y-3" onSubmit={onCreate}>
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
              <TextArea label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={5000} />
              <Button disabled={busy} className="w-full" type="submit">
                {busy ? "Saving..." : "Create task"}
              </Button>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold">Your tasks</h1>
              <div className="mt-1 text-sm text-slate-600">
                {user?.email ? <span className="mr-2">{user.email}</span> : null}
                <span>
                  {summary.pending} pending • {summary.completed} completed • {summary.total} total
                </span>
              </div>
            </div>
            <Button kind="secondary" disabled={busy} onClick={() => load().catch((e) => setError(e.message))}>
              Refresh
            </Button>
          </div>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <Card>
                <div className="text-sm text-slate-600">No tasks yet. Create your first one on the left.</div>
              </Card>
            ) : (
              tasks.map((t) => (
                <Card key={t.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="truncate text-base font-semibold">{t.title}</div>
                        <StatusPill status={t.status} />
                      </div>
                      {t.description ? <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{t.description}</div> : null}
                      <div className="mt-3 text-xs text-slate-500">Created: {new Date(t.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button kind="secondary" disabled={busy} onClick={() => toggleStatus(t)}>
                        {t.status === "PENDING" ? "Mark completed" : "Mark pending"}
                      </Button>
                      <Button kind="danger" disabled={busy} onClick={() => onDelete(t)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

