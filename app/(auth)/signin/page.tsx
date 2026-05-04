"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Play, Sparkles, Lock, Mail, ArrowRight } from "lucide-react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Prevent hydration mismatch and check for existing session
    useEffect(() => {
        setMounted(true);
        const checkSession = async () => {
            const { data: session } = await authClient.getSession();
            if (session) {
                router.push("/dashboard");
            }
        };
        checkSession();
    }, [router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { data, error: authError } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
        });

        if (authError) {
            setError(authError.message || "Invalid email or password");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden selection:bg-blue-500/30">
            {/* 3D AMBIENT BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            {/* LOGO POSITIONED TOP LEFT */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                    <Play className="text-white w-5 h-5 fill-current" />
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white">
                    Motion<span className="text-blue-500">.AI</span>
                </h1>
            </div>

            {/* 3D GLASS CARD */}
            <div className="relative w-full max-w-md group">
                {/* BACKGLOW */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Secure Access</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight">Welcome Back</h2>
                        <p className="mt-2 text-slate-400 font-medium italic">Enter the creative dimension</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignIn}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* EMAIL INPUT */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-2xl border border-white/5 bg-slate-950/50 px-12 py-4 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
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
                                    className="block w-full rounded-2xl border border-white/5 bg-slate-950/50 px-12 py-4 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-bold underline-offset-4 hover:underline transition-colors">
                                Join the Collective
                            </Link>
                        </p>
                    </div>
                </div>

                {/* DECORATIVE 3D ELEMENT (OPTIONAL) */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl -z-10 rotate-12 opacity-20 blur-xl group-hover:rotate-45 transition-transform duration-1000"></div>
            </div>
        </div>
    );
}