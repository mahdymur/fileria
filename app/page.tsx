import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { TutorialSteps } from "@/components/tutorial/tutorial-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Your App Name</Link>
              <Link href={"/examples"} className="text-muted-foreground hover:text-foreground transition-colors">
                Examples
              </Link>
            </div>
			<div className="flex items-center gap-2">
				{!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
				<ThemeSwitcher />
			</div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-12 px-4">
            {hasEnvVars ? (
              <>
                <div className="flex flex-col gap-6">
                  <h2 className="font-medium text-xl mb-4">Next steps</h2>
                  <SignUpUserSteps />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-xl">Tutorials</h2>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/examples">
                        View All Examples
                      </Link>
                    </Button>
                  </div>
                  <TutorialSteps />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                <h2 className="font-medium text-xl mb-4">Next steps</h2>
                <ConnectSupabaseSteps />
              </div>
            )}
          </main>
        </div>

      
      </div>
    </main>
  );
}
