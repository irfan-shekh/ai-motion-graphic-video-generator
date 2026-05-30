"use client";

import { useState, useEffect } from "react";
import {
  Play,
  ArrowLeft,
  Trash2,
  Download,
  ExternalLink,
  Loader2,
  Search,
  Film,
  Plus,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { VideoPreview } from "@/components/VideoPreview";
import { Project } from "@prisma/client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

function AspectBadge({ ratio }: { ratio: string }) {
  const map: Record<string, { label: string; color: string }> = {
    "16:9": { label: "16:9", color: "rgba(108,99,255,0.15)" },
    "9:16": { label: "9:16", color: "rgba(0,212,255,0.12)" },
    "1:1":  { label: "1:1",  color: "rgba(0,229,160,0.12)" },
  };
  const { label, color } = map[ratio] ?? { label: ratio, color: "rgba(255,255,255,0.08)" };
  return (
    <span
      className="text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

export default function ArchivesClient() {
  const [animations, setAnimations] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loadingArchives, setLoadingArchives] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewAnim, setPreviewAnim] = useState<Project | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchArchives();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? animations.filter((a) => a.prompt.toLowerCase().includes(q))
        : animations
    );
  }, [search, animations]);

  const fetchArchives = async () => {
    try {
      const response = await fetch("/api/save-project");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setAnimations(list);
      setFiltered(list);
    } catch (error) {
      console.error("Archive Fetch Error:", error);
    } finally {
      setLoadingArchives(false);
    }
  };

  const handleDownload = async (anim: Project) => {
    try {
      setDownloadingId(anim.id);
      setPreviewAnim(anim);
      setDownloadProgress(0);

      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => (prev >= 95 ? prev : prev + 5));
      }, 2000);

      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoCode: anim.videoCode,
          duration: anim.duration,
          aspectRatio: anim.aspectRatio,
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        let errorMsg = "Render failed";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = `Server error (${res.status})`;
        }
        throw new Error(errorMsg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `motionai-${anim.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      setDownloadProgress(100);
    } catch (error: unknown) {
      console.error("Rendering error:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Download failed: ${msg}`);
    } finally {
      setDownloadingId(null);
      setPreviewAnim(null);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    try {
      setDeletingId(id);
      const response = await fetch(`/api/save-project?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      await fetchArchives();
    } catch (error: unknown) {
      console.error("Delete error:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Delete failed: ${msg}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 w-full overflow-y-auto text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
                  <Layers size={11} className="text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  Project Library
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">
                Your Archives
              </h1>
              {!loadingArchives && (
                <p className="text-sm text-white/40 mt-1 font-light">
                  {animations.length} {animations.length === 1 ? "project" : "projects"} saved
                </p>
              )}
            </div>

            <Link href="/dashboard/generate">
              <button className="btn-primary h-10 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0">
                <Plus size={15} />
                New Project
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ── Loading ── */}
        {loadingArchives && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#6C63FF]/20 border-t-[#6C63FF] animate-spin" />
            <p className="text-white/30 text-sm font-light">Loading your library...</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loadingArchives && animations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass rounded-2xl border border-white/8"
          >
            <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Film size={28} className="text-white/20" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No projects yet
            </h2>
            <p className="text-white/40 text-sm mb-8 font-light max-w-xs mx-auto leading-relaxed">
              Create your first AI motion graphic and it will appear here.
            </p>
            <Link href="/dashboard/generate">
              <button className="btn-primary h-10 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                <Plus size={15} />
                Create First Video
              </button>
            </Link>
          </motion.div>
        )}

        {/* ── Search + Grid ── */}
        {!loadingArchives && animations.length > 0 && (
          <>
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mb-7"
            >
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by prompt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full max-w-md rounded-xl pl-10 pr-4 py-2.5 text-sm"
              />
              {filtered.length !== animations.length && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </motion.div>

            {/* No search results */}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-white/30 text-sm">
                No projects match &ldquo;{search}&rdquo;
              </div>
            )}

            {/* Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filtered.map((anim) => (
                  <motion.article
                    key={anim.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    className="group glass rounded-2xl border border-white/8 hover:border-white/15 overflow-hidden transition-all duration-300 flex flex-col"
                  >
                    {/* Thumbnail / preview placeholder */}
                    <div
                      className={`relative bg-black/40 overflow-hidden flex items-center justify-center ${
                        anim.aspectRatio === "9:16"
                          ? "h-52"
                          : anim.aspectRatio === "1:1"
                          ? "aspect-square"
                          : "aspect-video"
                      }`}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/8 to-[#00D4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Play button */}
                      <button
                        onClick={() => setPreviewAnim(previewAnim?.id === anim.id ? null : anim)}
                        className="relative z-10 w-12 h-12 rounded-full glass border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#6C63FF]/20 hover:border-[#6C63FF]/40 transition-all duration-200"
                      >
                        <Play size={18} className="ml-0.5" />
                      </button>

                      {/* Aspect badge overlay */}
                      <div className="absolute top-2.5 left-2.5">
                        <AspectBadge ratio={anim.aspectRatio} />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col gap-4 flex-1">
                      {/* Prompt */}
                      <p className="text-sm text-white/70 line-clamp-2 leading-relaxed font-light flex-1">
                        &ldquo;{anim.prompt}&rdquo;
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[10px] text-white/30">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {anim.duration}s
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/15" />
                        <span>{anim.aspectRatio}</span>
                        {"createdAt" in anim && anim.createdAt && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/15" />
                            <span>
                              {new Date(anim.createdAt as string | number | Date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/share/${anim.id}`}
                          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl glass border border-white/8 hover:border-white/20 text-xs font-medium text-white/60 hover:text-white transition-all duration-200"
                        >
                          <ExternalLink size={12} />
                          View
                        </Link>

                        <button
                          onClick={() => handleDownload(anim)}
                          disabled={downloadingId !== null || deletingId !== null}
                          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl glass border border-[#6C63FF]/25 text-[#a89fff] hover:bg-[#6C63FF]/15 hover:border-[#6C63FF]/40 text-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {downloadingId === anim.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Download size={12} />
                          )}
                          {downloadingId === anim.id ? "Rendering" : "Save MP4"}
                        </button>

                        {/* Delete — confirm inline */}
                        {confirmDeleteId === anim.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(anim.id)}
                              disabled={deletingId === anim.id}
                              className="h-9 px-3 rounded-xl bg-[#FF4D6D]/20 border border-[#FF4D6D]/40 text-[#FF4D6D] text-xs font-semibold hover:bg-[#FF4D6D]/30 transition-all"
                            >
                              {deletingId === anim.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Yes"
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="h-9 px-3 rounded-xl glass border border-white/10 text-white/50 text-xs font-semibold hover:text-white transition-all"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(anim.id)}
                            disabled={downloadingId !== null || deletingId !== null}
                            className="w-9 h-9 flex items-center justify-center rounded-xl glass border border-white/8 text-white/30 hover:text-[#FF4D6D] hover:border-[#FF4D6D]/30 hover:bg-[#FF4D6D]/8 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* ── Render overlay (full-screen) ── */}
      <AnimatePresence>
        {previewAnim && downloadingId === previewAnim.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 gap-8"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(108,99,255,0.12), transparent 70%)",
              }}
            />

            {/* Preview */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${
                previewAnim.aspectRatio === "9:16"
                  ? "max-h-[55vh] aspect-[9/16] mx-auto"
                  : "aspect-video"
              }`}
            >
              <VideoPreview
                code={previewAnim.videoCode}
                duration={previewAnim.duration}
                aspectRatio={previewAnim.aspectRatio}
              />
            </motion.div>

            {/* Progress */}
            <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm w-full text-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#6C63FF]/20 border-t-[#6C63FF] animate-spin shrink-0" />
                <div className="text-left">
                  <p className="text-base font-semibold text-white">Rendering MP4</p>
                  <p className="text-xs text-white/40 font-light">
                    Processing on server — this may take a moment
                  </p>
                </div>
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Progress</span>
                  <span className="text-[#6C63FF] font-semibold">
                    {downloadProgress > 0 ? `${downloadProgress}%` : "Starting..."}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #6C63FF, #00D4FF)" }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Inline video preview modal (when not downloading) ── */}
      <AnimatePresence>
        {previewAnim && downloadingId !== previewAnim.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewAnim(null)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${
                previewAnim.aspectRatio === "9:16"
                  ? "max-h-[80vh] aspect-[9/16] mx-auto"
                  : "aspect-video"
              }`}
            >
              <VideoPreview
                code={previewAnim.videoCode}
                duration={previewAnim.duration}
                aspectRatio={previewAnim.aspectRatio}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
