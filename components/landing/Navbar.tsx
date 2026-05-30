"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, LogOut, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";
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
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingNavbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          setMobileMenuOpen(false);
        },
      },
    });
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Process", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center px-4 pt-5"
    >
      <nav
        className={`flex flex-col w-full max-w-6xl px-6 py-3 rounded-2xl transition-all duration-500 overflow-hidden ${
          scrolled || mobileMenuOpen
            ? "glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)]"
            : "glass shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="relative z-10 w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.5)] group-hover:shadow-[0_0_30px_rgba(108,99,255,0.7)] transition-all duration-300">
                <Zap className="w-4.5 h-4.5 text-white fill-white" size={18} />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
            <span className="text-[1.15rem] font-bold tracking-tight text-[var(--heading)]">
              Motion<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Nav Links - Laptop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[var(--nav-text)] hover:text-[var(--heading)] rounded-xl hover:bg-[var(--surface-2)] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA / Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="hidden sm:block text-sm font-medium text-[var(--nav-text)] hover:text-[var(--heading)] transition-colors duration-200 px-3 py-2"
                >
                  Sign in
                </Link>
                <Link href="/dashboard">
                  <button className="btn-primary h-9 px-5 text-sm rounded-xl flex items-center gap-2 font-semibold">
                    Get started
                    <span className="hidden sm:inline">— it&apos;s free</span>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="hidden sm:block">
                  <button className="btn-primary h-9 px-4 text-xs md:text-sm rounded-xl flex items-center gap-2 font-semibold">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl glass hover:bg-[var(--surface-2)] transition-all outline-none cursor-pointer border border-[var(--glass-border)] group"
                      >
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            width={30}
                            height={30}
                            className="rounded-lg border border-[var(--glass-border)]"
                          />
                        ) : (
                          <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center text-white font-bold text-xs">
                            {session.user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <ChevronDown
                          size={13}
                          className="text-[var(--faint-text)] group-hover:text-[var(--nav-text)] transition-colors"
                        />
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
                            {session.user.name}
                          </p>
                          <p className="text-xs text-[var(--faint-text)]">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/dashboard"
                          className="flex items-center w-full gap-2"
                        >
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
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl glass border border-[var(--glass-border)] flex items-center justify-center text-[var(--nav-text)] hover:text-[var(--heading)] transition-all cursor-pointer ml-1"
              type="button"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Expansion Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--glass-border)] mt-4 pt-4 pb-2 space-y-4 w-full flex flex-col">
            <div className="flex flex-col gap-1 w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-[var(--nav-text)] hover:text-[var(--heading)] hover:bg-[var(--surface-2)] rounded-xl transition-all w-full text-left"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!session && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--glass-border)] w-full">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-[var(--nav-text)] hover:text-[var(--heading)] hover:bg-[var(--surface-2)] rounded-xl transition-all w-full text-left"
                >
                  Sign in
                </Link>
              </div>
            )}
            {session && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--glass-border)] w-full md:hidden">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--nav-text)] hover:text-[var(--heading)] hover:bg-[var(--surface-2)] rounded-xl transition-all w-full"
                >
                  <LayoutDashboard size={15} />
                  Dashboard Link
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </motion.header>
  );
}
