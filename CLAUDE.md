# CLAUDE.md — Project Manager Dashboard

## מטרת הפרויקט
לוח ניהול פרויקטים לפרילנסר/סוכנות.
מאפשר מעקב אחר פרויקטים, משימות, לקוחות ו-deadlines.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 16 (App Router) | Framework |
| React | 19 | UI library |
| TypeScript | 5 | Language (strict mode) |
| Tailwind CSS | v4 | Styling |
| Supabase | v2 | Database + Auth |

> **Note:** The project uses **Next.js 16**, not 14. The `AGENTS.md` file warns that some Next.js APIs differ from standard documentation — always verify against `node_modules/next/dist/`.

---

## Commands

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Directory Structure

```
project-manager/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── EditClientModal.tsx
│   │   ├── EditProjectModal.tsx
│   │   ├── NavLinks.tsx
│   │   ├── NewClientForm.tsx
│   │   ├── NewProjectForm.tsx
│   │   ├── NewTaskForm.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── StatusSelect.tsx
│   │   └── TaskCheckbox.tsx
│   ├── clients/
│   │   ├── [id]/page.tsx    # Client detail page
│   │   └── page.tsx         # Clients list page
│   ├── projects/
│   │   └── [id]/page.tsx    # Project detail page
│   ├── actions.ts           # All server actions (mutations)
│   ├── globals.css          # Global styles + Tailwind import
│   ├── layout.tsx           # Root layout (RTL, sidebar, nav)
│   └── page.tsx             # Home page (projects list)
├── lib/
│   ├── supabase.ts          # Supabase client + all DB functions
│   └── utils.ts             # Utility helpers (deadline display)
├── supabase/
│   └── schema.sql           # Database schema (apply to Supabase project)
├── CLAUDE.md
├── AGENTS.md
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

Create a `.env.local` file (not committed):

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

Both are public/client-side keys. No server-only secrets are required for the current feature set.

---

## Database Schema

Defined in `supabase/schema.sql`. Apply via the Supabase Dashboard SQL editor.

```sql
-- clients
id          uuid  PRIMARY KEY DEFAULT gen_random_uuid()
name        text  NOT NULL
email       text  (nullable)
phone       text  (nullable)
created_at  timestamptz  DEFAULT now()

-- projects
id          uuid  PRIMARY KEY DEFAULT gen_random_uuid()
name        text  NOT NULL
client_id   uuid  (nullable, FK → clients.id)
status      text  CHECK ('active' | 'completed' | 'paused')
deadline    date  (nullable)
created_at  timestamptz  DEFAULT now()

-- tasks
id          uuid  PRIMARY KEY DEFAULT gen_random_uuid()
project_id  uuid  NOT NULL (FK → projects.id ON DELETE CASCADE)
title       text  NOT NULL
done        boolean  DEFAULT false
created_at  timestamptz  DEFAULT now()
```

**Indexes:** `projects.client_id`, `tasks.project_id`

---

## TypeScript Types

All types live in `lib/supabase.ts`:

```typescript
type ProjectStatus = 'active' | 'completed' | 'paused'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

interface Project {
  id: string
  name: string
  client_id: string | null
  status: ProjectStatus
  deadline: string | null
  created_at: string
  client?: Client   // populated via join query
}

