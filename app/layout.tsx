import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Fileria — Effortless Financial Research",
  description:
    "Fileria combines modern AI retrieval with a streamlined workspace so financial teams can surface insights in seconds.",
  icons: {
    icon: "/icon.svg",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} antialiased`}> 
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-[#0b0b0d]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs uppercase tracking-[0.25em] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Fileria</span>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <a href="mailto:hello@fileria.com" className="transition-colors hover:text-gray-300">
            Contact
          </a>
          <a href="#features" className="transition-colors hover:text-gray-300">
            Features
          </a>
          <a href="/pricing" className="transition-colors hover:text-gray-300">
            Pricing
          </a>
        </div>
      </div>
    </footer>
  );
}
