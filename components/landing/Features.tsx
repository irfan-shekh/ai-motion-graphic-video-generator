"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Layout, MessageSquare, Repeat } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Generation",
    description: "Go from text prompt to high-quality motion graphics in under 60 seconds."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Precision",
    description: "Our advanced neural networks handle timing, easing, and layout automatically."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Template Library",
    description: "Access hundreds of professionally designed starting points for any niche."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Natural Language",
    description: "Just describe what you want in plain English. No complex keyframes needed."
  },
  {
    icon: <Repeat className="w-6 h-6" />,
    title: "Infinite Iterations",
    description: "Tweak and refine your videos instantly with real-time AI adjustments."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Grade",
    description: "High-resolution exports and commercial usage rights included on all plans."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#0f172a] relative overflow-hidden">
      <div className="container px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Everything you need for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Professional Motion.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium">
            Stop spending hours in complex software. Let our AI handle the technical 
            heavy lifting while you focus on the creative vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent rounded-[2.5rem] group hover:from-blue-500/50 hover:via-purple-500/50 transition-all duration-500"
            >
              <div className="bg-[#0f172a]/90 backdrop-blur-xl p-10 rounded-[2.4rem] h-full flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-20 h-20 rounded-[1.5rem] bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 z-10">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed z-10">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
