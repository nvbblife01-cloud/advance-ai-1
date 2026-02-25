'use client';

import { useEffect, useState } from 'react';
import { AddButton } from '@/components/AddButton';
import { PageHeader } from '@/components/PageHeader';
import type { Contact, Lead, LeadStage } from '@/lib/types';

const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', contact_id: '', stage: 'New' as LeadStage, value: '' });

  async function load() {
    const [leadRes, contactRes] = await Promise.all([fetch('/api/leads'), fetch('/api/contacts')]);
    setLeads(await leadRes.json());
    setContacts(await contactRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ title: '', contact_id: '', stage: 'New', value: '' });
    setShowForm(true);
  }

  function openEdit(lead: Lead) {
    setEditingId(lead.id);
    setForm({
      title: lead.title,
      contact_id: lead.contact_id,
      stage: lead.stage,
      value: lead.value ? String(lead.value) : ''
    });
    setShowForm(true);
  }

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, value: form.value ? Number(form.value) : null };

    if (editingId) {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...payload })
      });
    } else {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ title: '', contact_id: '', stage: 'New', value: '' });
    load();
  }

  async function moveStage(id: string, stage: LeadStage) {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stage })
    });
    load();
  }

  async function deleteLead(id: string) {
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <PageHeader title="Leads Pipeline" subtitle="Tap a stage to move deals quickly." />

      {showForm && (
        <form onSubmit={saveLead} className="card mx-4 mb-4 space-y-3 md:mx-0">
          <input className="input" placeholder="Lead title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input" value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })} required>
            <option value="">Select contact</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select className="input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as LeadStage })}>
              {stages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input className="input" placeholder="Value (optional)" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">{editingId ? 'Update Lead' : 'Save Lead'}</button>
            <button className="btn-secondary" type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3 px-4 md:px-0">
        {leads.map((lead) => (
          <article key={lead.id} className="card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{lead.title}</h2>
                <p className="text-sm text-slate-600">{lead.contact?.name || 'No contact'} · {lead.stage}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => openEdit(lead)}>Edit</button>
                <button className="btn-secondary" onClick={() => deleteLead(lead.id)}>Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => moveStage(lead.id, stage)}
                  className={`h-10 rounded-lg text-xs font-medium ${
                    lead.stage === stage ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <AddButton label="Lead" onClick={openCreate} />
    </>
  );
}
