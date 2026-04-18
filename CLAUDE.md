# CLAUDE.md — Project Manager Dashboard

## Project Overview

A freelancer/agency project management dashboard built with Next.js App Router.
Tracks projects, clients, tasks, and deadlines with a full Hebrew RTL UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + JS client v2) |
| Language | TypeScript 5 (strict mode) |
| Linting | ESLint 9 (flat config) |

> **Note:** This project uses **Next.js 16 / React 19**, not Next.js 14. APIs and conventions may differ from older training data. Check `node_modules/next/dist/docs/` before writing new Next.js code.

---

## Directory Structure

```
project-manager/
├── app/
│   ├── components/           # Client-side React components
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
│   │   ├── page.tsx          # All clients list (table layout)
│   │   └── [id]/page.tsx     # Client detail with linked projects
│   ├── projects/
│   │   └── [id]/page.tsx     # Project detail with tasks
│   ├── actions.ts            # All server actions ('use server')
│   ├── globals.css           # Tailwind v4 entry + theme variables
│   ├── layout.tsx            # Root layout: RTL, Hebrew, sidebar nav
│   └── page.tsx              # Dashboard homepage (projects overview)
├── lib/
│   ├── supabase.ts           # Supabase client + all TypeScript types + DB functions
│   └── utils.ts              # Shared utilities (deadlineDisplay)
├── supabase/
│   └── schema.sql            # Authoritative DB schema
├── public/                   # Static assets
├── next.config.ts            # Minimal Next.js config
├── tailwind.config.*         # Tailwind v4 via postcss.config.mjs
├── tsconfig.json             # strict: true, path alias @/* → root
└── eslint.config.mjs         # ESLint flat config (Next.js + TypeScript rules)
```

---

## Database Schema

All types are defined in `lib/supabase.ts`. The canonical SQL lives in `supabase/schema.sql`.

### `clients`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto-generated |
| name | text NOT NULL | |
| email | text | nullable |
| phone | text | nullable |
| created_at | timestamptz | |

### `projects`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto-generated |
| name | text NOT NULL | |
| client_id | uuid FK → clients | ON DELETE SET NULL |
| status | text | `'active' \| 'completed' \| 'paused'` |
| deadline | date | nullable |
| created_at | timestamptz | |

### `tasks`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto-generated |
| project_id | uuid FK → projects | ON DELETE CASCADE |
| title | text NOT NULL | |
| done | boolean | default false |
| created_at | timestamptz | |

**Indexes:** `tasks_project_id_idx`, `projects_client_id_idx`

---

## TypeScript Types

Defined in `lib/supabase.ts`:

```typescript
type ProjectStatus = 'active' | 'completed' | 'paused'

interface Client { id, name, email, phone, created_at }
interface Project { id, name, client_id, status, deadline, created_at, client? }
interface Task { id, project_id, title, done, created_at }
```

---

## Data Access Layer (`lib/supabase.ts`)

**All database reads and writes go through `lib/supabase.ts`.** Never query Supabase directly in components or pages.

Available functions:

| Function | Description |
|----------|-------------|
| `getClients()` | Fetch all clients |
| `getClient(id)` | Fetch single client |
| `createClient(data)` | Insert new client |
| `getProjects()` | Fetch all projects with joined client |
| `getProject(id)` | Fetch single project with client |
| `createProject(data)` | Insert new project |
| `updateProjectStatus(id, status)` | Change project status |
| `getProjectsByClient(clientId)` | Projects for a client |
| `getTasks(projectId)` | Tasks for a project |
| `createTask(data)` | Insert new task |
| `toggleTask(id, done)` | Flip task completion |

---

## Server Actions (`app/actions.ts`)

All mutations use Next.js server actions (`'use server'`). Each action calls a `lib/supabase.ts` function and then calls `revalidatePath()` to bust the server cache.

| Action | Revalidates |
|--------|-------------|
| `addProjectAction` | `/` |
| `addTaskAction` | `/projects/[id]` |
| `addClientAction` | `/clients` |
| `toggleTaskAction` | `/projects/[id]` |
| `updateProjectStatusAction` | `/projects/[id]` |
| `updateProjectAction` | `/` and `/projects/[id]` |
| `updateClientAction` | `/clients` and `/clients/[id]` |

**Pattern for new actions:**
1. Extract `FormData` fields
2. Call the appropriate `lib/supabase.ts` function
3. Call `revalidatePath()` for affected routes
4. Return early if validation fails

---

## Component Patterns

### Server vs. Client components

- **Pages** (`app/**/page.tsx`) — server components; fetch data directly, no hooks
- **Components** (`app/components/`) — client components (`'use client'`); use hooks

### Modal forms

All CRUD forms live in modal components. They use:
- `useTransition` + `startTransition` for pending state
- `useRef` for the dialog element
- Server action called inside `startTransition`
- `router.refresh()` is **not** used — `revalidatePath` in the server action handles cache

### Optimistic UI

`TaskCheckbox.tsx` demonstrates the optimistic update pattern:
- Local state mirrors server state
- Flip state immediately on click
- Call `toggleTaskAction` in background

### Dynamic params (Next.js 16)

Route params are a `Promise` in Next.js 16. Always `await` them:
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

---

## Layout & Styling

- **Direction:** `lang="he" dir="rtl"` on `<html>` — the entire app is RTL
- **Sidebar:** Fixed right-side nav, `w-60`, dark `bg-slate-900`
- **Main content:** Offset with `mr-60` (Hebrew RTL sidebar on the right)
- **Tailwind v4:** Uses `@import "tailwindcss"` in `globals.css` (no config file needed)
- **Fonts:** Geist Sans / Geist Mono via `next/font/google`

Status colors follow this convention:
- `active` → green
- `completed` → blue
- `paused` → slate/gray

Deadline urgency colors (from `lib/utils.ts → deadlineDisplay`):
- Past due → red
- Today → red bold
- 1–7 days → amber
- Future → slate

---

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

No server-only secrets currently — both vars are `NEXT_PUBLIC_*` (exposed to browser).

---

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## Coding Conventions

1. **TypeScript strict mode** — no `any`, no non-null assertions without justification
2. **All DB access via `lib/supabase.ts`** — pages and components never import Supabase directly
3. **All mutations via server actions in `app/actions.ts`**
4. **Short, clearly named functions** — one responsibility per function
5. **UI text in Hebrew, code (variables, functions, types) in English**
6. **Path alias `@/`** maps to the project root — use it for all internal imports
7. **No comments** unless the "why" is non-obvious (a workaround, hidden constraint, etc.)
8. **No extra abstraction** — don't generalize until there are 3+ concrete use cases

---

## Key Architectural Decisions

- **No auth layer** — Supabase anon key used; add RLS policies in Supabase console if needed
- **No state management library** — React local state + server revalidation is sufficient
- **No API routes** — all mutations go through server actions; reads are server-component fetches
- **`force-dynamic`** on the homepage to always show fresh project data
