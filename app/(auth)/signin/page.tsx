"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Zap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
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

    const { error: authError } = await authClient.signIn.email({
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

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-background">
      {/* Left panel — visual */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(108,99,255,0.2) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-[#6C63FF] rounded-full blur-[140px] opacity-20 animate-orb-drift" />
        <div className="absolute bottom-[10%] right-[10%] w-60 h-60 bg-[#00D4FF] rounded-full blur-[100px] opacity-15 animate-float-delayed" />

        {/* Logo */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.5)]">
              <Zap className="w-4.5 h-4.5 text-white fill-white" size={18} />
            </div>
          </div>
          <span className="text-lg font-bold text-white">
            Motion<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Feature highlights */}
        <div className="relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-2 badge-violet px-4 py-2 rounded-full mb-8">
            <Sparkles size={12} />
            <span>Trusted by 50,000+ creators</span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            The future of
            <br />
            <span className="gradient-text">motion design</span>
            <br />
            is here.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10 font-light">
            Generate broadcast-quality motion graphics from a single prompt.
            No keyframes. No timelines. Just results.
          </p>

          {/* Testimonial */}
          <div className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[#FFB347] text-sm">★</span>
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4 italic">
              &ldquo;MotionAI completely transformed our content pipeline. What used to take days now takes minutes.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Sarah Chen</p>
                <p className="text-white/40 text-xs">Creative Director, Hexagon Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile logo */}
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
            <Zap className="text-white fill-white" size={16} />
          </div>
          <span className="text-base font-bold text-white">
            Motion<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/40 text-sm font-light">
              Sign in to your account to continue creating.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#6C63FF] transition-colors z-10"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full rounded-xl pl-11 pr-4 py-3.5 text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#6C63FF] transition-colors z-10"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full rounded-xl pl-11 pr-12 py-3.5 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-xs text-white/40 hover:text-[#a89fff] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#a89fff] hover:text-white font-medium transition-colors"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}