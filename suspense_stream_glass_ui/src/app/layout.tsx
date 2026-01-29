/* 
  Decision log:
  - Two ways to manage themes: server-controlled (cookies) vs client-controlled (localStorage).
    -> Chose client-controlled for simplicity and to demonstrate hydration behavior.
  - Two options to apply theme: Tailwind 'dark' class vs DaisyUI 'data-theme'.
    -> Chose DaisyUI 'data-theme' to practice DaisyUI tokens and multi-theme support.
  - Layout remains a Server Component (default) to enable SSR/streaming; theme toggle is a Client Component.
*/

import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Suspense + Streaming + Glass UI",
  description: "Practice app with Next.js, DaisyUI themes, and Pexels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initial theme chosen from public env; client can override on mount.
  const defaultTheme = process.env.NEXT_PUBLIC_THEME_DEFAULT || "glasslight";

  return (
    <html lang="en" data-theme={defaultTheme}>
      <body className="min-h-screen relative">
        <div className="navbar glass bg-base-100/40 backdrop-blur-md relative z-10">
          <div className="container mx-auto px-4">
            <div className="navbar-start">
              <a className="btn btn-ghost text-xl font-semibold tracking-tight">
                Glass Gallery
              </a>
            </div>
            <div className="navbar-center" />
            <div className="navbar-end">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main content above overlay */}
        <main className="container mx-auto px-4 py-6 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
