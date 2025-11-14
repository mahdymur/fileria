-- =================================================================
-- Migration: Align match_user_filing_chunks with UUID filing ids
-- Date: 2024-11-15
-- =================================================================

-- Ensure filing_chunks.filing_id matches the filings.id UUID type.
alter table if exists public.filing_chunks
  alter column filing_id type uuid using filing_id::uuid;

-- Recreate the similarity search helper with uuid[] filters.
drop function if exists public.match_user_filing_chunks;

create or replace function public.match_user_filing_chunks(
  p_user_id uuid,
  p_query_embedding vector(1024),
  p_limit integer default 10,
  p_min_similarity double precision default 0,
  p_filing_ids uuid[] default null,
  p_ticker text default null,
  p_filing_types text[] default null,
  p_date_from date default null,
  p_date_to date default null
)
returns table (
  chunk_id uuid,
  filing_id uuid,
  user_id uuid,
  content text,
  similarity double precision,
  ticker text,
  filing_type text,
  filing_date date
)
language plpgsql
as $$
begin
  return query
  select
    fc.id as chunk_id,
    fc.filing_id,
    fc.user_id,
    fc.content,
    1 - (fc.embedding <=> p_query_embedding) as similarity,
    f.ticker,
    f.filing_type,
    f.filing_date
  from public.filing_chunks fc
  join public.filings f on f.id = fc.filing_id
  where fc.user_id = p_user_id
    and fc.embedding is not null
    and (p_filing_ids is null or fc.filing_id = any(p_filing_ids))
    and (p_ticker is null or f.ticker ilike p_ticker)
    and (p_filing_types is null or f.filing_type = any(p_filing_types))
    and (p_date_from is null or f.filing_date >= p_date_from)
    and (p_date_to is null or f.filing_date <= p_date_to)
    and (1 - (fc.embedding <=> p_query_embedding)) >= coalesce(p_min_similarity, 0)
  order by fc.embedding <=> p_query_embedding
  limit greatest(coalesce(p_limit, 10), 1);
end;
$$;

comment on function public.match_user_filing_chunks is 'Per-user pgvector similarity search across filing_chunks with optional metadata filters (uuid filing ids).';

-- =================================================================
-- End of migration
-- =================================================================