interface Task {
  id: string
  project_id: string
  title: string
  done: boolean
  created_at: string
}
```

---

## Data Layer — `lib/supabase.ts`

**All database access must go through this file.** Never call `supabase` directly in components or pages.

| Function | Description |
|---|---|
| `getClients()` | All clients, ordered by name |
| `getClient(id)` | Single client by id |
| `createClient(client)` | Insert new client |
| `getProjects()` | All projects with client join |
| `getProject(id)` | Single project by id |
| `createProject(project)` | Insert new project |
| `updateProjectStatus(id, status)` | Change project status |
| `getTasks(projectId)` | Tasks for a project |
| `createTask(task)` | Insert new task |
| `toggleTask(id, done)` | Flip task done state |
| `getProjectsByClient(clientId)` | Projects for a client |

---

## Server Actions — `app/actions.ts`

Mutations are handled by Next.js Server Actions. Every action calls `revalidatePath()` to refresh data after a write.

| Action | Revalidates |
|---|---|
| `addProjectAction(formData)` | `/` |
| `addTaskAction(formData)` | `/projects/[id]` |
| `addClientAction(formData)` | `/clients` |
| `toggleTaskAction(id, projectId, done)` | `/projects/[id]` |
| `updateProjectStatusAction(id, status)` | `/projects/[id]` |
| `updateProjectAction(formData)` | `/projects/[id]` |
| `updateClientAction(formData)` | `/clients/[id]` |

---

## Component Architecture

### Server vs Client components

- **Server components** (no pragma): handle data fetching, pass data as props
- **`'use client'` components**: interactive UI — forms, modals, checkboxes, dropdowns

| Component | Type | Notes |
|---|---|---|
| `NavLinks` | Client | Active route highlighting |
| `ProjectCard` | Server | Renders project info + status badge |
| `NewProjectForm` | Client | Modal form, calls `addProjectAction` |
| `EditProjectModal` | Client | Modal form, calls `updateProjectAction` |
| `NewClientForm` | Client | Modal form, calls `addClientAction` |
| `EditClientModal` | Client | Modal form, calls `updateClientAction` |
| `NewTaskForm` | Client | Inline form, calls `addTaskAction` |
| `TaskCheckbox` | Client | Optimistic toggle, calls `toggleTaskAction` |
| `StatusSelect` | Client | Dropdown, calls `updateProjectStatusAction` |

### Pages

- **`app/page.tsx`** — Projects home. `export const dynamic = 'force-dynamic'` prevents stale caching.
- **`app/projects/[id]/page.tsx`** — Project detail with task list.
- **`app/clients/page.tsx`** — Clients list. Also `force-dynamic`.
- **`app/clients/[id]/page.tsx`** — Client detail with linked projects.

---

## Utilities — `lib/utils.ts`

### `deadlineDisplay(deadline: string | null)`

Returns a `{ text, className }` object for visual deadline indicators:

| Condition | Text | Style |
|---|---|---|
| No deadline | `null` | — |
| Past date | "באיחור" | Red |
| Today | "היום" | Bold red |
| ≤ 7 days | "N ימים" | Amber |
| Future | Formatted date | Gray |

---

## Coding Conventions

1. **Language:** UI strings in Hebrew, all code (variables, functions, types) in English.
2. **TypeScript:** Strict mode enabled — no `any`, explicit return types on exported functions.
3. **Data access:** Always use `lib/supabase.ts` functions. Never write raw Supabase queries in components.
4. **Mutations:** Always go through `app/actions.ts` server actions, never `fetch`/`axios` from client.
5. **Component size:** Keep components small and focused. Split when a component exceeds ~100 lines.
6. **Naming:** PascalCase for components/types, camelCase for functions/variables, kebab-case for routes.
7. **Path alias:** Use `@/` for absolute imports from the project root (configured in `tsconfig.json`).

---

## Styling Conventions

- **Framework:** Tailwind CSS v4 (imported via `@tailwindcss/postcss` in `globals.css`)
- **Layout:** RTL — `lang="he" dir="rtl"` on `<html>`. Sidebar appears on the right.
- **Color palette:**
  - Primary actions: `indigo-600`
  - Active status: `emerald-600`
  - Completed status: `blue-600`
  - Paused status: `slate-400`
  - Overdue: `red-*`
  - Warning (≤7 days): `amber-*`
- **Border radius:** `rounded-xl` for inputs/buttons, `rounded-2xl` for cards, `rounded-3xl` for modals
- **Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for project/client lists

---

## Features

1. **Project list** — cards with status badge, deadline indicator, task progress bar, and client name
2. **Project detail** — full task list with checkboxes, status dropdown, edit modal, deadline
3. **Client list** — all clients with contact info and project count
4. **Client detail** — client info + linked projects
5. **Deadline alerts** — visual color coding (overdue / today / soon / future)
6. **CRUD** — create/edit for projects, clients, and tasks via server actions

---

## Adding New Features — Checklist

1. **New DB table?** → Add to `supabase/schema.sql`, apply in Supabase dashboard, add types + query functions to `lib/supabase.ts`
2. **New mutation?** → Add server action to `app/actions.ts` with `revalidatePath()`
3. **New page?** → Create `app/[route]/page.tsx`; add `export const dynamic = 'force-dynamic'` if it fetches live data
4. **New interactive component?** → Add `'use client'` pragma, use `useTransition` for server action calls
5. **New utility?** → Add to `lib/utils.ts`
