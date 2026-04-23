-- ============================================
-- Row-Level Security policies
-- Users can only access their own projects and everything tied to them
-- ============================================

alter table projects enable row level security;
alter table assets enable row level security;
alter table analyses enable row level security;
alter table analysis_embeddings enable row level security;
alter table content_plans enable row level security;
alter table content_pieces enable row level security;
alter table generations enable row level security;
alter table jobs enable row level security;
alter table credits_ledger enable row level security;

-- projects: owner-only
create policy "projects_owner_select" on projects
  for select using (auth.uid() = user_id);
create policy "projects_owner_insert" on projects
  for insert with check (auth.uid() = user_id);
create policy "projects_owner_update" on projects
  for update using (auth.uid() = user_id);
create policy "projects_owner_delete" on projects
  for delete using (auth.uid() = user_id);

-- helper: check project ownership
create or replace function user_owns_project(p_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from projects where id = p_id and user_id = auth.uid()
  );
$$;

-- assets, analyses, content_plans, content_pieces, jobs: through project ownership
create policy "assets_project_owner" on assets
  for all using (user_owns_project(project_id)) with check (user_owns_project(project_id));

create policy "analyses_project_owner" on analyses
  for all using (exists (
    select 1 from assets a where a.id = asset_id and user_owns_project(a.project_id)
  )) with check (true);

create policy "analysis_embeddings_project_owner" on analysis_embeddings
  for all using (exists (
    select 1 from assets a where a.id = asset_id and user_owns_project(a.project_id)
  )) with check (true);

create policy "content_plans_project_owner" on content_plans
  for all using (user_owns_project(project_id)) with check (user_owns_project(project_id));

create policy "content_pieces_project_owner" on content_pieces
  for all using (user_owns_project(project_id)) with check (user_owns_project(project_id));

create policy "generations_project_owner" on generations
  for all using (exists (
    select 1 from content_pieces cp where cp.id = piece_id and user_owns_project(cp.project_id)
  )) with check (true);

create policy "jobs_project_owner" on jobs
  for all using (user_owns_project(project_id)) with check (user_owns_project(project_id));

-- credits: owner-only, insert via server only
create policy "credits_ledger_owner_select" on credits_ledger
  for select using (auth.uid() = user_id);
