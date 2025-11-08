import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(145deg,rgba(16,185,129,0.08)_0%,transparent_45%,transparent_55%,rgba(16,185,129,0.08)_100%)]" />
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-emerald-500/20 shadow-[0_0_140px_rgba(16,185,129,0.18)]">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl text-emerald-50">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Check your email to confirm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
