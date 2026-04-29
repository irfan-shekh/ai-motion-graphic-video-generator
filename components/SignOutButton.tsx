"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function SignOutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                    },
                },
            });
        } catch (error) {
            console.error("Sign out failed", error);
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50"
        >
            {/* TEXT & ICON */}
            <span className="relative z-10 text-xs font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-red-400 transition-colors flex items-center gap-2">
                {isLoggingOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                )}
                {isLoggingOut ? "Leaving..." : "Sign Out"}
            </span>

            {/* SUBTLE 3D INNER SHADOW/GLOSS */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}