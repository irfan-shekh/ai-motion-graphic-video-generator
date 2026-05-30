"use client";

import Link from "next/link";
import { Zap, ArrowUpRight, GitBranch, Globe, MessageCircle } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#" },
    { label: "API", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#", badge: "Hiring" },
    { label: "Press", href: "#" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "SDKs", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: <MessageCircle size={16} />, href: "#", label: "Twitter / X" },
  { icon: <GitBranch size={16} />, href: "#", label: "GitHub" },
  { icon: <Globe size={16} />, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(108,99,255,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_16px_rgba(108,99,255,0.4)] group-hover:shadow-[0_0_24px_rgba(108,99,255,0.6)] transition-all duration-300">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] blur-md opacity-30" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Motion<span className="gradient-text">AI</span>
              </span>
            </Link>

            <p className="text-sm text-white/40 leading-relaxed mb-6 font-light">
              The fastest way to create professional motion graphics. Powered by
              AI, built for creators.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-white/8 transition-all duration-200"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                        {"badge" in link && link.badge && (
                          <span className="badge-emerald px-1.5 py-0.5 rounded text-[9px]">
                            {link.badge}
                          </span>
                        )}
                        <ArrowUpRight
                          size={11}
                          className="opacity-0 group-hover:opacity-60 -translate-y-0.5 translate-x-0 group-hover:-translate-y-1 group-hover:translate-x-0.5 transition-all duration-200"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-light">
            © {new Date().getFullYear()} MotionAI Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {["Status", "Security", "Trust Center"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] shadow-[0_0_6px_rgba(0,229,160,0.8)]" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
