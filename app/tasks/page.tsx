'use client';

import { useEffect, useState } from 'react';
import { AddButton } from '@/components/AddButton';
import { PageHeader } from '@/components/PageHeader';
import type { Contact, Lead, Task, TaskStatus } from '@/lib/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', due_date: '', contact_id: '', lead_id: '' });

  async function load() {
    const [tasksRes, contactsRes, leadsRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/contacts'),
      fetch('/api/leads')
    ]);
    setTasks(await tasksRes.json());
    setContacts(await contactsRes.json());
    setLeads(await leadsRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ title: '', due_date: '', contact_id: '', lead_id: '' });
    setShowForm(true);
  }

  function openEdit(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      due_date: task.due_date.slice(0, 10),
      contact_id: task.contact_id || '',
      lead_id: task.lead_id || ''
    });
    setShowForm(true);
  }

  async function saveTask(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      due_date: form.due_date,
      contact_id: form.contact_id || null,
      lead_id: form.lead_id || null
    };

    if (editingId) {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...payload })
      });
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, status: 'todo' })
      });
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', due_date: '', contact_id: '', lead_id: '' });
    load();
  }

  async function updateStatus(id: string, status: TaskStatus) {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    load();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <PageHeader title="Tasks" subtitle="Daily follow-ups with due dates." />

      {showForm && (
        <form onSubmit={saveTask} className="card mx-4 mb-4 space-y-3 md:mx-0">
          <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
          <details>
            <summary className="cursor-pointer text-sm text-slate-600">Link to contact/lead (optional)</summary>
            <div className="mt-3 space-y-3">
              <select className="input" value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })}>
                <option value="">No contact</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="input" value={form.lead_id} onChange={(e) => setForm({ ...form, lead_id: e.target.value })}>
                <option value="">No lead</option>
                {leads.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
            </div>
          </details>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">{editingId ? 'Update Task' : 'Save Task'}</button>
            <button className="btn-secondary" type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3 px-4 md:px-0">
        {tasks.map((task) => (
          <article key={task.id} className="card flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              <p className="text-sm text-slate-600">Due: {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                className={task.status === 'done' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => updateStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
              >
                {task.status === 'done' ? 'Done' : 'Todo'}
              </button>
              <button className="btn-secondary" onClick={() => openEdit(task)}>Edit</button>
              <button className="btn-secondary" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <AddButton label="Task" onClick={openCreate} />
    </>
  );
}
