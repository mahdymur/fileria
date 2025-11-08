import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Unified auth callback route.
 * Handles:
 * - Magic links / email confirmations (type=magiclink|signup with token_hash)
 * - Email OTP (type=recovery etc.)
 * - OAuth code exchange (code + state)
 * - Access / refresh token direct redirects (access_token param)
 * After establishing a session, redirects user to /app.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect_to") || "/app";
  const type = url.searchParams.get("type");
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  const supabase = await createClient();
  let error: string | null = null;

  try {
    if (code) {
      // OAuth flow
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) error = exchangeError.message;
    } else if (accessToken && refreshToken) {
      // Direct token redirect (rare but supported)
      const { error: setError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (setError) error = setError.message;
    } else if (tokenHash && type) {
      // Magic link / verify OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash: tokenHash,
      });
      if (verifyError) error = verifyError.message;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unexpected auth error";
  }

  const destination = error ? `/login?error=${encodeURIComponent(error)}` : redirectTo;
  return NextResponse.redirect(new URL(destination, url.origin));
}
