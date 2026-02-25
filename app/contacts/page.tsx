'use client';

import { useEffect, useState } from 'react';
import { AddButton } from '@/components/AddButton';
import { PageHeader } from '@/components/PageHeader';
import type { Contact, Note } from '@/lib/types';

const blankForm = { name: '', phone: '', email: '', company: '', source: '', tags: '' };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  async function load() {
    const [contactsRes, notesRes] = await Promise.all([fetch('/api/contacts'), fetch('/api/notes')]);
    setContacts(await contactsRes.json());
    setNotes(await notesRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      })
    });
    setForm(blankForm);
    setShowForm(false);
    load();
  }

  async function deleteContact(id: string) {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
    load();
  }

  async function addNote(contactId: string) {
    const body = noteDraft[contactId];
    if (!body) return;
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, body })
    });
    setNoteDraft((prev) => ({ ...prev, [contactId]: '' }));
    load();
  }

  return (
    <>
      <PageHeader title="Contacts" subtitle="People and companies you are tracking." />

      {showForm && (
        <form onSubmit={submitContact} className="card mx-4 mb-4 space-y-3 md:mx-0">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <details>
            <summary className="cursor-pointer text-sm text-slate-600">Optional fields</summary>
            <div className="mt-3 space-y-3">
              <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <input className="input" placeholder="Source (referral, ad...)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              <input className="input" placeholder="Tags comma-separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
          </details>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">Save Contact</button>
            <button className="btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3 px-4 md:px-0">
        {contacts.map((contact) => {
          const contactNotes = notes.filter((n) => n.contact_id === contact.id);
          return (
            <article key={contact.id} className="card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{contact.name}</h2>
                  <p className="text-sm text-slate-600">{contact.company || 'No company'} · {contact.email || 'No email'}</p>
                  <p className="text-xs text-slate-500">Tags: {contact.tags?.join(', ') || 'none'}</p>
                </div>
                <button className="btn-secondary" onClick={() => deleteContact(contact.id)}>Delete</button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Notes timeline</p>
                {contactNotes.length === 0 ? <p className="text-sm text-slate-500">No notes yet.</p> : null}
                {contactNotes.map((note) => (
                  <div key={note.id} className="rounded-xl bg-slate-100 p-2 text-sm">
                    <p>{note.body}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(note.created_at).toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    className="input"
                    placeholder="Quick note..."
                    value={noteDraft[contact.id] || ''}
                    onChange={(e) => setNoteDraft((prev) => ({ ...prev, [contact.id]: e.target.value }))}
                  />
                  <button className="btn-primary" onClick={() => addNote(contact.id)}>Add</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <AddButton label="Contact" onClick={() => setShowForm(true)} />
    </>
  );
}
