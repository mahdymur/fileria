import { createServerClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server Supabase client.
 * Always create per-request to avoid Fluid compute issues.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignored in Server Components; middleware refreshes session.
          }
        },
      },
    },
  );
}

/**
 * Retrieve the current user session on the server.
 */
export async function getServerSession(): Promise<{
  session: Session | null;
}> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session };
}