-- ================================================================
-- Migration: Embedding pipeline + vector index refresh
-- Date: 2024-11-14
-- ================================================================

-- 1. Refresh filings.ingestion_status constraint to include the new chunked state.
alter table if exists public.filings drop constraint if exists filings_ingestion_status_check;

alter table if exists public.filings
  add constraint filings_ingestion_status_check
  check (ingestion_status in ('uploaded','extracting','chunked','embedding','ready','failed'));

-- 2. Ensure filing_chunks has the metadata columns required by the pipeline.
alter table if exists public.filing_chunks
  add column if not exists page_number integer,
  add column if not exists embedding_model text,
  add column if not exists embedded_at timestamptz;

-- 3. Reset the embedding column so it can store 1536-d vectors from text-embedding-3-small
--    and allow NULLs while chunks wait for embeddings.
alter table if exists public.filing_chunks drop column if exists embedding;
alter table if exists public.filing_chunks add column embedding vector(1536);

-- 4. Indexes to speed up filtering + similarity search.
create index if not exists filing_chunks_user_filing_idx
  on public.filing_chunks (user_id, filing_id);

create index if not exists filing_chunks_filing_chunk_idx
  on public.filing_chunks (filing_id, chunk_index);

create index if not exists filing_chunks_embedding_ivfflat
  on public.filing_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ================================================================
-- End of migration.
-- ================================================================
