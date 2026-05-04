"use client";

import Link from "next/link";
import { Play, Video, LogOut, LayoutDashboard, Home } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function DashboardNav({ session }: { session: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <nav className="backdrop-blur-md bg-slate-900/50 border-b border-white/10 px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Play className="text-white w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white">Motion<span className="text-blue-500">AI</span></h1>
          </Link>

          <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <Video className="w-3.5 h-3.5" />
            Home
          </Link>

          <Link href="/dashboard/generate" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <Video className="w-3.5 h-3.5" />
            Generate
          </Link>
          <Link href="/dashboard" className="flex items-center w-full">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>

        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button type="button" className="flex items-center gap-3 p-1.5 pl-4 bg-[#0a0c14]/60 backdrop-blur-md border border-white/10 rounded-full hover:border-blue-500/50 transition-all duration-300 outline-none cursor-pointer group">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-[11px] font-bold text-white tracking-[0.1em] uppercase leading-none">
                    {session?.user?.name || "User"}
                  </span>
                </div>

                <div className="relative">
                  <div className="h-8 w-8 rounded-full border border-white/20 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session?.user?.image} alt="Profile" className="object-cover" />
                    ) : (
                      <span className="text-xs text-white font-black">
                        {session?.user?.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-[#0a0c14] rounded-full shadow-[0_0_8px_#10b981]"></div>
                </div>
              </button>
            }
          />
          <DropdownMenuContent className="w-56 bg-[#0f172a] border-white/10 text-white" align="end" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-black leading-none uppercase tracking-widest">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-slate-400">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              render={
                <Link href="/" className="flex items-center w-full">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Go to Home</span>
                </Link>
              }
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
            />
            <DropdownMenuItem
              render={
                <Link href="/dashboard" className="flex items-center w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              }
              className="hover:bg-white/5 focus:bg-white/5 cursor-pointer"
            />
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
