// filepath: ./app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/auth/update-password`,
    });
    setPending(false);
    if (error) setError(error.message);
    else setMessage('Check your email for a password reset link.');
  }

  return (
    <main className="min-h-screen bg-black text-green-400 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-green-700/40 rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-green-400">Reset your password</h1>
        {message && <div className="mt-4 border border-green-500/50 bg-green-500/10 p-3 rounded text-green-300">{message}</div>}
        {error && <div className="mt-4 border border-red-500/50 bg-red-500/10 p-3 rounded text-red-300">{error}</div>}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md bg-black border border-zinc-700 focus:border-green-500 focus:ring-0 text-green-100 px-3 py-2 placeholder-zinc-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-green-600 hover:bg-green-500 disabled:opacity-60 text-black font-medium py-2 transition-colors"
          >
            {pending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </main>
  );
}