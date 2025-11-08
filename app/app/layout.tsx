import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase/server";

type Props = {
  children: React.ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const { session } = await getServerSession();

  if (!session) {
    const headerList = await headers();
    const requestedPath =
      headerList.get("x-invoke-path") ?? headerList.get("next-url") ?? "/app";
    const safePath = requestedPath.startsWith("/") ? requestedPath : `/${requestedPath}`;
    const nextParam = encodeURIComponent(safePath);
    redirect(`/auth/login?next=${nextParam}`);
  }

  return <>{children}</>;
}
