import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In-memory caches to prevent redundant Gemini/TTS calls and ensure consistent render output
const scriptCache = new Map<string, string>();
const audioCache = new Map<string, ArrayBuffer | Uint8Array>();

function createRangeResponse(arrayBuffer: ArrayBuffer | Uint8Array, requestHeaders: Headers, contentType: string): Response {
  const buffer = arrayBuffer instanceof ArrayBuffer
    ? Buffer.from(arrayBuffer)
    : Buffer.from(arrayBuffer.buffer, arrayBuffer.byteOffset, arrayBuffer.byteLength);
  const totalSize = buffer.length;
  const range = requestHeaders.get("range");

  if (!range) {
    return new Response(new Uint8Array(buffer), {
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

    return new Response(new Uint8Array(chunk), {
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
    return new Response(new Uint8Array(buffer), {
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

        const attempts = 3;
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
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.warn(`[GEMINI ATTEMPT ${i + 1} FAILED]`, errMsg);
            
            // Check if it's a 429 Too Many Requests or quota-related limit to fall back immediately
            if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("Quota")) {
              console.log("[GEMINI QUOTA LIMIT] Falling back immediately to template script.");
              const cleanPrompt = prompt.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
              scriptText = `Discover this incredible creative vision of ${cleanPrompt}. Crafted with premium aesthetics, dynamic motion, and professional design to elevate your brand.`;
              scriptCache.set(cacheKey, scriptText);
              break;
            }

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

      // 2. Convert script to speech using Google Translate TTS API in safe <= 150 char chunks
      const words = scriptText.split(" ");
      const chunks: string[] = [];
      let currentChunk = "";

      for (const word of words) {
        if ((currentChunk + " " + word).trim().length > 150) {
          chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          currentChunk = currentChunk ? currentChunk + " " + word : word;
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      const buffers: Buffer[] = [];
      let ttsFailed = false;
      for (const chunk of chunks) {
        try {
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=en&client=tw-ob`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          
          const ttsResponse = await fetch(ttsUrl, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
          });
          clearTimeout(timeoutId);

          if (!ttsResponse.ok) {
            console.warn(`[AUDIO VOICEOVER] TTS chunk fetch failed with status: ${ttsResponse.status}`);
            ttsFailed = true;
            break;
          }

          const chunkArrayBuffer = await ttsResponse.arrayBuffer();
          buffers.push(Buffer.from(chunkArrayBuffer));
        } catch (ttsErr) {
          console.warn(`[AUDIO VOICEOVER] TTS chunk fetch failed:`, ttsErr instanceof Error ? ttsErr.message : String(ttsErr));
          ttsFailed = true;
          break;
        }
      }

      let audioBuffer: ArrayBuffer | Uint8Array;

      if (ttsFailed || buffers.length === 0) {
        console.warn("[AUDIO VOICEOVER] Fallback to silent MP3 due to TTS failure.");
        const SILENT_MP3_B64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV";
        audioBuffer = Buffer.from(SILENT_MP3_B64, "base64");
      } else {
        audioBuffer = Buffer.concat(buffers);
      }

      // Store in audio cache for all subsequent requests
      audioCache.set(cacheKey, audioBuffer);
      
      return createRangeResponse(audioBuffer, req.headers, "audio/mpeg");

    } else {
      // type === "music"
      // Curate a set of high-quality background tracks matching the user's prompt
      const lowercasePrompt = prompt.toLowerCase();
      const cacheKey = `music-${duration}-${lowercasePrompt}`;

      if (audioCache.has(cacheKey)) {
        const cachedBuffer = audioCache.get(cacheKey)!;
        return createRangeResponse(cachedBuffer, req.headers, "audio/mpeg");
      }
      
      const MUSIC_TRACKS = {
        tech: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        corporate: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        epic: "https://upload.wikimedia.org/wikipedia/commons/3/30/Liszts_Liebestraum_No._3.mp3",
        energetic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        ambient: "https://upload.wikimedia.org/wikipedia/commons/4/41/Gymnopedie_No._1.mp3",
        dramatic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        happy: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Maple_Leaf_Rag.mp3",
        peaceful: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        retro: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Maple_Leaf_Rag_-_played_by_Scott_Joplin_1916.mp3",
        action: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        emotional: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Debussy_-_Clair_de_Lune.mp3",
        luxury: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        documentary: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        comedy: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        horror: "https://upload.wikimedia.org/wikipedia/commons/2/25/Bach_-_Toccata_und_Fuge_d-moll_BWV_565.mp3",
      };

      let selectedCategory: keyof typeof MUSIC_TRACKS = "corporate";

      if (lowercasePrompt.includes("tech") || lowercasePrompt.includes("software") || lowercasePrompt.includes("saas") || lowercasePrompt.includes("cyber") || lowercasePrompt.includes("future") || lowercasePrompt.includes("digital") || lowercasePrompt.includes("code") || lowercasePrompt.includes("ai")) {
        selectedCategory = "tech";
      } else if (lowercasePrompt.includes("epic") || lowercasePrompt.includes("cinematic") || lowercasePrompt.includes("trailer") || lowercasePrompt.includes("hero") || lowercasePrompt.includes("movie") || lowercasePrompt.includes("film")) {
        selectedCategory = "epic";
      } else if (lowercasePrompt.includes("dance") || lowercasePrompt.includes("energy") || lowercasePrompt.includes("hype") || lowercasePrompt.includes("club") || lowercasePrompt.includes("party") || lowercasePrompt.includes("beat")) {
        selectedCategory = "energetic";
      } else if (lowercasePrompt.includes("lofi") || lowercasePrompt.includes("chill") || lowercasePrompt.includes("ambient") || lowercasePrompt.includes("sleep") || lowercasePrompt.includes("relax") || lowercasePrompt.includes("study") || lowercasePrompt.includes("calm")) {
        selectedCategory = "ambient";
      } else if (lowercasePrompt.includes("suspense") || lowercasePrompt.includes("mystery") || lowercasePrompt.includes("thriller") || lowercasePrompt.includes("detective") || lowercasePrompt.includes("noir")) {
        selectedCategory = "dramatic";
      } else if (lowercasePrompt.includes("happy") || lowercasePrompt.includes("fun") || lowercasePrompt.includes("playful") || lowercasePrompt.includes("kids") || lowercasePrompt.includes("child") || lowercasePrompt.includes("cheerful") || lowercasePrompt.includes("joy")) {
        selectedCategory = "happy";
      } else if (lowercasePrompt.includes("nature") || lowercasePrompt.includes("peaceful") || lowercasePrompt.includes("calm") || lowercasePrompt.includes("meditat") || lowercasePrompt.includes("forest") || lowercasePrompt.includes("ocean")) {
        selectedCategory = "peaceful";
      } else if (lowercasePrompt.includes("retro") || lowercasePrompt.includes("jazz") || lowercasePrompt.includes("vintage") || lowercasePrompt.includes("classic") || lowercasePrompt.includes("old") || lowercasePrompt.includes("blues")) {
        selectedCategory = "retro";
      } else if (lowercasePrompt.includes("game") || lowercasePrompt.includes("gaming") || lowercasePrompt.includes("sport") || lowercasePrompt.includes("action") || lowercasePrompt.includes("race")) {
        selectedCategory = "action";
      } else if (lowercasePrompt.includes("emotional") || lowercasePrompt.includes("sad") || lowercasePrompt.includes("love") || lowercasePrompt.includes("romantic") || lowercasePrompt.includes("heart")) {
        selectedCategory = "emotional";
      } else if (lowercasePrompt.includes("luxury") || lowercasePrompt.includes("wedding") || lowercasePrompt.includes("gold") || lowercasePrompt.includes("elegant") || lowercasePrompt.includes("celebrat")) {
        selectedCategory = "luxury";
      } else if (lowercasePrompt.includes("documentary") || lowercasePrompt.includes("history") || lowercasePrompt.includes("inspire") || lowercasePrompt.includes("inspirational") || lowercasePrompt.includes("motivation")) {
        selectedCategory = "documentary";
      } else if (lowercasePrompt.includes("comedy") || lowercasePrompt.includes("quirky") || lowercasePrompt.includes("funny") || lowercasePrompt.includes("cartoon") || lowercasePrompt.includes("silly")) {
        selectedCategory = "comedy";
      } else if (lowercasePrompt.includes("horror") || lowercasePrompt.includes("scary") || lowercasePrompt.includes("ghost") || lowercasePrompt.includes("creepy") || lowercasePrompt.includes("dark") || lowercasePrompt.includes("halloween")) {
        selectedCategory = "horror";
      }

      const musicUrl = MUSIC_TRACKS[selectedCategory];
      let audioBuffer: ArrayBuffer | Uint8Array | null = null;

      // 1. Try the main music URL with a timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const musicResponse = await fetch(musicUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        clearTimeout(timeoutId);

        if (musicResponse.ok) {
          audioBuffer = await musicResponse.arrayBuffer();
        } else {
          console.warn(`[AUDIO MUSIC] Failed to fetch primary track ${musicUrl}, status code: ${musicResponse.status}`);
        }
      } catch (err: unknown) {
        console.warn(`[AUDIO MUSIC] Primary fetch failed for ${musicUrl}:`, err instanceof Error ? err.message : String(err));
      }

      // 2. Try highly reliable Wikimedia Commons CDN as backup options
      if (!audioBuffer) {
        const BACKUP_TRACKS = [
          "https://upload.wikimedia.org/wikipedia/commons/4/41/Gymnopedie_No._1.mp3",
          "https://upload.wikimedia.org/wikipedia/commons/3/30/Liszts_Liebestraum_No._3.mp3",
          "https://upload.wikimedia.org/wikipedia/commons/9/9b/Debussy_-_Clair_de_Lune.mp3"
        ];

        for (const backupUrl of BACKUP_TRACKS) {
          try {
            console.log(`[AUDIO MUSIC] Trying backup track: ${backupUrl}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const musicResponse = await fetch(backupUrl, {
              signal: controller.signal,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
              }
            });
            clearTimeout(timeoutId);

            if (musicResponse.ok) {
              audioBuffer = await musicResponse.arrayBuffer();
              console.log(`[AUDIO MUSIC] Successfully fetched backup track: ${backupUrl}`);
              break;
            }
          } catch (backupErr: unknown) {
            console.warn(`[AUDIO MUSIC] Backup fetch failed for ${backupUrl}:`, backupErr instanceof Error ? backupErr.message : String(backupErr));
          }
        }
      }

      // 3. Absolute last resort fallback: Serve in-memory minimal silent MP3 buffer to avoid crash
      if (!audioBuffer) {
        console.warn("[AUDIO MUSIC] All music fetches failed. Falling back to in-memory silent MP3.");
        const SILENT_MP3_B64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV";
        audioBuffer = Buffer.from(SILENT_MP3_B64, "base64");
      }

      audioCache.set(cacheKey, audioBuffer);
      return createRangeResponse(audioBuffer, req.headers, "audio/mpeg");
    }

  } catch (error) {
    console.error("Audio Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
