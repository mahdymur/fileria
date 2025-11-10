# Fileria

Fileria is a Next.js + Supabase application built for frictionless finance intelligence. Authenticated users can upload and query their own financial filings (PDF or text reports), and the system is designed as a foundation for Retrieval-Augmented Generation (RAG).

## Stack

- Next.js App Router (server components + edge-ready API routes)
- Supabase (PostgreSQL, Auth, RLS, Storage)
- Tailwind CSS with a custom neon-dark theme
- Roadmap: vector search (pgvector or hosted), embeddings, LLM orchestration

## Current Features

- Email/password authentication with protected `/app/*` routes
- Row-Level Security: users only access their own filings
- Filings CRUD through `/api/filings`
- Password reset flow (`/auth/forgot-password` ➝ `/auth/update-password`)
- File ingestion starter: upload PDFs or `.txt` via `/api/filings/upload`
- Duplicate email guard during sign-up
- Neon-themed UI for buttons, inputs, cards, and landing sections

## RAG Roadmap

1. **Ingest filings**
	- Upload PDFs/text to Supabase Storage
	- Extract and normalize text
	- Chunk content (semantic or fixed overlapping windows)

2. **Embed & store**
	- Select an embedding model (OpenAI, Hugging Face, local)
	- Store vectors (pgvector or external vector DB)
	- Track metadata: `user_id`, `filing_id`, chunk indexes, token counts

3. **Maintain index**
	- Upsert on filing edits, handle soft deletes
	- Schedule re-embedding for new models or schema tweaks

4. **Retrieve**
	- Hybrid search (vector similarity + keyword/tsvector)
	- Blend scores (reciprocal rank or weighted sum)
	- Enforce per-user filtering before returning results

5. **Generate answers**
	- Build prompts with instructions + top-N chunks
	- Reduce hallucination via citations and confidence hints
	- Cache responses keyed by query + chunk IDs + embedding version

6. **Evaluate quality**
	- Create a benchmark question set
	- Monitor accuracy, latency, and cost per answer
	- Track drift when models or embeddings update

7. **Secure & audit**
	- RLS on raw text, chunks, and embeddings
	- Optional encryption at rest for sensitive filings
	- Log retrieval + generation events for compliance

## Suggested Schema (current + future)

```
users(id, email, created_at)
filings(id, user_id, title, content, created_at)
-- planned:
filing_chunks(id, filing_id, user_id, chunk_text, embedding vector, token_count)
```

## Supabase Setup

### 1. Auth configuration

- Supabase Dashboard → **Authentication → URL Configuration**
	- **Site URL:** `https://fileria.vercel.app` (or your local override)
	- **Redirect URLs:** add
		- `http://localhost:3000/auth/update-password`
		- `https://fileria.vercel.app/auth/update-password`
		- existing login/signup callback URLs
- This enables the password reset flow triggered from `/auth/forgot-password`.

### 2. Database migrations

Run the following SQL in the Supabase SQL editor to extend the `filings` table for file ingestion and make `content` optional while preserving existing data:

```sql
alter table public.filings alter column content drop not null;

alter table public.filings
	add column if not exists storage_path text,
	add column if not exists original_filename text,
	add column if not exists content_type text,
	add column if not exists file_size bigint,
	add column if not exists ingestion_status text default 'uploaded'::text,
	add column if not exists extracted_at timestamp with time zone;

do $$
begin
	if not exists (
		select 1 from pg_constraint where conname = 'filings_ingestion_status_check'
	) then
		alter table public.filings
			add constraint filings_ingestion_status_check
			check (ingestion_status in ('uploaded', 'extracted', 'indexed', 'failed'));
	end if;
end $$;
```

### 3. Storage bucket & policies

```sql
select storage.create_bucket('filings', jsonb_build_object('public', false));

do $$
begin
	if not exists (
		select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users manage own filings objects'
	) then
		create policy "Users manage own filings objects"
		on storage.objects
		for all using (
			bucket_id = 'filings' and owner = auth.uid()
		)
		with check (
			bucket_id = 'filings' and owner = auth.uid()
		);
	end if;
end $$;
```

> **Reminder:** storage policies are evaluated after authentication, so ensure the bucket is private and users interact through the authenticated Supabase client.

## Local Development

1. `npm install`
2. Fill `.env.local` with
	 - `NEXT_PUBLIC_SUPABASE_URL`
	 - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	 - `SUPABASE_SERVICE_ROLE_KEY` (server-only, optional)
3. `npm run dev`
4. Visit `http://localhost:3000`

## Deployment (Preview / Staging)

1. Push to GitHub `main`
2. Vercel project pulls repo; add env vars there:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY` (if server tasks need it)
3. Update Supabase Auth → Redirect URLs with the Vercel domain
4. Redeploy and verify auth + `/api/filings`

## API quick reference

| Method | Route                      | Description |
|--------|---------------------------|-------------|
| GET    | `/api/filings`            | List filings for the current user including ingestion metadata |
| POST   | `/api/filings`            | Create a text-based filing (title + content) |
| DELETE | `/api/filings?id=:id`     | Delete a filing and its stored artifact |
| POST   | `/api/filings/upload`     | Upload a PDF or `.txt` file; stores object in Supabase Storage and inserts a pending filing row |
| GET    | `/api/examples/profile`   | Fetch the authenticated profile record |
| POST   | `/api/examples/profile`   | Create/update the current profile |
| DELETE | `/api/examples/profile`   | Delete the profile for the current user |

## Testing Checklist

- Sign up, confirm, log in, log out
- `/app` redirects unauthenticated users to `/auth/login`
- Authenticated user can `POST`, `DELETE`, and `GET` `/api/filings`
- Upload a PDF via `/api/filings/upload` (FormData) and confirm an object is created in the `filings` bucket and a row is inserted with `ingestion_status = uploaded`
- Hit `/api/examples/profile` with `GET`, `POST`, and `DELETE` to verify full CRUD
- Another user cannot view or delete your filings (RLS enforced)
- UI matches neon theme across landing and dashboard

## Next Steps Before Production

- Add file uploads + text parsing pipeline
- Create embeddings + retrieval endpoints
- Build RAG answer service with citations
- Add monitoring and alerting for auth/API usage
- Automate database migrations

## License

Proprietary (update if you plan to open source).
 
