"use client";

import { useState, useEffect } from "react";
import { Play, ArrowLeft, Trash2, Download, Eye } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { VideoPreview } from "@/components/VideoPreview";


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ArchivesClient() {
  const [animations, setAnimations] = useState<any[]>([]);
  const [loadingArchives, setLoadingArchives] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recordingAnim, setRecordingAnim] = useState<any | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const response = await fetch("/api/save-project");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAnimations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Archive Fetch Error:", error);
    } finally {
      setLoadingArchives(false);
    }
  };

  const handleDownloadArchive = async (anim: any) => {
    try {
      setDownloadingId(anim.id);
      setRecordingAnim(anim);
      setDownloadProgress(0);

      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + 5;
        });
      }, 2000);

      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoCode: anim.videoCode,
          duration: anim.duration,
          aspectRatio: anim.aspectRatio
        }),
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
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${anim.id}-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setDownloadProgress(100);
      alert("✅ Video downloaded successfully!");
    } catch (error: any) {
      console.error("Rendering error:", error);
      alert(`❌ Download failed: ${error.message}`);
    } finally {
      setDownloadingId(null);
      setRecordingAnim(null);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  const handleDeleteArchive = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      setDeletingId(id);
      const response = await fetch(`/api/save-project?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await fetchArchives();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white p-4 md:p-8 relative">
      {/* Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative z-10 pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-400 mb-8 hover:text-white transition-colors uppercase font-black text-xs tracking-[0.2em] w-fit group border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 rounded-full hover:bg-indigo-500/20">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </Link>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-10 tracking-tighter"
        >
          YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">LIBRARY</span>
        </motion.h2>

        {loadingArchives ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6" />
            <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Initializing Vault...</p>
          </div>
        ) : animations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[#020617]/50 border border-white/5 rounded-[2.4rem] backdrop-blur-xl"
          >
            <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Play size={32} />
            </div>
            <p className="text-2xl font-black text-white mb-4">No masterpieces yet.</p>
            <p className="text-slate-400 mb-6 font-medium">It's time to bring your ideas to life.</p>
            <Link href="/dashboard/generate" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
              Create First Video
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {animations.map((anim, idx) => (
                <motion.div
                  key={anim.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 hover:border-indigo-500/50 transition-colors group shadow-xl"
                >
                  <div className={`bg-gradient-to-br from-slate-900 to-black rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative shadow-inner ${anim.aspectRatio === "9:16" ? "aspect-[9/16] h-48 mx-auto" : anim.aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
                    }`}>
                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md text-white/50 group-hover:text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all z-10"
                    >
                      <Play className="ml-1" size={24} />
                    </motion.div>
                  </div>

                  <div className="mb-6 h-12 flex items-center">
                    <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed">"{anim.prompt}"</p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/share/${anim.id}`} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-colors text-white border border-white/5">
                      <Eye size={14} /> View
                    </Link>
                    <button
                      onClick={() => handleDownloadArchive(anim)}
                      disabled={downloadingId !== null || deletingId !== null}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 hover:border-indigo-500 disabled:opacity-50 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all"
                    >
                      {downloadingId === anim.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={14} />}
                      {downloadingId === anim.id ? "Rendering..." : "Save"}
                    </button>
                    <button
                      onClick={() => handleDeleteArchive(anim.id)}
                      disabled={downloadingId !== null || deletingId !== null}
                      className="flex-[0.5] flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 disabled:opacity-50 py-3 rounded-xl transition-colors"
                    >
                      {deletingId === anim.id ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {recordingAnim && (
          <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full max-w-4xl bg-black rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative border border-white/10 ring-1 ring-white/20 mb-12 ${recordingAnim.aspectRatio === "9:16" ? "max-h-[60vh] aspect-[9/16]" : "aspect-video"
                }`}
            >
              <VideoPreview
                code={recordingAnim.videoCode}
                duration={recordingAnim.duration}
                aspectRatio={recordingAnim.aspectRatio}
              />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div className="text-left">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">RENDERING <span className="text-indigo-400">MP4</span></h3>
                  <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.3em]">Processing on Server</p>
                </div>
              </div>

              <p className="text-slate-400 font-medium text-sm leading-relaxed mb-4">
                We are rendering your video on our high-performance engine for maximum quality.
                This may take a few moments depending on complexity.
              </p>

              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] text-indigo-400/70 font-medium italic animate-pulse w-full text-center">
                    Rendering your video... {downloadProgress > 0 ? `${downloadProgress}%` : 'Processing...'}
                  </p>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
