-- ================================================
-- Migration: RAG-ready schema + pgvector enablement
-- Date: 2024-11-14
-- ================================================

-- 1. Enable pgvector so we can store dense embeddings.
create extension if not exists "vector";

-- 2. Make sure the filings table has the metadata columns we need.
alter table if exists public.filings
  add column if not exists ticker text,
  add column if not exists filing_type text,
  add column if not exists filing_date date,
  add column if not exists extracted_at timestamptz,
  add column if not exists ingestion_status text default 'uploaded'::text,
  add column if not exists ingestion_error text,
  add column if not exists chunk_count integer default 0,
  add column if not exists embedding_model text,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz default timezone('utc', now());

-- Constrain ingestion_status to known states (add constraint only if it is missing).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'filings_ingestion_status_check'
  ) then
    alter table public.filings
      add constraint filings_ingestion_status_check
        check (ingestion_status in ('uploaded','extracting','embedding','ready','failed'));
  end if;
end $$;

-- Helpful index for per-user listings.
create index if not exists filings_user_created_idx
  on public.filings (user_id, created_at desc);

-- 3. Create the filing_chunks table that stores embeddings per chunk.
create table if not exists public.filing_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filing_id bigint not null references public.filings(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  token_count integer,
  embedding vector(1024) not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (filing_id, chunk_index)
);

create index if not exists filing_chunks_user_idx
  on public.filing_chunks (user_id, filing_id);

-- (Optional but recommended once you have enough rows)
-- create index filing_chunks_embedding_idx
--   on public.filing_chunks
--   using ivfflat (embedding vector_cosine_ops)
--   with (lists = 100);

-- 4. Lightweight tables to log chat sessions and individual RAG answers.
create table if not exists public.rag_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rag_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.rag_sessions(id) on delete set null,
  question text not null,
  answer text,
  latency_ms integer,
  created_at timestamptz not null default timezone('utc', now())
);

-- 5. Enable Row-Level Security (RLS) and add policies that only allow owners to see their data.
alter table public.filings enable row level security;
alter table public.filing_chunks enable row level security;
alter table public.rag_sessions enable row level security;
alter table public.rag_queries enable row level security;

-- First, drop any existing policies with these names so we can re-create them cleanly.
drop policy if exists "Filings are viewable by owner" on public.filings;
drop policy if exists "Filings are insertable by owner" on public.filings;
drop policy if exists "Filings are updatable by owner" on public.filings;
drop policy if exists "Filings are deleteable by owner" on public.filings;

drop policy if exists "Chunks are viewable by owner" on public.filing_chunks;
drop policy if exists "Chunks are insertable by owner" on public.filing_chunks;
drop policy if exists "Chunks are updatable by owner" on public.filing_chunks;
drop policy if exists "Chunks are deleteable by owner" on public.filing_chunks;

drop policy if exists "Sessions are viewable by owner" on public.rag_sessions;
drop policy if exists "Sessions are insertable by owner" on public.rag_sessions;
drop policy if exists "Sessions are updatable by owner" on public.rag_sessions;
drop policy if exists "Sessions are deleteable by owner" on public.rag_sessions;

drop policy if exists "Queries are viewable by owner" on public.rag_queries;
drop policy if exists "Queries are insertable by owner" on public.rag_queries;
drop policy if exists "Queries are updatable by owner" on public.rag_queries;
drop policy if exists "Queries are deleteable by owner" on public.rag_queries;

-- Filings policies: user can only see and modify their own rows.
create policy "Filings are viewable by owner"
  on public.filings
  for select
  using (auth.uid() = user_id);

create policy "Filings are insertable by owner"
  on public.filings
  for insert
  with check (auth.uid() = user_id);

create policy "Filings are updatable by owner"
  on public.filings
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Filings are deleteable by owner"
  on public.filings
  for delete
  using (auth.uid() = user_id);

-- filing_chunks policies mirror filings.
create policy "Chunks are viewable by owner"
  on public.filing_chunks
  for select
  using (auth.uid() = user_id);

create policy "Chunks are insertable by owner"
  on public.filing_chunks
  for insert
  with check (auth.uid() = user_id);

create policy "Chunks are updatable by owner"
  on public.filing_chunks
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Chunks are deleteable by owner"
  on public.filing_chunks
  for delete
  using (auth.uid() = user_id);

-- rag_sessions policies.
create policy "Sessions are viewable by owner"
  on public.rag_sessions
  for select
  using (auth.uid() = user_id);

create policy "Sessions are insertable by owner"
  on public.rag_sessions
  for insert
  with check (auth.uid() = user_id);

create policy "Sessions are updatable by owner"
  on public.rag_sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Sessions are deleteable by owner"
  on public.rag_sessions
  for delete
  using (auth.uid() = user_id);

-- rag_queries policies.
create policy "Queries are viewable by owner"
  on public.rag_queries
  for select
  using (auth.uid() = user_id);

create policy "Queries are insertable by owner"
  on public.rag_queries
  for insert
  with check (auth.uid() = user_id);

create policy "Queries are updatable by owner"
  on public.rag_queries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Queries are deleteable by owner"
  on public.rag_queries
  for delete
  using (auth.uid() = user_id);

-- ================================================
-- End of migration
-- ================================================
