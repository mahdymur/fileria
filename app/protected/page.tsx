import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-[#050708]/85 px-5 py-3 text-sm text-muted-foreground shadow-[0_0_60px_rgba(16,185,129,0.18)]">
          <InfoIcon size="16" strokeWidth={2} className="text-emerald-300" />
          This is a protected page that you can only see as an authenticated user.
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <h2 className="text-2xl font-semibold text-emerald-50">Your user details</h2>
        <pre className="max-h-48 w-full overflow-auto rounded-xl border border-emerald-500/15 bg-[#080a0b] p-4 text-xs text-emerald-200/80 shadow-[0_0_45px_rgba(16,185,129,0.12)]">
          {JSON.stringify(data.claims, null, 2)}
        </pre>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-50">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
