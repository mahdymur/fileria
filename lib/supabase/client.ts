import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Relies on public env vars that must be defined in `.env.local` and Vercel project settings:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(url, anon);
}
