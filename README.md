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

## Testing Checklist

- Sign up, confirm, log in, log out
- `/app` redirects unauthenticated users to `/auth/login`
- Authenticated user can `POST` and `GET` `/api/filings`
- Another user cannot view filings (RLS enforced)
- UI matches neon theme across landing and dashboard

## Next Steps Before Production

- Add file uploads + text parsing pipeline
- Create embeddings + retrieval endpoints
- Build RAG answer service with citations
- Add monitoring and alerting for auth/API usage
- Automate database migrations

## License

Proprietary (update if you plan to open source).
 