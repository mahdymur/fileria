-- ================================================================
-- Migration: Cohere embedding dimensions + RLS hardening
-- Date: 2024-11-14
-- Notes: embed-english-v3.0 emits 1024-d vectors. If you change
--        embedding providers/models, update this file + ingestion
--        pipeline + pgvector indexes together.
-- ================================================================

-- 1) Drop any prior IVF indexes so we can rebuild after resizing vectors.
drop index if exists filing_chunks_embedding_idx;
drop index if exists filing_chunks_embedding_ivfflat;

-- 2) Recreate the embedding column at 1024 dimensions for Cohere.
--    We drop/re-add instead of alter type so pgvector doesn't leave
--    behind old data with mismatched dimensions.
alter table if exists public.filing_chunks drop column if exists embedding;
alter table if exists public.filing_chunks add column embedding vector(1024);

-- 3) Build the IVFFlat index tuned for cosine distance. lists=100 works
--    well for mid-sized datasets; feel free to adjust after benchmarking.
create index if not exists filing_chunks_embedding_idx
  on public.filing_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4) Ensure RLS protects filing_chunks even if it was disabled manually.
alter table public.filing_chunks enable row level security;

drop policy if exists "Chunks are viewable by owner" on public.filing_chunks;
drop policy if exists "Chunks are insertable by owner" on public.filing_chunks;
drop policy if exists "Chunks are updatable by owner" on public.filing_chunks;
drop policy if exists "Chunks are deleteable by owner" on public.filing_chunks;

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

-- ================================================================
-- End of migration.
-- ================================================================
