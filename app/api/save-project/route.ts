import { auth } from "@/lib/auth"; // Your Better-Auth instance
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers"; // Next.js helper

export async function POST(req: Request) {
  try {
    // 1. Better-Auth session retrieval
    const session = await auth.api.getSession({
      headers: await headers(), 
    });

    // 2. Security Check
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoCode, prompt, duration, aspectRatio } = await req.json();
    
    if (!videoCode || !prompt) {
      return NextResponse.json({ error: "Missing video code or prompt" }, { status: 400 });
    }

    console.log("[SAVE] Received save request for user:", session.user.id);
    console.log("[SAVE] Prompt:", prompt);
    console.log("[SAVE] Aspect Ratio:", aspectRatio);
    const validatedDuration = Math.round(Math.min(Math.max(Number(duration) || 10, 5), 20));

    // 3. Create project using the verified user ID
    const project = await db.project.create({
      data: {
        videoCode,
        prompt,
        duration: validatedDuration,
        aspectRatio: aspectRatio || "16:9",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ id: project.id });
  } catch (error: unknown) {
    console.error("Database Save Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[ARCHIVE] Fetching projects for user:", session.user.id);

    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Verify the project belongs to the user
    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the project
    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    console.error("Delete error");
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}