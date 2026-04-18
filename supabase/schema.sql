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

-- vehicles (luxury car rental showcase)
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year int not null,
  category text not null check (category in ('sport', 'sedan', 'suv', 'convertible')),
  daily_price_ils int not null,
  status text not null default 'available' check (status in ('available', 'rented', 'maintenance')),
  description_he text,
  engine_size text,
  horsepower int,
  zero_to_hundred numeric(3,1),
  top_speed int,
  transmission text,
  seats int,
  fuel_type text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  url text not null,
  alt_he text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists vehicle_images_vehicle_id_idx on vehicle_images(vehicle_id);
create index if not exists vehicles_category_idx on vehicles(category);
create index if not exists vehicles_status_idx on vehicles(status);
