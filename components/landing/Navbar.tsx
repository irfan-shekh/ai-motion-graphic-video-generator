"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
  const { data: session } = authClient.useSession();
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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-[#0f172a]/40 border-b border-white/5"
    >
      <Link href="/" className="flex items-center gap-3 group">
        <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-300">
          <Video className="w-7 h-7 text-blue-400" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white">
          Motion<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link href="#features" className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
          Features
        </Link>
        <Link href="#how-it-works" className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
          Process
        </Link>
        <Link href="#pricing" className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {!session ? (
          <>
            <Link href="/signin" className="text-sm font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
              Login
            </Link>
            <Link href="/dashboard">
              <Button className="h-12 px-8 text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)] transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button type="button" className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all outline-none cursor-pointer border-none bg-transparent">
                    {session.user.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={40} 
                        height={40} 
                        className="rounded-full border border-white/10 shadow-lg" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                }
              />
              <DropdownMenuContent className="w-56 bg-[#0f172a] border-white/10 text-white" align="end" sideOffset={8}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none uppercase tracking-widest">{session.user.name}</p>
                      <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/5" />
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

            <Link href="/dashboard" className="hidden sm:block">
              <Button className="h-12 px-8 text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)] transition-all duration-300">
                Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
