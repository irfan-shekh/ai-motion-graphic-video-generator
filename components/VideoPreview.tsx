"use client";
import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import * as Babel from "@babel/standalone";
import * as Remotion from "remotion";
import { 
  Monitor, Cpu, Cloud, Shield, Zap, Settings, Mail, Lock, User, Star, Heart, Globe, Search, Bell, Check, X, ArrowRight, Video, Database, Music, Activity,
  Play, Pause, FastForward, Rewind, Layers, Layout, MousePointer, Smartphone, Tablet, Laptop, Tv, Camera, Image, Gift, ShoppingCart, CreditCard, Wallet, 
  Home, MapPin, Navigation, Compass, Sunrise, Sunset, Moon, Sun, Wind, Droplets, Flame, Leaf, Coffee, Pizza, Bike, Car, Plane, Anchor,
  BarChart, PieChart, TrendingUp, Briefcase, Rocket, Sparkles, Wand2, Lightbulb, PenTool, Hash, Info, AlertCircle, AlertTriangle, HelpCircle
} from "lucide-react";

const VideoPreviewBase = ({ 
  code, 
  duration = 10, 
  aspectRatio = "16:9" 
}: { 
  code: string, 
  duration?: number,
  aspectRatio?: string
}) => {
  const [isTranspiling, setIsTranspiling] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setComponent(null);
      setError(null);
      return;
    }

    setIsTranspiling(true);
    setError(null);

    try {
      // 🔹 1. Clean AI code (VERY IMPORTANT)
      const cleanCode = code
        .replace(/^import\s+.*$/gm, "")
        .replace(/export\s+default\s+/g, "")
        .replace(/```[a-z]*\n/g, "")
        .replace(/```/g, "")
        .trim();

      // 🔹 2. Transpile JSX → JS
      const transpiled = Babel.transform(cleanCode, {
        presets: ["env", "react", "typescript"],
        filename: "composition.tsx", // Required for the typescript preset to trigger
      }).code;

      // 🔹 3. Extract ONLY allowed Remotion functions (safe)
      const {
        AbsoluteFill,
        useCurrentFrame,
        useVideoConfig,
        spring,
        interpolate,
        interpolateColors,
        Easing,
        Img,
        Sequence,
        Audio,
        Video: RemotionVideo,
        OffthreadVideo,
        staticFile,
        Series,
        Loop,
        random,
        delayRender,
        continueRender,
      } = Remotion;

      // Make Math & Array available for particle / SVG generative code
      const _Math = Math;
      const _Array = Array;

      // 🔹 4. Create component dynamically
      const createComponent = new Function(
        "React",
        "AbsoluteFill",
        "useCurrentFrame",
        "useVideoConfig",
        "spring",
        "interpolate",
        "interpolateColors",
        "Easing",
        "Img",
        "Sequence",
        "Audio",
        "Video",
        "OffthreadVideo",
        "staticFile",
        "Series",
        "Loop",
        "random",
        "delayRender",
        "continueRender",
        // Math / Array for particle / generative effects
        "Math",
        "Array",
        // Icons
        "Cloud", "Shield", "Zap", "Settings", "Mail", "Lock", "User", "Star", "Heart", "Globe", "Search", "Bell", "Check", "X", "ArrowRight", "LucideVideo", "Database", "Music", "Activity", "Monitor", "Cpu",
        "Play", "Pause", "FastForward", "Rewind", "Layers", "Layout", "MousePointer", "Smartphone", "Tablet", "Laptop", "Tv", "Camera", "Image", "Gift", "ShoppingCart", "CreditCard", "Wallet", "Home", "MapPin", "Navigation", "Compass", "Sunrise", "Sunset", "Moon", "Sun", "Wind", "Droplets", "Flame", "Leaf", "Coffee", "Pizza", "Bike", "Car", "Plane", "Anchor",
        "BarChart", "PieChart", "TrendingUp", "Briefcase", "Rocket", "Sparkles", "Wand2", "Lightbulb", "PenTool", "Hash", "Info", "AlertCircle", "AlertTriangle", "HelpCircle",
        `
        ${transpiled}
        
        if (typeof MyComposition === "undefined") {
          throw new Error("MyComposition not found in AI code. Make sure it starts with: const MyComposition = () => {");
        }

        return MyComposition;
        `
      );

      // Create safety wrappers to prevent common AI errors
      const safeSpring = (options: Record<string, unknown>) => {
        const springOptions = { frame: 0, fps: 30, ...options } as Parameters<typeof spring>[0];
        return spring(springOptions);
      };
      const safeStaticFile = (file: string) => (typeof file === "string" && file.startsWith("http")) ? file : staticFile(file);
      const safeRandom = (seed: string | number | null) => random(seed); // Force only one argument

      // 🔹 Bulletproof safeInterpolate — handles ALL common AI-generated mistakes silently
      const safeInterpolate = (input: number, inputRange: number[], outputRange: (number | string)[], options?: Record<string, unknown> | ((input: number) => number)): number | string => {
        try {
          // Guard: inputs must be arrays with same length >= 2
          if (!Array.isArray(inputRange) || !Array.isArray(outputRange)) return outputRange?.[0] ?? 0;
          if (inputRange.length < 2 || outputRange.length < 2) return outputRange[0];
          if (inputRange.length !== outputRange.length) return outputRange[0];
          // Guard: input must be a finite number
          if (typeof input !== "number" || !isFinite(input)) return outputRange[0];
          // Guard: inputRange must be strictly ascending — sort both arrays together if not
          const pairs = inputRange.map((v, i) => [v, outputRange[i]] as [number, number | string]);
          pairs.sort((a, b) => a[0] - b[0]);
          const sortedInput = pairs.map(p => p[0]);
          const sortedOutput = pairs.map(p => p[1]);
          // Guard: no duplicate values in inputRange
          if (sortedInput.some((v, i) => i > 0 && v === sortedInput[i - 1])) return sortedOutput[0];

          // Fix options
          let safeOptions: Record<string, unknown> | { easing: (input: number) => number } | undefined = undefined;
          if (typeof options === "function") {
            safeOptions = { easing: options };
          } else if (options && typeof options === "object") {
            const { easing, ...rest } = options as Record<string, unknown>;
            safeOptions = typeof easing === "function" ? { ...rest, easing: easing as (input: number) => number } : (rest as Record<string, unknown>);
          }

          return interpolate(input, sortedInput, sortedOutput as number[], safeOptions as Parameters<typeof interpolate>[3]);
        } catch {
          return outputRange?.[0] ?? 0;
        }
      };

      const safeInterpolateColors = (input: number, inputRange: number[], outputRange: string[]) => {
        try {
          return interpolateColors(input, inputRange, outputRange);
        } catch {
          return outputRange[0];
        }
      };

      /**
       * SafeImg: Pre-fetches every image as a same-origin blob URL.
       * This eliminates Remotion's "EncodingError: source image cannot be decoded"
       * which happens because OffscreenCanvas cannot read cross-origin images.
       * By converting to a blob:// URL first, the image is treated as same-origin.
       */
      const SafeImg = (props: React.ComponentProps<typeof Img>) => {
        const FALLBACK = "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1280&q=80";
        const [blobSrc, setBlobSrc] = React.useState<string | null>(null);
        const [handle] = React.useState(() => delayRender("SafeImg: " + (props.src || "unknown")));
        const resolvedRef = React.useRef(false);

        const resolve = React.useCallback(() => {
          if (!resolvedRef.current) {
            resolvedRef.current = true;
            try { continueRender(handle); } catch {}
          }
        }, [handle]);

        React.useEffect(() => {
          let objectUrl: string | null = null;
          const srcToLoad = props.src || FALLBACK;

          const tryFetch = (url: string, isFallback = false) => {
            fetch(url)
              .then(r => {
                if (!r.ok) throw new Error("Fetch failed");
                return r.blob();
              })
              .then(blob => {
                if (!blob.type.startsWith("image/")) {
                  throw new Error("Blob is not a valid image");
                }
                objectUrl = URL.createObjectURL(blob);
                setBlobSrc(objectUrl);
                resolve();
              })
              .catch(() => {
                if (!isFallback) {
                  tryFetch(FALLBACK, true);
                } else {
                  // Absolute last resort fallback: transparent 1x1 base64 GIF to ensure no crashes
                  setBlobSrc("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
                  resolve();
                }
              });
          };

          tryFetch(srcToLoad);

          return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          };
        }, [props.src, resolve]);

        if (!blobSrc) return null; // wait for blob

        return (
          <Img
            {...props}
            src={blobSrc}
            onError={() => {
              // Fail-safe to transparent base64 GIF on any actual render/load error
              setBlobSrc("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
              resolve();
            }}
          />
        );
      };


      const SafeVideo = (props: React.ComponentProps<typeof RemotionVideo>) => {
        return <RemotionVideo {...props} crossOrigin="anonymous" />;
      };

      const SafeOffthreadVideo = (props: React.ComponentProps<typeof OffthreadVideo>) => {
        return <OffthreadVideo {...props} crossOrigin="anonymous" />;
      };

      /**
       * SafeAudio: Guards against undefined / empty src from AI-generated code.
       * Remotion throws a hard TypeError if src is undefined — this silently
       * falls back to a default track so the video still renders.
       */
      const DEFAULT_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      const SafeAudio = (props: React.ComponentProps<typeof Audio>) => {
        let src = typeof props.src === "string" && props.src.trim().length > 0
          ? props.src
          : DEFAULT_AUDIO;
        if (src.startsWith("/")) {
          src = window.location.origin + src;
        }

        const [isReady, setIsReady] = React.useState(false);
        const [handle] = React.useState(() => delayRender("SafeAudio: " + src));
        const resolvedRef = React.useRef(false);

        const resolve = React.useCallback(() => {
          if (!resolvedRef.current) {
            resolvedRef.current = true;
            try { continueRender(handle); } catch {}
            setIsReady(true);
          }
        }, [handle]);

        React.useEffect(() => {
          const audio = new window.Audio();
          audio.src = src;
          
          const onCanPlay = () => {
            resolve();
          };

          const onError = () => {
            console.warn("SafeAudio failed to preload, falling back:", src);
            resolve();
          };

          audio.addEventListener("canplaythrough", onCanPlay);
          audio.addEventListener("error", onError);

          audio.load();

          // Timeout safety: resolve after 5 seconds to avoid freezing
          const timeout = setTimeout(() => {
            resolve();
          }, 5000);

          return () => {
            audio.removeEventListener("canplaythrough", onCanPlay);
            audio.removeEventListener("error", onError);
            clearTimeout(timeout);
          };
        }, [src, resolve]);

        // Get current frame and total duration to dynamically fade out at the end
        const { durationInFrames } = Remotion.useVideoConfig();
        
        // Calculate dynamic volume level using callback syntax as recommended by Remotion
        const originalVolume = typeof props.volume === "number" ? props.volume : 1;
        const fadeStartFrame = durationInFrames - 30; // start fade-out at the last 1 second (30 frames)
        const dynamicVolume = React.useCallback((f: number) => {
          return Remotion.interpolate(
            f,
            [fadeStartFrame, durationInFrames - 2],
            [originalVolume, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        }, [fadeStartFrame, durationInFrames, originalVolume]);

        if (!isReady) return null;

        return <Audio {...props} src={src} volume={dynamicVolume} />;
      };
      const result = createComponent(
        React,
        AbsoluteFill,
        useCurrentFrame,
        useVideoConfig,
        safeSpring,
        safeInterpolate,
        safeInterpolateColors,
        Easing,
        SafeImg,
        Sequence,
        SafeAudio,
        SafeVideo,
        SafeOffthreadVideo,
        safeStaticFile,
        Series,
        Loop,
        safeRandom,
        delayRender,
        continueRender,
        // Math / Array for generative / particle effects
        _Math,
        _Array,
        // Icons
        Cloud, Shield, Zap, Settings, Mail, Lock, User, Star, Heart, Globe, Search, Bell, Check, X, ArrowRight, Video, Database, Music, Activity, Monitor, Cpu,
        Play, Pause, FastForward, Rewind, Layers, Layout, MousePointer, Smartphone, Tablet, Laptop, Tv, Camera, Image, Gift, ShoppingCart, CreditCard, Wallet, Home, MapPin, Navigation, Compass, Sunrise, Sunset, Moon, Sun, Wind, Droplets, Flame, Leaf, Coffee, Pizza, Bike, Car, Plane, Anchor,
        BarChart, PieChart, TrendingUp, Briefcase, Rocket, Sparkles, Wand2, Lightbulb, PenTool, Hash, Info, AlertCircle, AlertTriangle, HelpCircle
      );

      // 🔹 5. Wrap into React component
      setComponent(() => {
        const DynamicComponent = (props: Record<string, unknown>) => React.createElement(result, props);
        DynamicComponent.displayName = "DynamicRemotionComponent";
        return DynamicComponent;
      });

      setIsTranspiling(false);
    } catch (e: unknown) {
      console.error("⚠️ Transpilation Error:", e);
      // Surface a clean message: strip long stack noise
      const rawMsg: string = e instanceof Error ? e.message : "Unknown error";
      const shortMsg = rawMsg.split("\n")[0].slice(0, 200);
      setError(shortMsg);
      setComponent(null);
      setIsTranspiling(false);
    }
  }, [code, duration, aspectRatio]);

  // Catch unhandled errors from the player
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes("EncodingError") || event.message?.includes("decode")) {
        setError("Video encoding error: An image in the animation could not be processed. Try a different prompt.");
      }
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // 🔴 Error UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-red-500 text-xs p-4">
        ⚠️ {error}
      </div>
    );
  }

  // 💤 Empty state
  if (!Component) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="relative z-10 flex flex-col items-center animate-pulse">
          <Monitor className="text-slate-600 w-8 h-8 mb-4" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">
            System Standby
          </p>
        </div>
      </div>
    );
  }

  // 🎬 Player UI
  return (
    <div className="relative h-full w-full bg-black group overflow-hidden">
      {isTranspiling && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Cpu className="w-10 h-10 text-blue-500 animate-spin" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Compiling...
            </span>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
        {/* Wrapper constrains the player to correct aspect ratio */}
        <div
          data-remotion-player="true"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width:
                aspectRatio === "9:16" ? "auto" :
                aspectRatio === "1:1" ? "min(100%, 100vh)" :
                "100%",
              height:
                aspectRatio === "9:16" ? "100%" :
                aspectRatio === "1:1" ? "min(100%, 100vh)" :
                "auto",
              aspectRatio:
                aspectRatio === "9:16" ? "9/16" :
                aspectRatio === "1:1" ? "1/1" :
                "16/9",
              maxHeight: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: "1rem",
            }}
          >
            <Player
              component={Component}
              durationInFrames={Math.max(1, duration * 30)}
              fps={30}
              compositionWidth={aspectRatio === "9:16" ? 720 : aspectRatio === "1:1" ? 1080 : 1280}
              compositionHeight={aspectRatio === "9:16" ? 1280 : aspectRatio === "1:1" ? 1080 : 720}
              style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
              acknowledgeRemotionLicense
              controls
              loop
              errorFallback={({ error: playerError }) => (
                <div style={{ color: "#f87171", padding: "16px", fontSize: "11px", fontFamily: "monospace", background: "#000", height: "100%" }}>
                  ⚠️ {playerError?.message?.split("\n")[0]?.slice(0, 200) || "Render error"}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoPreview = React.memo(VideoPreviewBase);
VideoPreview.displayName = "VideoPreview";