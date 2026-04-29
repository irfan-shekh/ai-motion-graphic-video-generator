import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { bundle } from "@remotion/bundler";
import { renderMedia, getCompositions } from "@remotion/renderer";
import fs from "fs";
import path from "path";
import os from "os";

// Increase Next.js route timeout to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  let tempDir: string | null = null;
  let outputPath: string | null = null;

  try {
    // 1. Authenticate
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract Data
    const { videoCode, duration, aspectRatio } = await req.json();
    if (!videoCode) {
      return NextResponse.json({ error: "No video code provided" }, { status: 400 });
    }

    // 3. Prepare Environment
    tempDir = path.join(os.tmpdir(), `remotion-render-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // 4. Resolve Resolution
    const width = aspectRatio === "9:16" ? 540 : aspectRatio === "1:1" ? 800 : 960;
    const height = aspectRatio === "9:16" ? 960 : aspectRatio === "1:1" ? 800 : 540;

    // 5. Clean Code & Ensure Export
    let cleanCode = videoCode
      .replace(/^import\s+.*$/gm, "")
      .replace(/```[a-z]*\n/g, "")
      .replace(/```/g, "")
      .trim();

    // Map AI component to MyComposition
    if (cleanCode.includes("export default function")) {
      cleanCode = cleanCode.replace(/export\s+default\s+function\s+[a-zA-Z0-9_$]+/, "function MyComposition");
    } else if (cleanCode.match(/export\s+default\s+[a-zA-Z0-9_$]+;?$/)) {
      cleanCode = cleanCode.replace(/export\s+default\s+([a-zA-Z0-9_$]+);?$/, "const MyComposition = $1;");
    } else if (cleanCode.includes("export default")) {
      cleanCode = cleanCode.replace(/export\s+default\s+/, "const MyComposition = ");
    }
    cleanCode = cleanCode.replace(/export\s+const\s+/g, "const ");

    // 6. Create Source Files
    const compositionFile = path.join(tempDir, "composition.tsx");
    const compositionCode = `
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate as remotionInterpolate, interpolateColors as remotionInterpolateColors, Easing, Img as RemotionImg, Sequence, Audio as RemotionAudio, Series, Loop,
  spring as remotionSpring, staticFile as remotionStaticFile, random as remotionRandom
} from 'remotion';
import * as LucideIcons from 'lucide-react';

// Safety Wrappers
const spring = (options) => remotionSpring({ fps: 30, ...options });
const staticFile = (file) => (typeof file === 'string' && file.startsWith('http')) ? file : remotionStaticFile(file);
const random = (seed) => remotionRandom(seed);
const delayRender = () => 0;
const continueRender = () => {};
const interpolateColors = (input, inputRange, outputRange) => {
  try { return remotionInterpolateColors(input, inputRange, outputRange); } catch (e) { return outputRange[0]; }
};

// Safe Interpolate
const interpolate = (input, inputRange, outputRange, options) => {
  try {
    if (inputRange.length < 2 || inputRange.length !== outputRange.length) return outputRange[0];
    const pairs = inputRange.map((v, i) => [v, outputRange[i]]).sort((a, b) => a[0] - b[0]);
    return remotionInterpolate(input, pairs.map(p => p[0]), pairs.map(p => p[1]), options);
  } catch (e) { return outputRange[0]; }
};

// Safe Image
const SafeImg = (props) => {
  const [src, setSrc] = React.useState(props.src);
  return <RemotionImg {...props} src={src} onError={() => setSrc("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")} />;
};

const Img = SafeImg;

// Safe Audio
const SafeAudio = (props) => {
  const [error, setError] = React.useState(false);
  if (error) return null;
  return <RemotionAudio {...props} onError={() => setError(true)} />;
};

const Audio = SafeAudio;

// Extract all icons into the global scope of this file
const { 
  Cloud, Shield, Zap, Settings, Mail, Lock, User, Star, Heart, Globe, Search, Bell, Check, X, ArrowRight, Video, Database, Music, Activity, Monitor, Cpu,
  Play, Pause, FastForward, Rewind, Layers, Layout, MousePointer, Smartphone, Tablet, Laptop, Tv, Camera, Image, Gift, ShoppingCart, CreditCard, Wallet, 
  Home, MapPin, Navigation, Compass, Sunrise, Sunset, Moon, Sun, Wind, Droplets, Flame, Leaf, Coffee, Pizza, Bike, Car, Plane, Anchor,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Plus, Minus, Edit, Trash, Share, Download, ExternalLink, Info, AlertTriangle, AlertCircle,
  Clock, Calendar, Filter, SortAsc, SortDesc, List, Grid, Menu, MoreHorizontal, MoreVertical, RefreshCw, Send, Paperclip, MessageSquare,
  ThumbsUp, ThumbsDown, Eye, EyeOff, Smile, Laugh, Frown, Meh, Trophy, Medal, Award, Target, Flag, Bookmark, Hash, Tag, Link,
  BarChart, PieChart, TrendingUp, Briefcase, Rocket, Sparkles, Wand2, Lightbulb, PenTool, HelpCircle
} = LucideIcons;

${cleanCode}

export { MyComposition };
`;
    fs.writeFileSync(compositionFile, compositionCode);

    const entryPointFile = path.join(tempDir, "index.tsx");
    const entryPointCode = `
import { registerRoot, Composition } from 'remotion';
import { MyComposition } from './composition';

registerRoot(() => (
  <Composition
    id="MyComposition"
    component={MyComposition}
    durationInFrames={${Math.min(duration, 30) * 30}}
    fps={30}
    width={${width}}
    height={${height}}
  />
));`;
    fs.writeFileSync(entryPointFile, entryPointCode);

    // 7. Bundle & Render
    console.log("[RENDER] Bundling...");
    const serveUrl = await bundle(entryPointFile, undefined, {
      webpackOverride: (config) => {
        if (config.resolve) config.resolve.modules = [...(config.resolve.modules || []), path.join(process.cwd(), "node_modules")];
        return config;
      },
    });

    const comps = await getCompositions(serveUrl);
    const composition = comps.find((c) => c.id === "MyComposition");
    if (!composition) throw new Error("Composition not found");

    outputPath = path.join(tempDir, "render.mp4");
    const localFfmpeg = path.join(process.cwd(), "lib", "ffmpeg");

    console.log("[RENDER] Starting render (Stability Mode)...");
    await renderMedia({
      serveUrl,
      composition,
      codec: "h264",
      audioCodec: "aac",
      outputLocation: outputPath,
      concurrency: 2, // Slight increase for speed
      chromiumOptions: {
        disableWebSecurity: true,
      },
      timeoutInMilliseconds: 240000,
    });

    // 8. Return Result
    const videoBuffer = fs.readFileSync(outputPath);
    return new Response(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="video-${Date.now()}.mp4"`,
      },
    });

  } catch (error: any) {
    console.error("[RENDER] FAILED:", error);
    return NextResponse.json({ error: error.message || "Render failed" }, { status: 500 });
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) { }
    }
  }
}