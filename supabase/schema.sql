-- ============================================================================
-- NEXUS AI AUTOMATION AGENCY - NATIVE TYPESCRIPT ENGINE DATABASE SCHEMA
-- Completely native, standalone schema with no third-party engine dependencies
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null default 'client' check (role in ('client', 'admin')),
  company text default '',
  phone text default '',
  plan text not null default 'Starter' check (plan in ('Starter', 'Growth', 'Enterprise')),
  api_key text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Services Table
create table if not exists public.services (
  id text primary key,
  slug text not null unique,
  title text not null,
  short_desc text not null,
  hero_headline text not null,
  detailed_desc text not null,
  icon_name text not null,
  badge text not null,
  deliverables jsonb default '[]'::jsonb,
  business_benefits jsonb default '[]'::jsonb,
  tech_stack jsonb default '[]'::jsonb,
  pricing_note text not null,
  demo_type text not null default 'chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Native Workflows Table (Visual Drag-and-Drop Workflow Canvas)
create table if not exists public.workflows (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text default '',
  status text not null default 'active' check (status in ('active', 'paused', 'draft')),
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  webhook_endpoint text,
  stats jsonb default '{"totalRuns": 0, "successRate": 100, "avgDurationMs": 0}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Workflow Runs Table (Telemetry & Execution History)
create table if not exists public.workflow_runs (
  id text primary key,
  workflow_id text references public.workflows(id) on delete cascade not null,
  workflow_name text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'running' check (status in ('running', 'success', 'failed', 'paused')),
  trigger_source text not null,
  initial_payload jsonb default '{}'::jsonb,
  final_output jsonb,
  duration_ms integer default 0,
  error_summary text,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  finished_at timestamp with time zone
);

-- 5. Workflow Run Steps Table (Granular Step-by-Step Node Tracing)
create table if not exists public.workflow_run_steps (
  id text primary key,
  run_id text references public.workflow_runs(id) on delete cascade not null,
  node_id text not null,
  node_title text not null,
  node_type text not null,
  status text not null check (status in ('pending', 'running', 'success', 'failed', 'skipped')),
  input_data jsonb,
  output_data jsonb,
  duration_ms integer default 0,
  error_message text,
  executed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. API Connectors Table (Reusable REST API & Webhook Integrations)
create table if not exists public.api_connectors (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  base_url text not null,
  auth_type text not null default 'bearer' check (auth_type in ('none', 'bearer', 'api_key', 'basic')),
  auth_header_key text default 'Authorization',
  auth_secret text,
  default_headers jsonb default '{"Content-Type": "application/json"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Chatbots Table
create table if not exists public.chatbots (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  status text not null default 'online' check (status in ('online', 'offline', 'training')),
  model text not null default 'gpt-4o',
  system_prompt text not null,
  welcome_message text not null,
  total_conversations integer default 0,
  avg_response_time text default '1.2s',
  satisfaction_score numeric(3,2) default 4.9,
  knowledge_base_files_count integer default 0,
  accent_color text default '#38bdf8',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Orders Table
create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_name text not null,
  client_company text not null,
  service_id text not null,
  service_title text not null,
  package_type text not null default 'Growth' check (package_type in ('Starter', 'Growth', 'Enterprise', 'Custom')),
  price text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'review', 'completed')),
  delivery_date text,
  notes text,
  assigned_engineer text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Notifications Table
create table if not exists public.notifications (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.workflow_run_steps enable row level security;
alter table public.api_connectors enable row level security;
alter table public.chatbots enable row level security;
alter table public.orders enable row level security;
alter table public.notifications enable row level security;

-- Policies for Profiles: users can read their own profile, admins can read all
create policy "Users can view own profile or admins can view all"
  on public.profiles for select
  using (auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Policies for Workflows
create policy "Users can manage own workflows"
  on public.workflows for all
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Policies for Workflow Runs
create policy "Users can view own workflow runs"
  on public.workflow_runs for all
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Policies for API Connectors
create policy "Users can manage own api connectors"
  on public.api_connectors for all
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');

-- Policies for Orders
create policy "Users can manage own orders"
  on public.orders for all
  using (auth.uid() = user_id or (select role from public.profiles where id = auth.uid()) = 'admin');
