import { auth } from "@/lib/auth"; // Adjust path to your auth.ts
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
