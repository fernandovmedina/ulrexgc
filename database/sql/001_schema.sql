create extension if not exists pgcrypto;

create type user_role as enum ('admin', 'member');
create type lead_status as enum ('new', 'contacted', 'qualified', 'quoted', 'won', 'lost');
create type opportunity_status as enum ('open', 'won', 'lost');
create type activity_type as enum ('call', 'email', 'meeting', 'note', 'task');
create type quote_status as enum ('draft', 'sent', 'accepted', 'declined', 'expired');
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'void');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role user_role not null default 'member',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table clients (
  id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id) on delete set null,
  name text not null, email text, phone text, company text, address text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table leads (
  id uuid primary key default gen_random_uuid(),
  service_line text not null, project_details text not null, property_type text not null,
  property_address text, timeline text not null, budget text not null,
  first_name text not null, last_name text not null, email text not null, phone text not null,
  preferred_contact text, status lead_status not null default 'new', source text not null default 'website',
  assigned_to uuid references profiles(id) on delete set null, notes text,
  language text not null default 'en' check (language in ('en', 'es')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table opportunities (
  id uuid primary key default gen_random_uuid(), client_id uuid references clients(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null, title text not null, value numeric(12,2),
  status opportunity_status not null default 'open', expected_close_date date, owner_id uuid references profiles(id) on delete set null,
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table activities (
  id uuid primary key default gen_random_uuid(), lead_id uuid references leads(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade, opportunity_id uuid references opportunities(id) on delete cascade,
  assigned_to uuid references profiles(id) on delete set null, type activity_type not null, subject text not null,
  details text, due_at timestamptz, completed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table products (
  id uuid primary key default gen_random_uuid(), name text not null, description text, sku text unique,
  unit_price numeric(12,2) not null default 0, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table quotes (
  id uuid primary key default gen_random_uuid(), client_id uuid references clients(id) on delete restrict,
  opportunity_id uuid references opportunities(id) on delete set null, quote_number text unique not null,
  status quote_status not null default 'draft', subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0, total numeric(12,2) not null default 0, valid_until date, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table quote_items (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references quotes(id) on delete cascade,
  product_id uuid references products(id) on delete set null, description text not null,
  quantity numeric(12,2) not null default 1, unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table invoices (
  id uuid primary key default gen_random_uuid(), client_id uuid references clients(id) on delete restrict,
  quote_id uuid references quotes(id) on delete set null, invoice_number text unique not null,
  status invoice_status not null default 'draft', subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0, total numeric(12,2) not null default 0,
  due_date date, paid_at timestamptz, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table invoice_items (
  id uuid primary key default gen_random_uuid(), invoice_id uuid not null references invoices(id) on delete cascade,
  product_id uuid references products(id) on delete set null, description text not null,
  quantity numeric(12,2) not null default 1, unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table calendar_events (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  starts_at timestamptz not null, ends_at timestamptz not null, location text,
  lead_id uuid references leads(id) on delete set null, client_id uuid references clients(id) on delete set null,
  owner_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table team_members (
  id uuid primary key default gen_random_uuid(), profile_id uuid unique references profiles(id) on delete set null,
  full_name text not null, email text unique not null, phone text, title text, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table settings (
  id text primary key, business_name text not null, email text not null, phone text not null,
  address text not null default '', service_area text not null default '', currency text not null default 'USD',
  tax_rate numeric(5,2) not null default 8.25 check (tax_rate between 0 and 100),
  quote_prefix text not null default 'Q-', invoice_prefix text not null default 'INV-',
  quote_validity_days integer not null default 30 check (quote_validity_days > 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
do $$ declare table_name text; begin
  foreach table_name in array array['profiles','clients','leads','opportunities','activities','quotes','quote_items','products','invoices','invoice_items','calendar_events','team_members','settings']
  loop execute format('create trigger set_%I_updated_at before update on %I for each row execute function set_updated_at()', table_name, table_name); end loop;
end $$;
