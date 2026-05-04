"use client";

import { useState } from "react";
import { VideoPreview } from "@/components/VideoPreview";
import { Loader2, Wand2, Share2, Check, Download, LayoutDashboard, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";


export default function GenerateClient() {
  const [prompt, setPrompt] = useState("");
  const [videoCode, setVideoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState(10); // Default 10s
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
    } catch (error: any) {
      console.error(error);
      alert(`❌ Save & Share failed: ${error.message || "Unknown error"}`);
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!videoCode) return;
    setRendering(true);
    setDownloadProgress(0);
    try {
      // Progress simulation since server-side rendering doesn't provide stream progress yet
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
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setDownloadProgress(100);
      setShowDownloadSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Download failed: ${error.message}`);
    } finally {
      setRendering(false);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] relative">

      {/* Removed Screen Share Instructions Modal */}

      {/* Download Success Popup */}
      {showDownloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-10 right-10 z-[100] p-6 bg-[#020617]/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
            <Check size={24} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-1">Masterpiece Ready</h3>
            <p className="text-slate-400 text-[10px] mb-2">Your video has been rendered successfully.</p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`video-${Date.now()}.mp4`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                onClick={() => {
                  setTimeout(() => {
                    setDownloadUrl(null);
                    setShowDownloadSuccess(false);
                  }, 1000);
                }}
              >
                <Download size={12} /> Save to Device
              </a>
            )}
          </div>
          <button
            onClick={() => {
              setDownloadUrl(null);
              setShowDownloadSuccess(false);
            }}
            className="ml-4 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
      {/* Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"
      />

      {/* SIDEBAR WITH SCROLLBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-[420px] h-[50vh] lg:h-full shrink-0 bg-[#0f172a]/60 backdrop-blur-3xl border-b lg:border-b-0 lg:border-r border-white/10 p-6 lg:p-8 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:shadow-[20px_0_50px_rgba(0,0,0,0.5)] relative z-20 
                   overflow-y-auto overflow-x-hidden scrollbar-custom order-2 lg:order-1"
      >
        <Link href="/dashboard" className="mb-10 text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors shrink-0">
          <LayoutDashboard size={14} /> Back to Dashboard
        </Link>

        <div className="space-y-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Creative Directive</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
              <textarea
                className="relative w-full h-48 p-6 rounded-[2rem] border border-white/10 bg-[#020617]/80 backdrop-blur-xl text-white focus:border-blue-500 outline-none resize-none transition-colors shadow-inner"
                placeholder="Describe colors, motion, and style..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Duration</label>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{duration}s</span>
            </div>
            <div className="relative group px-1">
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase mt-2 px-1">
                <span>5s</span>
                <span>20s</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="space-y-3"
          >
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "16:9", label: "Cinema", icon: "📺" },
                { id: "9:16", label: "Shorts", icon: "📱" },
                { id: "1:1", label: "Social", icon: "⬛" },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${aspectRatio === ratio.id
                    ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                >
                  <span className="text-sm">{ratio.icon}</span>
                  {ratio.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid gap-4"
          >
            <motion.button
              whileHover={{ scale: prompt ? 1.02 : 1 }}
              whileTap={{ scale: prompt ? 0.98 : 1 }}
              onClick={handleGenerate}
              disabled={loading || rendering || !prompt}
              className="w-full relative overflow-hidden group bg-[#020617] border border-blue-500/30 text-white py-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 size={20} />}
                {loading ? "Processing..." : "Generate Animation"}
              </div>
            </motion.button>

            {videoCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-2 gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  disabled={sharing}
                  className={`py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 border transition-all ${shareUrl ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                >
                  {sharing ? <Loader2 className="animate-spin w-4 h-4" /> : copied ? <Check size={16} /> : <Share2 size={16} />}
                  {copied ? "Copied" : "Share & Save"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  disabled={rendering}
                  className="py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:opacity-50"
                >
                  {rendering ? <Loader2 className="animate-spin w-4 h-4" /> : <Download size={16} />}
                  {rendering ? "Rending MP4..." : "Download MP4"}
                </motion.button>
              </motion.div>
            )}

            {rendering && (
              <div className="space-y-2">
                <p className="text-[10px] text-blue-400/70 font-medium italic text-center animate-pulse">
                  Rendering your video... {downloadProgress > 0 ? `${downloadProgress}%` : 'Processing...'}
                </p>
                {downloadProgress > 0 && (
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-blue-500/10 backdrop-blur-md rounded-2xl border border-blue-500/30 break-all shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Portal URL</p>
              <code className="text-[11px] text-blue-300 font-mono select-all">{shareUrl}</code>
            </motion.div>
          )}

          {/* Buffer to ensure space at the bottom when scrolling */}
          <div className="h-4 shrink-0" />
        </div>
      </motion.aside>

      {/* PREVIEW SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center p-4 lg:p-16 relative z-10 overflow-hidden min-h-[50vh] lg:min-h-0 order-1 lg:order-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          className="relative group w-full max-w-5xl perspective-1000"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[3rem] blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative aspect-video bg-[#020617] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 will-change-transform"
          >
            <VideoPreview
              code={videoCode}
              duration={duration}
              aspectRatio={aspectRatio}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}