-- clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

-- projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references clients(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  deadline date,
  created_at timestamptz not null default now()
);

-- tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists projects_client_id_idx on projects(client_id);
