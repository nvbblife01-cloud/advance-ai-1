-- CRM Lite MVP schema + sample data
create extension if not exists "pgcrypto";

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  company text,
  source text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(id) on delete cascade,
  title text not null,
  stage text not null check (stage in ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')),
  value numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date timestamptz not null,
  status text not null default 'todo' check (status in ('todo', 'done')),
  contact_id uuid references contacts(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_contact_id on leads(contact_id);
create index if not exists idx_leads_stage on leads(stage);
create index if not exists idx_tasks_contact_id on tasks(contact_id);
create index if not exists idx_tasks_lead_id on tasks(lead_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_due_date on tasks(due_date);
create index if not exists idx_notes_contact_id on notes(contact_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists contacts_set_updated_at on contacts;
create trigger contacts_set_updated_at before update on contacts
for each row execute function set_updated_at();

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at before update on leads
for each row execute function set_updated_at();

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at before update on tasks
for each row execute function set_updated_at();

drop trigger if exists notes_set_updated_at on notes;
create trigger notes_set_updated_at before update on notes
for each row execute function set_updated_at();

truncate notes, tasks, leads, contacts restart identity cascade;

insert into contacts (name, phone, email, company, source, tags)
values
  ('Alicia Gomez', '+1-555-101-2201', 'alicia@northstar.io', 'Northstar Labs', 'Referral', array['saas','warm']),
  ('Marcus Lee', '+1-555-101-2202', 'marcus@hillside.dev', 'Hillside Dev', 'Instagram', array['startup']),
  ('Priya Nair', '+1-555-101-2203', 'priya@orbitwell.com', 'OrbitWell', 'Event', array['health','b2b']),
  ('Jordan Kim', '+1-555-101-2204', 'jordan@riverops.co', 'RiverOps', 'Cold Email', array['ops']),
  ('Sofia Patel', '+1-555-101-2205', 'sofia@seedhouse.org', 'SeedHouse', 'Referral', array['nonprofit']),
  ('Noah Williams', '+1-555-101-2206', 'noah@clearline.ai', 'Clearline AI', 'Website', array['ai']),
  ('Emma Chen', '+1-555-101-2207', 'emma@sunbeam.shop', 'Sunbeam Shop', 'Facebook', array['retail']),
  ('Liam Brown', '+1-555-101-2208', 'liam@peakaccounting.com', 'Peak Accounting', 'LinkedIn', array['finance']),
  ('Maya Singh', '+1-555-101-2209', 'maya@cobaltcare.com', 'Cobalt Care', 'Event', array['health']),
  ('Ethan Davis', '+1-555-101-2210', 'ethan@forgeworks.net', 'ForgeWorks', 'Cold Call', array['manufacturing']);

insert into leads (contact_id, title, stage, value)
select id,
  case row_number() over (order by created_at)
    when 1 then 'Northstar annual plan'
    when 2 then 'Hillside onboarding bundle'
    when 3 then 'OrbitWell pilot'
    when 4 then 'RiverOps support package'
    when 5 then 'SeedHouse donation CRM'
    when 6 then 'Clearline AI expansion'
    when 7 then 'Sunbeam POS integration'
    when 8 then 'Peak accounting refresh'
    when 9 then 'Cobalt Care trial'
    else 'ForgeWorks process audit'
  end,
  (array['New','Contacted','Qualified','Proposal','Won','Lost','New','Qualified','Contacted','Proposal'])[row_number() over (order by created_at)],
  (array[1200,2400,3800,4200,5000,1800,1500,2600,2200,3100])[row_number() over (order by created_at)]
from contacts
order by created_at
limit 10;

insert into tasks (title, due_date, status, contact_id, lead_id)
select
  'Follow up: ' || c.name,
  now() + ((row_number() over (order by c.created_at) % 5) || ' day')::interval,
  (array['todo','todo','done','todo','done','todo','todo','done','todo','todo'])[row_number() over (order by c.created_at)],
  c.id,
  l.id
from contacts c
join leads l on l.contact_id = c.id
order by c.created_at
limit 10;

insert into notes (contact_id, body)
select id,
  case row_number() over (order by created_at)
    when 1 then 'Requested pricing sheet by Friday.'
    when 2 then 'Prefers WhatsApp over email.'
    when 3 then 'Interested in a 2-week pilot.'
    when 4 then 'Needs approval from COO.'
    when 5 then 'Strong nonprofit use case.'
    when 6 then 'Asked about AI roadmap.'
    when 7 then 'Wants quick training video.'
    when 8 then 'Budget resets next month.'
    when 9 then 'Will review with clinical team.'
    else 'Asked for implementation timeline.'
  end
from contacts
order by created_at
limit 10;
