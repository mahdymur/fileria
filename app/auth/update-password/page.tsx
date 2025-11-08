import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(145deg,rgba(16,185,129,0.08)_0%,transparent_45%,transparent_55%,rgba(16,185,129,0.08)_100%)]" />
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
