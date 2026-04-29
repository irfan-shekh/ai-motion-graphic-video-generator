import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1. Fetch session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Security: if no session, kick them to sign-in
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden">
      {/* Background blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col h-screen overflow-y-auto">
        <DashboardNav session={session} />
        {children}
      </div>
    </div>
  );
}
