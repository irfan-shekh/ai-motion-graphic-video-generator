"use client";

import React, { useState, useEffect } from "react";
import { VideoPreview } from "@/components/VideoPreview";
import {
  Loader2,
  Wand2,
  Share2,
  Check,
  Download,
  ArrowLeft,
  X,
  Sparkles,
  Clock,
  Monitor,
  Smartphone,
  Square,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ASPECT_RATIOS = [
  { id: "16:9", label: "Widescreen", sub: "16:9", icon: Monitor, desc: "YouTube, Presentations" },
  { id: "9:16", label: "Vertical",   sub: "9:16",  icon: Smartphone, desc: "Reels, TikTok, Shorts" },
  { id: "1:1",  label: "Square",     sub: "1:1",   icon: Square, desc: "Instagram, Twitter" },
];

const EXAMPLE_PROMPTS = [
  "A glowing orb of energy expanding outward with electric blue light trails",
  "Abstract geometric shapes morphing into a corporate logo reveal",
  "Particles flowing like a river of stars in deep space",
  "Bold text animation with neon glitch effects on dark background",
];

export default function GenerateClient() {
  const [prompt, setPrompt] = useState("");
  const [videoCode, setVideoCode] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const promptParam = params.get("prompt");
      if (promptParam) {
        setPrompt(promptParam);
      }
    }
  }, []);
  const [sharing, setSharing] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState(10);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setVideoCode("");
    setShareUrl("");
    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, duration, aspectVideo: aspectRatio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.videoCode) setVideoCode(data.videoCode);
      if (data.duration) setDuration(data.duration);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!videoCode) return;
    setSharing(true);
    try {
      const res = await fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCode, prompt, duration, aspectRatio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      const generatedUrl = `${window.location.origin}/share/${data.id}`;
      setShareUrl(generatedUrl);
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Save & Share failed: ${errorMessage}`);
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!videoCode) return;
    setRendering(true);
    setDownloadProgress(0);
    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + 5;
        });
      }, 2000);

      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCode, duration, aspectRatio }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        let errorMsg = "Render failed";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = `Server error (${res.status}): ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = `motionai-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setDownloadProgress(100);
      setShowDownloadSuccess(true);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Download failed: ${errorMessage}`);
    } finally {
      setRendering(false);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  const selectedRatio = ASPECT_RATIOS.find((r) => r.id === aspectRatio)!;

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

      {/* ── Download success toast ── */}
      <AnimatePresence>
        {showDownloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[100] glass-strong rounded-2xl border border-[#00E5A0]/30 p-5 flex items-center gap-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00E5A0]/15 border border-[#00E5A0]/30 flex items-center justify-center shrink-0">
              <Check size={18} className="text-[#00E5A0]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Video ready!</p>
              <p className="text-xs text-white/50 mt-0.5">Your MP4 has been downloaded.</p>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`motionai-${Date.now()}.mp4`}
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#00E5A0] hover:text-white transition-colors"
                  onClick={() => { setTimeout(() => { setDownloadUrl(null); setShowDownloadSuccess(false); }, 500); }}
                >
                  <Download size={11} /> Download again
                </a>
              )}
            </div>
            <button
              onClick={() => { setDownloadUrl(null); setShowDownloadSuccess(false); }}
              className="ml-2 w-7 h-7 rounded-lg glass flex items-center justify-center text-white/30 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT SIDEBAR ── */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-[380px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/6 bg-black/20 backdrop-blur-sm overflow-y-auto order-2 lg:order-1"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="p-6 flex flex-col gap-6 flex-1">

          {/* Back link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors w-fit group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
                <Wand2 size={11} className="text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                AI Creator
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight">
              New Project
            </h1>
          </div>

          {/* ── Prompt ── */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={11} className="text-[#6C63FF]" />
              Describe your vision
            </label>
            <div className="relative">
              <textarea
                className="input-field w-full h-36 p-4 rounded-xl text-sm resize-none leading-relaxed"
                placeholder="A cinematic reveal of a glowing logo with particle effects and dynamic light sweeps..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-white/20 font-mono">
                {prompt.length}/500
              </div>
            </div>

            {/* Example prompts */}
            {!prompt && (
              <div className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                  Try an example
                </p>
                {EXAMPLE_PROMPTS.slice(0, 2).map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="w-full text-left text-xs text-white/40 hover:text-white/70 py-2 px-3 rounded-lg glass hover:bg-white/6 border border-transparent hover:border-white/8 transition-all duration-200 leading-relaxed flex items-start gap-2 group"
                  >
                    <ChevronRight size={11} className="text-[#6C63FF] shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Duration ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                <Clock size={11} className="text-[#00D4FF]" />
                Duration
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{duration}</span>
                <span className="text-xs text-white/40">sec</span>
              </div>
            </div>
            <div className="px-1">
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6C63FF ${((duration - 5) / 15) * 100}%, var(--border-medium) ${((duration - 5) / 15) * 100}%)`,
                  accentColor: "#6C63FF",
                }}
              />
              <div className="flex justify-between text-[10px] text-white/25 mt-2">
                <span>5s</span>
                <span>12s</span>
                <span>20s</span>
              </div>
            </div>
          </div>

          {/* ── Aspect ratio ── */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Monitor size={11} className="text-[#00E5A0]" />
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map((ratio) => {
                const Icon = ratio.icon;
                const active = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 ${
                      active
                        ? "bg-[#6C63FF]/15 border-[#6C63FF]/50 text-white shadow-[0_0_16px_rgba(108,99,255,0.2)]"
                        : "glass border-white/8 text-white/40 hover:text-white/70 hover:border-white/15"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-[#6C63FF]" : ""} />
                    <span className="text-[10px] font-semibold leading-none">{ratio.label}</span>
                    <span className="text-[9px] text-white/30 leading-none">{ratio.sub}</span>
                  </button>
                );
              })}
            </div>
            {selectedRatio && (
              <p className="text-[11px] text-white/30 font-light">
                Best for: {selectedRatio.desc}
              </p>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="space-y-3 mt-auto">
            <button
              onClick={handleGenerate}
              disabled={loading || rendering || !prompt}
              className="btn-primary w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Generate Animation
                </>
              )}
            </button>

            <AnimatePresence>
              {videoCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-2.5"
                >
                  <button
                    onClick={handleShare}
                    disabled={sharing}
                    className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all duration-200 ${
                      shareUrl
                        ? "bg-[#00E5A0]/15 border-[#00E5A0]/40 text-[#00E5A0]"
                        : "glass border-white/10 text-white/70 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {sharing ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : copied ? (
                      <Check size={14} />
                    ) : (
                      <Share2 size={14} />
                    )}
                    {copied ? "Copied!" : "Save & Share"}
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={rendering}
                    className="h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 glass border border-[#6C63FF]/30 text-[#a89fff] hover:bg-[#6C63FF]/15 hover:border-[#6C63FF]/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {rendering ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Download size={14} />
                    )}
                    {rendering ? "Rendering..." : "Download MP4"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Render progress */}
            <AnimatePresence>
              {rendering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/40 animate-pulse">Rendering MP4...</span>
                    <span className="text-[#6C63FF] font-semibold">
                      {downloadProgress > 0 ? `${downloadProgress}%` : "Processing"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #6C63FF, #00D4FF)" }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Share URL */}
            <AnimatePresence>
              {shareUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 glass rounded-xl border border-[#00E5A0]/20"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00E5A0] mb-1.5">
                    Share link copied ✓
                  </p>
                  <code className="text-[11px] text-white/50 font-mono break-all leading-relaxed">
                    {shareUrl}
                  </code>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ── PREVIEW PANEL ── */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-[50vh] lg:min-h-0 order-1 lg:order-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl"
        >
          {/* Preview label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] shadow-[0_0_6px_rgba(0,229,160,0.8)]" />
              <span className="text-xs font-medium text-white/40">
                {videoCode ? "Live preview" : "Preview"}
              </span>
            </div>
            {videoCode && (
              <span className="badge-violet px-2.5 py-1 rounded-full text-[10px]">
                {selectedRatio.sub} · {duration}s
              </span>
            )}
          </div>

          {/* Preview frame */}
          <div className="relative group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#6C63FF]/30 via-[#00D4FF]/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
            <div className={`relative bg-black/60 rounded-2xl overflow-hidden border border-white/8 shadow-[0_32px_64px_rgba(0,0,0,0.5)] transition-all duration-300 ${
              aspectRatio === "9:16" ? "aspect-[9/16] max-h-[70vh] mx-auto" :
              aspectRatio === "1:1" ? "aspect-square max-h-[70vh] mx-auto" :
              "aspect-video w-full"
            }`}>
              {!videoCode && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
                  <div className="w-16 h-16 rounded-2xl glass border border-white/8 flex items-center justify-center">
                    <Wand2 size={24} className="text-white/20" />
                  </div>
                  <div>
                    <p className="text-white/30 text-sm font-medium mb-1">
                      Your animation will appear here
                    </p>
                    <p className="text-white/20 text-xs font-light">
                      Write a prompt and hit Generate
                    </p>
                  </div>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-[#6C63FF]/20 border-t-[#6C63FF] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={16} className="text-[#6C63FF]" />
                    </div>
                  </div>
                  <p className="text-white/40 text-sm animate-pulse">Generating animation...</p>
                </div>
              )}
              <VideoPreview code={videoCode} duration={duration} aspectRatio={aspectRatio} />
            </div>
          </div>

          {/* Hint text below */}
          {!videoCode && !loading && (
            <p className="text-center text-xs text-white/20 mt-4 font-light">
              Tip: Be specific about colors, movement speed, and style for best results.
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
}