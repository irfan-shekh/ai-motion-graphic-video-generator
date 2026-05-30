"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Zap,
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const features = [
  "Generate motion graphics from text in seconds",
  "Access 500+ professional templates",
  "4K export with commercial license",
  "Unlimited iterations and refinements",
];

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await authClient.signUp.email(
        {
          email: email.trim(),
          password,
          name,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Account created! Redirecting...");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            const errorMsg =
              ctx.error?.message || "Something went wrong. Please try again.";
            toast.error(errorMsg);
            setLoading(false);
          },
        }
      );
    } catch (err) {
      console.error("Signup process failed:", err);
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-background">
      <Toaster position="top-center" richColors theme="dark" />

      {/* Left panel — visual */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,212,255,0.15) 0%, rgba(108,99,255,0.15) 50%, transparent 80%)",
          }}
        />
        <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-[#00D4FF] rounded-full blur-[140px] opacity-15 animate-orb-drift" />
        <div className="absolute bottom-[10%] left-[10%] w-60 h-60 bg-[#6C63FF] rounded-full blur-[100px] opacity-20 animate-float" />

        {/* Logo */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.5)]">
              <Zap className="text-white fill-white" size={18} />
            </div>
          </div>
          <span className="text-lg font-bold text-white">
            Motion<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Content */}
        <div className="relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-2 badge-cyan px-4 py-2 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]" />
            </span>
            <span>Free account — no credit card</span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Everything you need
            <br />
            to create <span className="gradient-text">stunning</span>
            <br />
            motion content.
          </h2>

          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} className="text-[#a89fff]" />
                </div>
                <span className="text-white/60 text-sm leading-relaxed font-light">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#6C63FF", "#00D4FF", "#00E5A0", "#FF4D6D"].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#050816] flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                >
                  {["S", "A", "M", "K"][i]}
                </div>
              ))}
            </div>
            <div className="text-sm text-white/50 font-light">
              <span className="text-white font-semibold">50,000+</span> creators
              joined this month
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile logo */}
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
            <Zap className="text-white fill-white" size={16} />
          </div>
          <span className="text-base font-bold text-white">
            Motion<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-white/40 text-sm font-light">
              Start creating professional motion graphics for free.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name */}
            <div className="relative group">
              <User
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#6C63FF] transition-colors z-10"
              />
              <input
                type="text"
                required
                value={name}
                autoComplete="name"
                placeholder="Full name"
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full rounded-xl pl-11 pr-4 py-3.5 text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#6C63FF] transition-colors z-10"
              />
              <input
                type="email"
                required
                value={email}
                autoComplete="email"
                placeholder="Email address"
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
                value={password}
                autoComplete="new-password"
                placeholder="Create a password"
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

            {/* Password hint */}
            <p className="text-xs text-white/30 font-light px-1">
              Use at least 8 characters with a mix of letters and numbers.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Create free account
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-white/25 leading-relaxed font-light">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-white/40 hover:text-white/60 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-white/40 hover:text-white/60 underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#a89fff] hover:text-white font-medium transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
