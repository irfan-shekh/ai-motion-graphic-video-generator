"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center pt-40 md:pt-40 lg:pt-30 pb-24 overflow-hidden bg-[#0f172a]">
      {/* Dynamic Background Glows matching Dashboard */}
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

      <div className="container px-6 mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-5 py-2 rounded-full mb-10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase tracking-[0.2em]">Next Gen Creation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl"
        >
          Transform Ideas into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Stunning Motion.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          Generate professional-grade AI motion graphics instantly.
          The future of video creation is in your hands.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
        >
          <Link href="/dashboard/generate" className="w-full sm:w-auto">
            <Button size="lg" className="h-16 px-10 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.5)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.7)] transition-all duration-300">
              Launch Creator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white/10 bg-white/5 backdrop-blur-md text-white font-bold hover:bg-white/10 rounded-2xl">
            <Link href="/dashboard" className="flex items-center w-full">
              <span>Dashboard</span>
            </Link>
          </Button>
        </motion.div>

        {/* Hero Image / Video Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] p-1 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 shadow-2xl overflow-hidden"
        >
          <div className="bg-[#0f172a]/90 rounded-[2.4rem] overflow-hidden p-2">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10" />
            <Image
              src="/hero.png"
              alt="AI Video Generation Interface"
              width={1200}
              height={675}
              className="rounded-[2.2rem] w-full h-auto object-cover opacity-80"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
