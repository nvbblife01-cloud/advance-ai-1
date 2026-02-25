# CRM Lite MVP (Next.js + Supabase)

A mobile-first, classroom-friendly CRM students can build in one session.

## Tech stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Vercel-ready

---

## Phase 1: Architecture + folder tree + Supabase SQL

### What students are building (simple explanation)
You are building a tiny CRM with four mobile tabs: Dashboard, Leads, Contacts, Tasks. Data lives in Supabase. Next.js route handlers are your API.

### Folder tree
```txt
app/
  api/
    contacts/route.ts
    dashboard/route.ts
    leads/route.ts
    login/route.ts
    notes/route.ts
    tasks/route.ts
  contacts/page.tsx
  leads/page.tsx
  login/page.tsx
  tasks/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  AddButton.tsx
  BottomNav.tsx
  PageHeader.tsx
lib/
  auth.ts
  supabaseServer.ts
  types.ts
middleware.ts
supabase/
  schema.sql
.env.example
README.md
```

### Supabase SQL
Run the script in `supabase/schema.sql`. It creates `contacts`, `leads`, `tasks`, and `notes`, adds indexes, timestamps, triggers, and seeds 10 realistic records.

### Commands
```bash
npm install
```

```bash
# In Supabase SQL Editor, paste file contents of supabase/schema.sql and run.
```

---

## Phase 2: Core pages + API routes

### What is included
- **Login**: classroom shared password gate (`/login` + `/api/login`)
- **Contacts**: create/delete contacts + notes timeline
- **Leads**: create/delete leads + one-tap stage changes
- **Tasks**: create/delete tasks + todo/done toggle
- **Dashboard**: KPI cards from `/api/dashboard`

### API endpoints
- `GET/POST/PATCH/DELETE /api/contacts`
- `GET/POST/PATCH/DELETE /api/leads`
- `GET/POST/PATCH/DELETE /api/tasks`
- `GET/POST/DELETE /api/notes`
- `GET /api/dashboard`

### Commands
```bash
npm run dev
```

Open: `http://localhost:3000/login`

---

## Phase 3: Mobile UX polish

### Mobile-first choices
- Bottom nav with 4 tabs
- Large tap targets (44px+)
- Sticky floating `+ Add` buttons on key screens
- One-handed spacing (`px-4`, vertical cards)
- Fast forms: key fields first, optional fields in `<details>`

### Commands
```bash
npm run dev
```

Use browser device toolbar in devtools to test iPhone widths.

---

## Phase 4: Setup + deploy

### Local setup
1. Copy env file:
```bash
cp .env.example .env.local
```
2. Fill env values from Supabase project settings.
3. Install and run:
```bash
npm install
npm run dev
```

### Vercel deploy
1. Push repo to GitHub.
2. Import project into Vercel.
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLASSROOM_PASSWORD`
4. Deploy.
5. In Supabase SQL editor, run `supabase/schema.sql` for production DB.

### Build command / output
- Build: `npm run build`
- Start: `npm run start`

---

## Phase 5: Manual test checklist (15 tests)

1. Login fails with wrong password.
2. Login succeeds with `CLASSROOM_PASSWORD`.
3. Middleware redirects unauthenticated user to `/login`.
4. Dashboard loads 4 KPI cards.
5. Contacts list loads from seeded data.
6. Create contact with required fields only.
7. Create contact with optional fields and tags.
8. Delete a contact.
9. Add note to contact timeline.
10. Leads list loads and shows stage.
11. Create a lead linked to a contact.
12. Tap stage button to move lead stage.
13. Tasks list loads sorted by due date.
14. Create task linked to contact or lead.
15. Toggle task `todo/done` and verify update.

---

## In-class demo script (10 minutes)

1. **Minute 1-2:** Explain app goal and mobile-first tabs.
2. **Minute 2-3:** Show Supabase tables + seeded records.
3. **Minute 3-4:** Log in with shared classroom password.
4. **Minute 4-5:** Create a new contact quickly.
5. **Minute 5-6:** Add a note under that contact.
6. **Minute 6-7:** Create a lead linked to that contact.
7. **Minute 7-8:** Move lead from `New` → `Qualified` in one tap.
8. **Minute 8-9:** Create follow-up task due today and mark done.
9. **Minute 9-10:** Return to dashboard and discuss KPI changes.

---

## Copy-paste terminal quickstart

```bash
cp .env.example .env.local
npm install
npm run dev
```

Then open `http://localhost:3000/login`.
