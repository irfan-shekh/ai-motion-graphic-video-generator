"use client";

import { motion, Variants } from "framer-motion";
import {
  Zap,
  Shield,
  Cpu,
  Layout,
  MessageSquare,
  Repeat,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: <Zap size={22} />,
    label: "Speed",
    title: "Instant Generation",
    description:
      "Go from text prompt to broadcast-quality motion graphics in under 60 seconds. No waiting, no queue.",
    color: "from-[#6C63FF] to-[#8B83FF]",
    glow: "rgba(108,99,255,0.35)",
    badge: "60s avg",
  },
  {
    icon: <Cpu size={22} />,
    label: "Intelligence",
    title: "Neural Precision",
    description:
      "Advanced neural networks handle timing, easing, and composition automatically with professional results.",
    color: "from-[#00D4FF] to-[#00A8CC]",
    glow: "rgba(0,212,255,0.35)",
    badge: "GPT-4o powered",
  },
  {
    icon: <Layout size={22} />,
    label: "Templates",
    title: "500+ Templates",
    description:
      "Access a vast library of professionally designed starting points built for every industry.",
    color: "from-[#00E5A0] to-[#00B880]",
    glow: "rgba(0,229,160,0.35)",
    badge: "500+ styles",
  },
  {
    icon: <MessageSquare size={22} />,
    label: "Simplicity",
    title: "Plain Language",
    description:
      "Just describe your vision in natural language. Our AI decodes intent and produces stunning results.",
    color: "from-[#FFB347] to-[#FF8C00]",
    glow: "rgba(255,179,71,0.35)",
    badge: "No code needed",
  },
  {
    icon: <Repeat size={22} />,
    label: "Iteration",
    title: "Infinite Iterations",
    description:
      "Tweak and refine your videos in real-time. AI preserves your style while adapting to every change.",
    color: "from-[#FF4D6D] to-[#CC2B4F]",
    glow: "rgba(255,77,109,0.35)",
    badge: "Real-time",
  },
  {
    icon: <Shield size={22} />,
    label: "Enterprise",
    title: "Enterprise Ready",
    description:
      "4K exports, commercial licenses, and team collaboration tools — built for professional workflows.",
    color: "from-[#a78bfa] to-[#7c3aed]",
    glow: "rgba(167,139,250,0.35)",
    badge: "SOC 2 Type II",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(108,99,255,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 badge-violet px-4 py-2 rounded-full mb-6"
          >
            <Zap size={12} className="text-[#a89fff]" />
            <span>Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Every tool a
            <br />
            <span className="gradient-text">motion designer</span> needs.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-white/50 leading-relaxed font-light"
          >
            Stop spending hours in complex tools. Let AI handle the heavy
            lifting while you focus on creative vision.
          </motion.p>
        </div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
            >
              <div
                className="relative glass rounded-2xl p-6 h-full border border-white/8 hover:border-white/15 transition-all duration-500 overflow-hidden cursor-default"
                style={{
                  transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08), 0 0 40px ${feature.glow}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Background gradient reveal on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 80% at 0% 0%, ${feature.glow}15, transparent 70%)`,
                  }}
                />

                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${feature.glow}40, ${feature.glow}20)`,
                      border: `1px solid ${feature.glow}40`,
                      boxShadow: `0 0 20px ${feature.glow}25`,
                    }}
                  >
                    <span
                      style={{
                        background: `linear-gradient(135deg, ${feature.color.split(" ")[1]} , ${feature.color.split(" ")[3]})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {feature.icon}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: `${feature.glow}15`,
                      border: `1px solid ${feature.glow}30`,
                      color: feature.glow.replace("rgba(", "rgb(").replace(/,[^,]+\)$/, ")"),
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Text content */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">
                    {feature.label}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>

                {/* Learn more link */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                  <span
                    style={{
                      background: `linear-gradient(90deg, ${feature.glow.replace("rgba(", "rgb(").replace(/,[^,]+\)$/, ")")}, ${feature.glow.replace("rgba(", "rgb(").replace(/,[^,]+\)$/, ")")})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Learn more
                  </span>
                  <ArrowRight size={11} style={{ color: feature.glow.replace("rgba(", "rgb(").replace(/,[^,]+\)$/, ")") }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
