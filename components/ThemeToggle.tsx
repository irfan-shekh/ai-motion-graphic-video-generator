"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
      aria-label="Toggle theme"
      className={`relative w-9 h-9 rounded-xl glass flex items-center justify-center transition-all duration-200 group overflow-hidden ${className}`}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(108,99,255,0.15), transparent 70%)",
        }}
      />

      {/* Moon icon - visible in dark mode, hidden in light mode */}
      <Moon
        size={16}
        className="hidden dark:block text-white/60 group-hover:text-[#a89fff] transition-colors relative z-10"
      />

      {/* Sun icon - visible in light mode, hidden in dark mode */}
      <Sun
        size={16}
        className="block dark:hidden transition-colors relative z-10"
        style={{ color: "var(--faint-text)" }}
      />
    </button>
  );
}
