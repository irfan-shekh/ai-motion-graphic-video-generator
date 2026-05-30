import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In-memory caches to prevent redundant Gemini/TTS calls and ensure consistent render output
const scriptCache = new Map<string, string>();
const audioCache = new Map<string, ArrayBuffer>();

function createRangeResponse(arrayBuffer: ArrayBuffer, requestHeaders: Headers, contentType: string): Response {
  const buffer = Buffer.from(arrayBuffer);
  const totalSize = buffer.length;
  const range = requestHeaders.get("range");

  if (!range) {
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": totalSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  try {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

    if (start >= totalSize || end >= totalSize || start > end) {
      return new Response(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${totalSize}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    const chunk = buffer.subarray(start, end + 1);
    const chunkSize = chunk.length;

    return new Response(chunk, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": chunkSize.toString(),
        "Content-Range": `bytes ${start}-${end}/${totalSize}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Failed to serve partial range request:", err);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": totalSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("prompt") || "creative automation";
    const duration = Math.min(Math.max(Number(searchParams.get("duration")) || 10, 5), 20);
    const type = searchParams.get("type") || "music";

    if (type === "voiceover") {
      const cacheKey = `${duration}-${prompt.toLowerCase()}`;

      // Check audio cache first to avoid repeating Gemini API and TTS calls
      if (audioCache.has(cacheKey)) {
        console.log(`[AUDIO CACHE] Serving cached audio buffer for key: "${cacheKey}"`);
        const cachedBuffer = audioCache.get(cacheKey)!;
        return createRangeResponse(cachedBuffer, req.headers, "audio/mpeg");
      }

      let scriptText = "";

      // Check script cache first
      if (scriptCache.has(cacheKey)) {
        scriptText = scriptCache.get(cacheKey)!;
        console.log(`[SCRIPT CACHE] Using cached script: "${scriptText}"`);
      } else {
        // 1. Ask Gemini to write a custom, perfectly timed voiceover script
        const scriptPrompt = `
You are a professional voiceover artist and script writer.
Create a compelling, professional, single-paragraph voiceover script based on the following video description.
The script MUST be short enough to be spoken naturally within exactly ${duration} seconds.
Speak at a standard rate of 2.5 words per second.
For ${duration} seconds, the script MUST be between ${Math.floor(duration * 2)} and ${Math.ceil(duration * 2.8)} words (approximately ${Math.round(duration * 2.5)} words total).

Video Description: ${prompt}

Rules:
1. Output ONLY the voiceover script.
2. Do NOT include any stage directions, music cues, speaker labels, or markdown formatting.
3. Keep it cohesive, fluid, and engaging.
`;

        let attempts = 3;
        let backoffMs = 1500;

        for (let i = 0; i < attempts; i++) {
          try {
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
            const result = await model.generateContent(scriptPrompt);
            scriptText = result.response.text().trim().replace(/[\r\n]+/g, " ");
            if (scriptText) {
              scriptCache.set(cacheKey, scriptText);
              break;
            }
          } catch (err: any) {
            console.warn(`[GEMINI ATTEMPT ${i + 1} FAILED]`, err?.message || err);
            if (i === attempts - 1) {
              // Final fallback: generate a premium template script based on prompt
              const cleanPrompt = prompt.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
              scriptText = `Discover this incredible creative vision of ${cleanPrompt}. Crafted with premium aesthetics, dynamic motion, and professional design to elevate your brand.`;
              console.log(`[FALLBACK SCRIPT] Generated: "${scriptText}"`);
              scriptCache.set(cacheKey, scriptText);
            } else {
              await new Promise(resolve => setTimeout(resolve, backoffMs));
              backoffMs *= 2; // Exponential backoff
            }
          }
        }
      }

      // 2. Convert script to speech using Google Translate TTS API
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(scriptText)}&tl=en&client=tw-ob`;
      
      const ttsResponse = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!ttsResponse.ok) {
        throw new Error("Failed to synthesize speech");
      }

      const audioBuffer = await ttsResponse.arrayBuffer();
      
      // Store in audio cache for all subsequent requests
      audioCache.set(cacheKey, audioBuffer);
      
      return createRangeResponse(audioBuffer, req.headers, "audio/mpeg");

    } else {
      // type === "music"
      // Curate a set of high-quality background tracks matching the user's prompt
      const lowercasePrompt = prompt.toLowerCase();
      const cacheKey = `music-${lowercasePrompt}`;

      if (audioCache.has(cacheKey)) {
        const cachedBuffer = audioCache.get(cacheKey)!;
        return createRangeResponse(cachedBuffer, req.headers, "audio/mpeg");
      }
      
      const MUSIC_TRACKS = {
        tech: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        corporate: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        epic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        energetic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        ambient: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        dramatic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        happy: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        peaceful: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        retro: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        action: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        emotional: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        luxury: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        documentary: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        comedy: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        horror: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
      };

      let selectedCategory: keyof typeof MUSIC_TRACKS = "corporate";

      if (lowercasePrompt.includes("tech") || lowercasePrompt.includes("software") || lowercasePrompt.includes("saas") || lowercasePrompt.includes("cyber") || lowercasePrompt.includes("future") || lowercasePrompt.includes("digital")) {
        selectedCategory = "tech";
      } else if (lowercasePrompt.includes("epic") || lowercasePrompt.includes("cinematic") || lowercasePrompt.includes("trailer") || lowercasePrompt.includes("hero")) {
        selectedCategory = "epic";
      } else if (lowercasePrompt.includes("dance") || lowercasePrompt.includes("energy") || lowercasePrompt.includes("hype") || lowercasePrompt.includes("club") || lowercasePrompt.includes("party")) {
        selectedCategory = "energetic";
      } else if (lowercasePrompt.includes("lofi") || lowercasePrompt.includes("chill") || lowercasePrompt.includes("ambient") || lowercasePrompt.includes("sleep") || lowercasePrompt.includes("relax")) {
        selectedCategory = "ambient";
      } else if (lowercasePrompt.includes("suspense") || lowercasePrompt.includes("dark") || lowercasePrompt.includes("mystery") || lowercasePrompt.includes("thriller")) {
        selectedCategory = "dramatic";
      } else if (lowercasePrompt.includes("happy") || lowercasePrompt.includes("fun") || lowercasePrompt.includes("playful") || lowercasePrompt.includes("kids") || lowercasePrompt.includes("child")) {
        selectedCategory = "happy";
      } else if (lowercasePrompt.includes("nature") || lowercasePrompt.includes("peaceful") || lowercasePrompt.includes("calm") || lowercasePrompt.includes("meditat")) {
        selectedCategory = "peaceful";
      } else if (lowercasePrompt.includes("retro") || lowercasePrompt.includes("jazz") || lowercasePrompt.includes("vintage") || lowercasePrompt.includes("classic")) {
        selectedCategory = "retro";
      } else if (lowercasePrompt.includes("game") || lowercasePrompt.includes("gaming") || lowercasePrompt.includes("sport") || lowercasePrompt.includes("action")) {
        selectedCategory = "action";
      } else if (lowercasePrompt.includes("emotional") || lowercasePrompt.includes("sad") || lowercasePrompt.includes("love") || lowercasePrompt.includes("romantic")) {
        selectedCategory = "emotional";
      } else if (lowercasePrompt.includes("luxury") || lowercasePrompt.includes("wedding") || lowercasePrompt.includes("gold") || lowercasePrompt.includes("elegant")) {
        selectedCategory = "luxury";
      } else if (lowercasePrompt.includes("documentary") || lowercasePrompt.includes("history") || lowercasePrompt.includes("inspire") || lowercasePrompt.includes("inspirational")) {
        selectedCategory = "documentary";
      } else if (lowercasePrompt.includes("comedy") || lowercasePrompt.includes("quirky") || lowercasePrompt.includes("funny") || lowercasePrompt.includes("cartoon")) {
        selectedCategory = "comedy";
      } else if (lowercasePrompt.includes("horror") || lowercasePrompt.includes("scary") || lowercasePrompt.includes("ghost") || lowercasePrompt.includes("creepy")) {
        selectedCategory = "horror";
      }

      const musicUrl = MUSIC_TRACKS[selectedCategory];
      const musicResponse = await fetch(musicUrl);
      if (!musicResponse.ok) {
        throw new Error("Failed to fetch music track");
      }

      const audioBuffer = await musicResponse.arrayBuffer();
      audioCache.set(cacheKey, audioBuffer);
      
      return createRangeResponse(audioBuffer, req.headers, "audio/mpeg");
    }

  } catch (error) {
    console.error("Audio Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
