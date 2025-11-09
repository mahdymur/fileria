import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060708] px-4 py-16">
      <ForgotPasswordForm className="w-full max-w-md" />
    </main>
  );
}