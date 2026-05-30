"use client";

import { useState, useEffect } from "react";
import { Video, History, Sparkles, Plus, ArrowRight, Clock, TrendingUp, Compass, Monitor, Smartphone, Square, Play, Eye } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const TiltCard = ({
  children,
  disabled = false,
  href,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  href: string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const CardWrapper = disabled ? "div" : Link;

  return (
    <motion.div
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full ${
        disabled ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <CardWrapper href={disabled ? "#" : href} className="block h-full">
        {children}
      </CardWrapper>
    </motion.div>
  );
};

const PRESET_TEMPLATES = [
  {
    title: "Cosmic Nebula",
    prompt: "Particles flowing like a river of stars in deep space",
    tag: "Cinematic",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400"
  },
  {
    title: "Cyberpunk Glitch",
    prompt: "Bold text animation with neon glitch effects on dark background",
    tag: "Cyberpunk",
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400"
  },
  {
    title: "Logo Reveal",
    prompt: "Abstract geometric shapes morphing into a corporate logo reveal",
    tag: "Minimalist",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
  }
];

export default function DashboardClient() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingArchives, setLoadingArchives] = useState(true);
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Creator";
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    fetchArchives();
    determineGreeting();
  }, []);

  const fetchArchives = async () => {
    try {
      const response = await fetch("/api/save-project");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Archive Fetch Error:", error);
    } finally {
      setLoadingArchives(false);
    }
  };

  const determineGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good morning");
    else if (hrs < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  };

  const animationsCount = projects.length;

  return (
    <main className="relative flex-1 w-full min-h-full overflow-y-auto bg-background transition-colors duration-300">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-50 dark:opacity-60" />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#6C63FF] rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-[#00D4FF] rounded-full blur-[140px] pointer-events-none"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-12">
        {/* Dynamic Welcoming Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[var(--glass-border)] pb-8"
        >
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 badge-violet px-3 py-1.5 rounded-full mb-1">
              <Sparkles size={11} className="text-[#a89fff] animate-pulse" />
              <span>Studio Workspace</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--heading)] leading-[1.1]">
              {greeting}, <span className="gradient-text">{userName}</span> ⚡
            </h1>
            <p className="text-[var(--body-text)] text-sm max-w-lg font-light leading-relaxed">
              Welcome to your professional generative laboratory. Describe your creative vision and let the render engine compose it in real-time.
            </p>
          </div>

          <Link href="/dashboard/generate">
            <button className="btn-primary h-12 px-6 rounded-xl text-sm font-semibold flex items-center gap-2.5 shadow-[0_8px_20px_rgba(108,99,255,0.25)] hover:shadow-[0_12px_28px_rgba(108,99,255,0.35)] transition-all duration-300 group">
              <Plus size={16} />
              Create New Animation
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Studio Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: <Video size={16} className="text-[#6C63FF]" />,
              value: loadingArchives ? "–" : animationsCount.toString(),
              label: "Creations Saved",
              desc: "Saved in library",
              glow: "shadow-[0_0_20px_rgba(108,99,255,0.15)]"
            },
            {
              icon: <Clock size={16} className="text-[#00D4FF]" />,
              value: "1.8s",
              label: "Render Engine Time",
              desc: "Instant composition",
              glow: "shadow-[0_0_20px_rgba(0,212,255,0.15)]"
            },
            {
              icon: <TrendingUp size={16} className="text-[#00E5A0]" />,
              value: "Ultra-HD",
              label: "Render Fidelity",
              desc: "60 FPS Remotion output",
              glow: "shadow-[0_0_20px_rgba(0,229,160,0.15)]"
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`glass rounded-2xl p-5 flex items-center gap-4 border border-[var(--glass-border)] transition-all duration-300 hover:border-[var(--border-medium)] hover:shadow-lg ${stat.glow}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-1)] flex items-center justify-center shrink-0 border border-[var(--glass-border)]">
                {stat.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-xl md:text-2xl font-black tracking-tight text-[var(--heading)] leading-none">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-[var(--nav-text)]">{stat.label}</p>
                <p className="text-[10px] text-[var(--faint-text)]">{stat.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Primary Workspace Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Action Deck (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--faint-text)] flex items-center gap-2">
              <Compass size={14} className="text-[#6C63FF]" />
              Launch Studio Canvas
            </h2>
            
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              style={{ perspective: 1200 }}
            >
              {/* Creator Card */}
              <TiltCard href="/dashboard/generate">
                <div className="group relative glass rounded-2xl p-6 md:p-8 h-full border border-[var(--glass-border)] hover:border-[#6C63FF]/30 overflow-hidden transition-all duration-500 min-h-[280px] flex flex-col justify-between shadow-sm">
                  {/* Background Radial Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: "radial-gradient(ellipse 80% 80% at 0% 0%, rgba(108,99,255,0.08), transparent 70%)" }}
                  />
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#6C63FF] rounded-full blur-[60px] opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none" />

                  {/* Header details */}
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6C63FF]/20 to-[#6C63FF]/5 border border-[#6C63FF]/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_24px_rgba(108,99,255,0.3)] transition-all duration-500">
                      <Video size={20} className="text-[#8B83FF]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--faint-text)] mb-1">
                      Creative Workspace
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-[var(--heading)] leading-snug">
                      Design Studio
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--body-text)] font-light leading-relaxed mt-2.5">
                      Instantly translate complex copy or abstract descriptions into broadcast-grade keyframes and custom audio layouts.
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#6C63FF] flex items-center gap-1.5">
                      Open Editor
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-[var(--surface-1)] border border-[var(--glass-border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Plus size={13} className="text-[var(--nav-text)]" />
                    </span>
                  </div>
                </div>
              </TiltCard>

              {/* Library Card */}
              <TiltCard
                href="/dashboard/archives"
                disabled={animationsCount === 0 && !loadingArchives}
              >
                <div className="group relative glass rounded-2xl p-6 md:p-8 h-full border border-[var(--glass-border)] hover:border-[#00D4FF]/30 overflow-hidden transition-all duration-500 min-h-[280px] flex flex-col justify-between shadow-sm">
                  {/* Background Radial Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: "radial-gradient(ellipse 80% 80% at 0% 0%, rgba(0,212,255,0.06), transparent 70%)" }}
                  />
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00D4FF] rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

                  {/* Header details */}
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00D4FF]/15 to-[#00D4FF]/5 border border-[#00D4FF]/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_24px_rgba(0,212,255,0.25)] transition-all duration-500">
                      <History size={20} className="text-[#00D4FF]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--faint-text)] mb-1">
                      Resource Library
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-[var(--heading)] leading-snug">
                      Your Archives
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--body-text)] font-light leading-relaxed mt-2.5">
                      {loadingArchives
                        ? "Connecting to library records..."
                        : animationsCount > 0
                        ? `Deploy, edit, and export your library of ${animationsCount} saved motion project${animationsCount !== 1 ? "s" : ""}.`
                        : "Your animation assets catalog is empty. Generate your first video to start collecting files."}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#00D4FF] flex items-center gap-1.5">
                      Access Vault
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-[var(--surface-1)] border border-[var(--glass-border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Eye size={13} className="text-[var(--nav-text)]" />
                    </span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Glowing Presets / Templates Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--faint-text)]">
                Dynamic Quick-Start Presets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_TEMPLATES.map((tpl, idx) => (
                  <Link
                    key={idx}
                    href={`/dashboard/generate?prompt=${encodeURIComponent(tpl.prompt)}`}
                    className={`group border rounded-xl p-4 bg-gradient-to-br transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${tpl.color}`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider">{tpl.tag}</span>
                      <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs font-bold text-[var(--heading)] mb-1 leading-tight group-hover:text-inherit">
                      {tpl.title}
                    </p>
                    <p className="text-[10px] text-[var(--body-text)] font-light leading-normal line-clamp-2">
                      "{tpl.prompt}"
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Creations Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--faint-text)] flex items-center gap-2">
              <History size={14} className="text-[#00D4FF]" />
              Recent Masterpieces
            </h2>

            <div className="space-y-4">
              {loadingArchives ? (
                // Loading Skel
                [1, 2].map((s) => (
                  <div key={s} className="glass rounded-2xl p-4 border border-[var(--glass-border)] animate-pulse flex flex-col gap-3">
                    <div className="h-4 bg-[var(--surface-2)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--surface-1)] rounded w-1/2" />
                    <div className="h-6 bg-[var(--surface-1)] rounded-lg w-1/3" />
                  </div>
                ))
              ) : projects.length > 0 ? (
                projects.slice(0, 3).map((proj) => {
                  const isVertical = proj.aspectRatio === "9:16";
                  const isSquare = proj.aspectRatio === "1:1";
                  return (
                    <div
                      key={proj.id}
                      className="group relative glass rounded-2xl p-4 border border-[var(--glass-border)] hover:border-[var(--border-medium)] transition-all duration-300 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[var(--surface-1)] border border-[var(--glass-border)] px-2 py-0.5 rounded-full text-[var(--nav-text)] flex items-center gap-1.5 shrink-0">
                            {isVertical ? (
                              <Smartphone size={9} className="text-[#6C63FF]" />
                            ) : isSquare ? (
                              <Square size={9} className="text-[#00E5A0]" />
                            ) : (
                              <Monitor size={9} className="text-[#00D4FF]" />
                            )}
                            {proj.aspectRatio}
                          </span>
                          <span className="text-[9px] text-[var(--faint-text)]">
                            {proj.duration}s clip
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--heading)] line-clamp-2 leading-tight">
                          "{proj.prompt}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[var(--glass-border)]">
                        <Link
                          href={`/share/${proj.id}`}
                          className="flex-1 text-center py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[10px] font-bold text-[var(--heading)] transition-all flex items-center justify-center gap-1"
                        >
                          <Play size={10} className="fill-current" />
                          Play Output
                        </Link>
                        <Link
                          href={`/dashboard/generate?prompt=${encodeURIComponent(proj.prompt)}`}
                          className="px-3 py-2 rounded-lg border border-[var(--glass-border)] hover:border-[var(--border-medium)] text-[10px] font-bold text-[var(--nav-text)] hover:text-[var(--heading)] transition-all"
                          title="Remix Prompt in Editor"
                        >
                          Remix
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Clean Empty State
                <div className="glass rounded-2xl p-6 border border-[var(--glass-border)] text-center flex flex-col items-center justify-center py-10">
                  <div className="w-10 h-10 rounded-full bg-[var(--badge-violet-bg)] border border-[var(--badge-violet-border)] flex items-center justify-center mb-4">
                    <Sparkles className="text-[var(--badge-violet-text)] w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--heading)] mb-1">
                    First creation guide
                  </h4>
                  <p className="text-[10px] text-[var(--body-text)] font-light max-w-[200px] leading-relaxed mb-4">
                    Generate an initial AI motion graphic to populate your dashboard masterpieces feed.
                  </p>
                  <Link href="/dashboard/generate">
                    <button className="h-8 px-4 rounded-lg bg-[#6C63FF] hover:bg-[#5548e8] text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                      Go Create
                    </button>
                  </Link>
                </div>
              )}

              {projects.length > 3 && (
                <Link
                  href="/dashboard/archives"
                  className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] hover:text-[#5548e8] transition-colors py-2"
                >
                  View all archives ({projects.length})
                  <ArrowRight size={11} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Pro Fullstack Footer Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--faint-text)] pt-12 border-t border-[var(--glass-border)] flex items-center justify-center gap-1.5"
        >
          <Sparkles size={11} className="text-yellow-500 animate-spin-slow" />
          Pro developer tip: Add details like "neon glitch effects" or "retro synthwave styling" for maximum generative output fidelity.
        </motion.p>
      </div>
    </main>
  );
}