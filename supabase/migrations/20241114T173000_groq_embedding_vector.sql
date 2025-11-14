-- ================================================================
-- Migration: Adjust filing_chunks embedding dimension for Groq
-- Date: 2024-11-14
-- ================================================================

-- Drop the previous vector index so we can recreate the column with a new dimension.
drop index if exists filing_chunks_embedding_ivfflat;

-- Recreate the embedding column at 768 dims (nomic-embed-text output size).
alter table if exists public.filing_chunks drop column if exists embedding;
alter table if exists public.filing_chunks add column embedding vector(768);

-- Rebuild the IVFFlat index tuned for cosine similarity.
create index if not exists filing_chunks_embedding_ivfflat
  on public.filing_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ================================================================
-- End of migration.
-- ================================================================
