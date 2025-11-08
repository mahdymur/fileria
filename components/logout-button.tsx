"use client";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = React.ComponentProps<typeof Button>;

export function LogoutButton({
  children = "Log out",
  variant = "outline",
  size = "sm",
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const logout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button onClick={logout} variant={variant} size={size} disabled={isSigningOut} {...props}>
      {isSigningOut ? "Signing out…" : children}
    </Button>
  );
}
