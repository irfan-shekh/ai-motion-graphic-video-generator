"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "50K+", label: "Videos Created", icon: <TrendingUp size={14} /> },
  { value: "4.9★", label: "Average Rating", icon: <Star size={14} /> },
  { value: "<60s", label: "Generation Time", icon: <Sparkles size={14} /> },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-100" />
        {/* Radial fade over grid */}
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 70%)"
        }} />

        {/* Ambient orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-[#6C63FF] rounded-full blur-[140px] opacity-20 pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#00D4FF] rounded-full blur-[140px] opacity-15 pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#00E5A0] rounded-full blur-[120px] opacity-10 pointer-events-none"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 badge-violet px-4 py-2 rounded-full mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C63FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C63FF]" />
          </span>
          <span>Introducing MotionAI 2.0</span>
          <ArrowRight size={12} className="text-[#a89fff]" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
        >
          Turn ideas into
          <br />
          <span className="gradient-text">motion graphics</span>
          <br />
          in seconds.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed font-light"
        >
          Describe your vision in plain language. Our AI handles the keyframes,
          timing, and rendering — delivering broadcast-quality results instantly.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link href="/dashboard/generate">
            <button className="btn-primary h-12 px-7 text-base rounded-xl flex items-center gap-2.5 font-semibold">
              Start creating for free
              <ArrowRight size={18} />
            </button>
          </Link>

          <Link href="#features">
            <button className="h-12 px-7 text-base rounded-xl flex items-center gap-2.5 font-medium text-white/70 hover:text-white glass hover:bg-white/8 transition-all duration-300 border border-white/10 hover:border-white/20">
              <Play size={14} className="fill-current" />
              See how it works
            </button>
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 mb-20"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5 text-white/60">
              <div className="text-[#6C63FF]">{stat.icon}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/50">{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Hero UI Preview */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl"
        >
          {/* Browser chrome */}
          <div className="glass-strong rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] border border-white/8">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF4D6D]/70" />
                <div className="w-3 h-3 rounded-full bg-[#FFB347]/70" />
                <div className="w-3 h-3 rounded-full bg-[#00E5A0]/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-white/5 text-white/30 text-xs font-mono">
                  app.motionai.com/generate
                </div>
              </div>
            </div>

            {/* App content mockup */}
            <div className="p-6 bg-gradient-to-b from-[#0a0d1e] to-[#050816] min-h-[300px] flex flex-col gap-4">
              {/* Prompt bar */}
              <div className="flex gap-3 items-center">
                <div className="flex-1 glass rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
                  <span className="text-white/40 text-sm">
                    A futuristic city timelapse with neon lights and dynamic particle effects...
                  </span>
                </div>
                <div className="btn-primary h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0">
                  <Sparkles size={14} />
                  Generate
                </div>
              </div>

              {/* Preview grid */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { color: "from-[#6C63FF]/30 to-[#00D4FF]/20", label: "Neon City", duration: "0:15" },
                  { color: "from-[#00E5A0]/20 to-[#00D4FF]/30", label: "Data Flow", duration: "0:30" },
                  { color: "from-[#FF4D6D]/20 to-[#FFB347]/20", label: "Particle Storm", duration: "0:12" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`aspect-video rounded-xl bg-gradient-to-br ${item.color} border border-white/8 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden group cursor-pointer`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Play size={12} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[10px] text-white/60 font-medium">{item.label}</span>
                      <span className="text-[10px] text-white/40">{item.duration}</span>
                    </div>
                    {i === 0 && (
                      <div className="absolute top-2 right-2">
                        <span className="badge-violet px-1.5 py-0.5 rounded text-[9px]">NEW</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] shadow-[0_0_6px_rgba(0,229,160,0.8)]" />
                    <span className="text-xs text-white/40">3 videos rendered</span>
                  </div>
                </div>
                <span className="text-xs text-white/30">2.4s avg render time</span>
              </div>
            </div>
          </div>

          {/* Reflection / glow beneath */}
          <div className="w-3/4 mx-auto h-8 bg-gradient-to-b from-[#6C63FF]/20 to-transparent blur-xl rounded-full -mt-2" />
        </motion.div>
      </div>
    </section>
  );
}
