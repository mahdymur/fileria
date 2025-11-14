import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Relies on public env vars that must be defined in `.env.local` and Vercel project settings:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "@supabase/ssr: Your project's URL and API key are required to create a Supabase client!\n\n" +
        "Check your Supabase project's API settings to find these values:\n" +
        "https://supabase.com/dashboard/project/_/settings/api\n\n" +
        "Make sure you have set the following environment variables:\n" +
        "- NEXT_PUBLIC_SUPABASE_URL\n" +
        "- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n" +
        "These should be in your `.env.local` file in the project root."
    );
  }

  return createBrowserClient(url, anon);
}
