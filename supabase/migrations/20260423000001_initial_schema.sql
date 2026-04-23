-- ============================================
-- BeniBursa - Social Content Engine
-- Initial schema
-- ============================================

create extension if not exists "uuid-ossp";
create extension if not exists "vector";
create extension if not exists "pg_trgm";

-- ============================================
-- Enums
-- ============================================

create type asset_type as enum ('video', 'image', 'audio');
create type asset_status as enum ('pending', 'uploading', 'uploaded', 'analyzing', 'analyzed', 'failed');
create type job_type as enum ('analyze', 'strategize', 'generate', 'export');
create type job_status as enum ('queued', 'running', 'completed', 'failed', 'cancelled');
create type platform as enum ('instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'youtube');
create type piece_type as enum ('reel', 'carousel', 'static_post', 'story', 'short', 'thread', 'feed_grid');
create type piece_status as enum ('planned', 'generating', 'ready', 'failed', 'exported');

-- ============================================
-- projects
-- ============================================

create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  brand_voice jsonb default '{}'::jsonb,
  primary_language text default 'he',
  target_platforms platform[] default array['instagram']::platform[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index projects_user_id_idx on projects(user_id);

-- ============================================
-- assets (raw uploaded media)
-- ============================================

create table assets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  type asset_type not null,
  filename text not null,
  storage_path text not null,
  storage_bucket text not null default 'media',
  duration_seconds numeric,
  resolution text,
  codec text,
  size_bytes bigint,
  status asset_status not null default 'pending',
  metadata jsonb default '{}'::jsonb,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index assets_project_id_idx on assets(project_id);
create index assets_status_idx on assets(status);

-- ============================================
-- analyses (deep semantic understanding)
-- ============================================

create table analyses (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid not null references assets(id) on delete cascade,
  scenes jsonb default '[]'::jsonb,
  transcript text,
  transcript_segments jsonb default '[]'::jsonb,
  speakers jsonb default '[]'::jsonb,
  aesthetic_scores jsonb default '[]'::jsonb,
  audio_features jsonb default '{}'::jsonb,
  brand_signals jsonb default '{}'::jsonb,
  color_palette jsonb default '[]'::jsonb,
  ocr_text text,
  faces jsonb default '[]'::jsonb,
  summary text,
  keywords text[] default array[]::text[],
  language text,
  mood text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index analyses_asset_id_idx on analyses(asset_id);

-- semantic search embeddings
create table analysis_embeddings (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  segment_start_seconds numeric,
  segment_end_seconds numeric,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index analysis_embeddings_asset_id_idx on analysis_embeddings(asset_id);
create index analysis_embeddings_vector_idx on analysis_embeddings
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ============================================
-- content_plans (strategy layer output)
-- ============================================

create table content_plans (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  platform platform not null,
  plan jsonb not null,
  source_asset_ids uuid[] not null,
  model_used text,
  created_at timestamptz default now()
);

create index content_plans_project_id_idx on content_plans(project_id);

-- ============================================
-- content_pieces (individual content units)
-- ============================================

create table content_pieces (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references content_plans(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  type piece_type not null,
  platform platform not null,
  source_refs jsonb not null,
  hook text,
  caption text,
  caption_variants jsonb default '[]'::jsonb,
  hashtags text[] default array[]::text[],
  music_brief text,
  visual_treatment jsonb default '{}'::jsonb,
  predicted_performance_score numeric,
  rationale text,
  output_url text,
  thumbnail_url text,
  status piece_status not null default 'planned',
  version integer default 1,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index content_pieces_plan_id_idx on content_pieces(plan_id);
create index content_pieces_project_id_idx on content_pieces(project_id);
create index content_pieces_status_idx on content_pieces(status);

-- ============================================
-- generations (audit trail of generation runs)
-- ============================================

create table generations (
  id uuid primary key default uuid_generate_v4(),
  piece_id uuid not null references content_pieces(id) on delete cascade,
  model_used text not null,
  cost_usd numeric default 0,
  duration_ms integer,
  input_params jsonb default '{}'::jsonb,
  output_url text,
  error_message text,
  created_at timestamptz default now()
);

create index generations_piece_id_idx on generations(piece_id);

-- ============================================
-- jobs (pipeline orchestration tracking)
-- ============================================

create table jobs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  type job_type not null,
  status job_status not null default 'queued',
  progress integer default 0,
  inngest_run_id text,
  related_asset_id uuid references assets(id) on delete cascade,
  related_piece_id uuid references content_pieces(id) on delete cascade,
  input jsonb default '{}'::jsonb,
  output jsonb default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index jobs_project_id_idx on jobs(project_id);
create index jobs_status_idx on jobs(status);
create index jobs_inngest_run_id_idx on jobs(inngest_run_id);

-- ============================================
-- credits_ledger (usage-based billing)
-- ============================================

create table credits_ledger (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,
  reason text not null,
  reference_id uuid,
  balance_after integer not null,
  created_at timestamptz default now()
);

create index credits_ledger_user_id_idx on credits_ledger(user_id);

-- ============================================
-- updated_at triggers
-- ============================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger assets_updated_at before update on assets
  for each row execute function set_updated_at();
create trigger content_pieces_updated_at before update on content_pieces
  for each row execute function set_updated_at();
