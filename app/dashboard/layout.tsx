import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-300">
      {/* Persistent ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div
          className="absolute top-0 left-0 w-[60%] h-[60%] rounded-full blur-[180px] opacity-15"
          style={{ background: "radial-gradient(circle, #6C63FF, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full blur-[160px] opacity-10"
          style={{ background: "radial-gradient(circle, #00D4FF, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardNav session={session} />
        {children}
      </div>
    </div>
  );
}
