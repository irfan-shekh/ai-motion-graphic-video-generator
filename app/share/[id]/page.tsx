"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { VideoPreview } from "@/components/VideoPreview";
import { Play, Sparkles, ArrowLeft, Download, Loader2 } from "lucide-react";


export default function SharePage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/get-project?id=${id}`);
        const data = await res.json();
        setProject(data);
      } catch (e) {
        console.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  const handleDownload = async () => {
    if (!project) return;
    try {
      setRecording(true);
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
          videoCode: project.videoCode,
          duration: project.duration,
          aspectRatio: project.aspectRatio
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
      a.download = `video-${project.id}-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setDownloadProgress(100);
      alert("✅ Video downloaded successfully!");
    } catch (error: any) {
      console.error(error);
      alert(`❌ Download failed: ${error.message}`);
    } finally {
      setRecording(false);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading Video...</div>;
  if (!project) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Project not found.</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex flex-col items-center justify-center relative">
      {/* Back Button */}
      <Link
        href="/dashboard/archives"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Archive</span>
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
          <Play className="text-white w-5 h-5 fill-current" />
        </div>
        <h1 className="text-2xl font-black italic tracking-tighter text-white">Motion<span className="text-blue-500">AI</span></h1>
      </div>

      <div className={`w-full max-w-5xl bg-black rounded-[40px] shadow-2xl overflow-hidden ring-8 ring-white/5 border border-white/10 relative group ${project.aspectRatio === "9:16" ? "aspect-[9/16] h-[70vh] mx-auto" : project.aspectRatio === "1:1" ? "aspect-square" : "aspect-video"
        }`}>
        <div className="absolute -inset-4 bg-blue-600/20 blur-3xl opacity-50 pointer-events-none" />
        <VideoPreview code={project.videoCode} duration={project.duration} aspectRatio={project.aspectRatio} />
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={recording}
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-wait text-white rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-[0_10px_30px_rgba(59,130,246,0.4)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.5)] hover:-translate-y-1"
        >
          {recording ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {recording ? "Rendering MP4..." : "Download MP4"}
        </button>

        {recording && (
          <div className="w-full max-w-md space-y-2">
            <p className="text-[11px] text-blue-400/70 font-medium italic animate-pulse text-center">
              Processing your high-quality MP4 on our engine... {downloadProgress > 0 ? `${downloadProgress}%` : ''}
            </p>
            {downloadProgress > 0 && (
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        <p className="text-slate-400 text-sm font-bold tracking-[0.2em] uppercase italic bg-slate-900/50 px-6 py-2 rounded-full border border-white/5 inline-flex items-center gap-2">
          <Sparkles size={14} className="text-blue-400" />
          Prompt: {project.prompt}
        </p>
      </div>
    </div>
  );
}
