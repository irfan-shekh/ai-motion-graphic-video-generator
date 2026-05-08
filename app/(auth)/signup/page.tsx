"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Play, Sparkles, User, Mail, Lock } from "lucide-react";
import { Toaster, toast } from "sonner"; // Modern notifications

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Prevent hydration issues
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Client-side validation
        if (!email || !password || !name) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            await authClient.signUp.email({
                email: email.trim(), // Trim spaces
                password,
                name,
                callbackURL: "/dashboard",
            }, {
                onRequest: () => {
                    console.log("Connecting to Better Auth...");
                },
                onSuccess: () => {
                    toast.success("Account created! Redirecting...");
                    router.push("/dashboard");
                    // Note: If email verification is required, you'd redirect to a "Verify Email" page instead.
                },
                onError: (ctx) => {
                    const errorMsg = ctx.error?.message || "Something went wrong. Check database connection.";
                    toast.error(errorMsg);
                    setLoading(false);
                },
            });
        } catch (err) {
            console.error("Signup process failed:", err);
            toast.error("Network error. Please ensure your server is running.");
            setLoading(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden selection:bg-purple-500/30">
            {/* Toast Provider for notifications */}
            <Toaster position="top-center" richColors theme="dark" />

            {/* 3D AMBIENT BACKGROUND */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/15 blur-[140px] rounded-full animate-pulse delay-700" />
            </div>

            {/* LOGO */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/40">
                    <Play className="text-white w-5 h-5 fill-current" />
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white">
                    Motion<span className="text-purple-500">.AI</span>
                </h1>
            </div>

            <div className="relative w-full max-w-md group">
                {/* FLOATING DECORATION */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />

                {/* 3D GLASS CARD */}
                <div className="relative bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1 rounded-full mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Early Access</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight">Create Account</h2>
                        <p className="mt-2 text-slate-400 font-medium italic">Join the next generation of creators</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSignUp}>
                        {/* NAME INPUT */}
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                required
                                value={name}
                                autoComplete="name"
                                className="block w-full rounded-2xl border border-white/5 bg-slate-950/50 px-12 py-4 text-white placeholder-slate-500 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                placeholder="Your Name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* EMAIL INPUT */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                autoComplete="email"
                                className="block w-full rounded-2xl border border-white/5 bg-slate-950/50 px-12 py-4 text-white placeholder-slate-500 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* PASSWORD INPUT */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                autoComplete="new-password"
                                className="block w-full rounded-2xl border border-white/5 bg-slate-950/50 px-12 py-4 text-white placeholder-slate-500 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                placeholder="Choose Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    "Create Account"
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400 text-sm font-medium">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
