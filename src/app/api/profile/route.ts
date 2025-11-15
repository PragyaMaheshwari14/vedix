// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

type ReqBody = { phone?: string };

function getUserIdFromSession(session: any): string | null {
  // try to read a custom id (if you added it in session callback), otherwise fallback to email
  return (session?.user as any)?.id ?? session?.user?.email ?? null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserIdFromSession(session);
    if (!userId) return NextResponse.json({ error: "No user id available" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const profiles = db.collection("profiles");

    const rec = await profiles.findOne({ userId });
    return NextResponse.json({ phone: rec?.phone ?? null });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserIdFromSession(session);
    if (!userId) return NextResponse.json({ error: "No user id available" }, { status: 400 });

    const body = (await request.json()) as ReqBody;
    if (!body?.phone) {
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const profiles = db.collection("profiles");

    // Upsert profile by userId
    await profiles.updateOne(
      { userId },
      { $set: { phone: body.phone, updatedAt: new Date(), name: session.user?.name ?? null } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
