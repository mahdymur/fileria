'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#060708] px-4 py-16">
          <span className="text-sm text-muted-foreground">Loading sign-in…</span>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const supabase = createClient();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(search.get('error'));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060708] px-4 py-16">
      <Card className="w-full max-w-md border border-emerald-500/10 bg-[#0b0b0d]/95">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold text-emerald-100">Log in to Fileria</CardTitle>
          <CardDescription>Welcome back. Pick up your research right where you left off.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <div className="flex flex-col gap-3 px-8 pb-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/forgot-password"
            className="text-emerald-300 transition-colors hover:text-emerald-200"
          >
            Forgot password?
          </Link>
          <span>
            Need an account?{' '}
            <Link
              href="/auth/sign-up"
              className="font-medium text-emerald-300 transition-colors hover:text-emerald-200"
            >
              Create one now
            </Link>
          </span>
        </div>
      </Card>
    </main>
  );
}