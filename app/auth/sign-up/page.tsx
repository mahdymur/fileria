'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    setErrorHint(null);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/app`,
      },
    });

    setPending(false);

    const alreadyRegistered = !!data?.user && (data.user.identities?.length ?? 0) === 0;

    if (alreadyRegistered) {
      setError('Looks like you already have an account with that email.');
      setErrorHint('Try signing in or resetting your password to regain access.');
      return;
    }

    if (error) {
      const normalizedMessage = error.message.toLowerCase();
      const isDuplicate =
        error.code === 'user_already_exists' ||
        normalizedMessage.includes('already registered') ||
        normalizedMessage.includes('already exists');

      if (isDuplicate) {
        setError('Looks like you already have an account with that email.');
        setErrorHint('Try signing in or resetting your password to regain access.');
        return;
      }
      setError(error.message);
      return;
    }

    setMessage('Almost there! Check your inbox to confirm your email.');
    setEmail('');
    setPassword('');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060708] px-4 py-16">
      <Card className="w-full max-w-md border border-emerald-500/10 bg-[#0b0b0d]/95">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold text-emerald-100">Create your Fileria account</CardTitle>
          <CardDescription>Start exploring filings with a personalized workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="mb-6 space-y-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <p>{error}</p>
              {errorHint ? (
                <p className="text-xs text-red-200/80">
                  {errorHint}{' '}
                  <Link href="/auth/login" className="font-medium text-emerald-200 underline-offset-2 hover:underline">
                    Go to sign in
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          ) : null}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) {
                    setError(null);
                    setErrorHint(null);
                  }
                }}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) {
                    setError(null);
                    setErrorHint(null);
                  }
                }}
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <div className="px-8 pb-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-emerald-300 transition-colors hover:text-emerald-200">
            Sign in
          </Link>
        </div>
      </Card>
    </main>
  );
}