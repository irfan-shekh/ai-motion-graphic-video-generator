"use client";

import { useState, useEffect } from "react";
import { Video, History, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const TiltCard = ({ children, disabled = false, href }: { children: React.ReactNode, disabled?: boolean, href: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const CardWrapper = disabled ? 'div' : Link;

  return (
    <motion.div
      style={{
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-[2.5rem] transition-all duration-300 ${disabled ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"
        }`}
    >
      <CardWrapper href={disabled ? "#" : href} className="block h-full">
        {children}
      </CardWrapper>
    </motion.div>
  );
};

export default function DashboardClient() {
  const [animationsCount, setAnimationsCount] = useState(0);
  const [loadingArchives, setLoadingArchives] = useState(true);

  useEffect(() => {
    fetchArchivesCount();
  }, []);

  const fetchArchivesCount = async () => {
    try {
      const response = await fetch("/api/save-project");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAnimationsCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Archive Fetch Error:", error);
    } finally {
      setLoadingArchives(false);
    }
  };

  return (
    <main className="relative z-10 flex-1 w-full min-h-full flex flex-col items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      {/* Dynamic Background Glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-5 py-2 rounded-full mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase tracking-[0.2em]">Next Gen Creation</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-4 drop-shadow-2xl"
          >
            Design in <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Dimension.</span>
          </motion.h2>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          style={{ perspective: 1000 }}
        >
          {/* Create Project Card */}
          <TiltCard href="/dashboard/generate">
            <div className="relative p-1 bg-gradient-to-br from-blue-500/50 via-indigo-500/50 to-purple-600/50 rounded-[2.5rem] h-full shadow-[0_20px_50px_rgba(59,130,246,0.2)] group hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] transition-all duration-500" style={{ transform: "translateZ(30px)" }}>
              <div className="bg-[#0f172a]/90 backdrop-blur-xl p-8 rounded-[2.4rem] h-full flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 z-10"
                >
                  <Video size={32} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-4 z-10">Launch Creator</h3>
                <p className="text-slate-400 mb-6 font-medium z-10">Generate AI motion graphics instantly.</p>
                <div className="w-full mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_rgba(59,130,246,0.5)] group-hover:shadow-[0_10px_40px_rgba(59,130,246,0.7)] transform group-hover:-translate-y-1 transition-all duration-300 z-10">
                  New Project
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Archives Card */}
          <TiltCard href="/dashboard/archives" disabled={animationsCount === 0 && !loadingArchives}>
            <div className="relative p-1 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-[2.5rem] h-full shadow-[0_20px_50px_rgba(99,102,241,0.1)] group hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] transition-all duration-500" style={{ transform: "translateZ(30px)" }}>
              <div className="bg-[#0f172a]/90 backdrop-blur-xl p-8 rounded-[2.4rem] h-full flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)] group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 z-10"
                >
                  <History size={32} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-4 z-10">Archives</h3>
                <p className="text-slate-400 mb-6 font-medium z-10">Access your {animationsCount} saved masterpieces.</p>
                <div className="w-full mt-auto bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg group-hover:bg-indigo-600 transition-colors duration-300 z-10">
                  {loadingArchives ? "Loading..." : animationsCount > 0 ? "Enter Library" : "Library Empty"}
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </main>
  );
}