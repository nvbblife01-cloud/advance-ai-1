export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';
export type TaskStatus = 'todo' | 'done';

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  source: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  contact_id: string;
  stage: LeadStage;
  title: string;
  value: number | null;
  created_at: string;
  updated_at: string;
  contact?: Pick<Contact, 'id' | 'name' | 'company'>;
}

export interface Task {
  id: string;
  title: string;
  due_date: string;
  status: TaskStatus;
  contact_id: string | null;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  contact_id: string;
  body: string;
  created_at: string;
}
