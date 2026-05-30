"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, LogOut, LayoutDashboard, Home, Plus, ChevronDown, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardNav({
  session,
}: {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
    };
  } | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { href: "/", label: "Home", icon: <Home size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/6 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_16px_rgba(108,99,255,0.4)] group-hover:shadow-[0_0_24px_rgba(108,99,255,0.6)] transition-all duration-300">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] blur-md opacity-30" />
            </div>
            <span className="text-base font-bold text-[var(--heading)] tracking-tight">
              Motion<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Nav Links - Laptop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#6C63FF]/15 text-[var(--violet)] border border-[#6C63FF]/25"
                      : "text-[var(--nav-text)] hover:text-[var(--heading)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span className={active ? "text-[#6C63FF]" : ""}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Quick action */}
          <Link href="/dashboard/generate">
            <button className="btn-primary h-9 px-4 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Plus size={15} />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl glass hover:bg-[var(--surface-2)] border border-[var(--glass-border)] transition-all outline-none cursor-pointer group"
                >
                  <div className="relative">
                    <div className="h-7 w-7 rounded-lg border border-[var(--glass-border)] overflow-hidden bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
                      {session?.user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs text-white font-bold">
                          {session?.user?.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-[#00E5A0] border-2 border-[var(--page-bg)] rounded-full shadow-[0_0_6px_rgba(0,229,160,0.8)]" />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[var(--heading)] leading-none">
                      {session?.user?.name?.split(" ")[0] || "User"}
                    </span>
                  </div>
                  <ChevronDown size={12} className="text-[var(--faint-text)] group-hover:text-[var(--nav-text)] transition-colors" />
                </button>
              }
            />
            <DropdownMenuContent
              className="w-56 bg-[var(--card)] border border-[var(--glass-border)] text-[var(--heading)] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              align="end"
              sideOffset={10}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal py-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-[var(--heading)]">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-[var(--faint-text)]">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
              <DropdownMenuItem
                render={
                  <Link href="/" className="flex items-center w-full gap-2">
                    <Home className="h-4 w-4 text-[var(--nav-text)]" />
                    <span>Go to Home</span>
                  </Link>
                }
                className="hover:bg-[var(--surface-2)] focus:bg-[var(--surface-2)] text-[var(--heading)] cursor-pointer rounded-lg mx-1 px-3 py-2"
              />
              <DropdownMenuItem
                render={
                  <Link href="/dashboard" className="flex items-center w-full gap-2">
                    <LayoutDashboard className="h-4 w-4 text-[var(--nav-text)]" />
                    <span>Dashboard</span>
                  </Link>
                }
                className="hover:bg-[var(--surface-2)] focus:bg-[var(--surface-2)] text-[var(--heading)] cursor-pointer rounded-lg mx-1 px-3 py-2"
              />
              <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-[#FF4D6D] hover:bg-[#FF4D6D]/10 focus:bg-[#FF4D6D]/10 cursor-pointer rounded-lg mx-1 px-3 py-2 gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--nav-text)] hover:text-[var(--heading)] transition-all cursor-pointer ml-1"
            type="button"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--glass-border)] bg-[var(--card)] px-4 py-4 space-y-3 shadow-xl transition-all duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/25"
                      : "text-[var(--nav-text)] hover:text-[var(--heading)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
