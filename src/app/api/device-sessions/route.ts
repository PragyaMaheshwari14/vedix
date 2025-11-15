// src/app/api/device-sessions/route.ts
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db();
    const DeviceSessions = db.collection("deviceSessions");

    const userId = (session.user as any).id ?? session.user?.email;
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 500 });

    const sessions = await DeviceSessions.find({ userId }).sort({ createdAt: -1 }).toArray();
    const activeSessions = sessions.map((s: any) => ({
      _id: s._id.toString(),
      deviceId: s.deviceId,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      valid: !!s.valid
    }));

    return NextResponse.json({ activeSessions });
  } catch (err: any) {
    console.error("GET /api/device-sessions error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const ids: string[] = body?.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const DeviceSessions = db.collection("deviceSessions");

    const userId = (session.user as any).id ?? session.user?.email;
    if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 500 });

    // validate & convert ids safely
    const validObjIds = ids.filter((s) => typeof s === "string" && s.length === 24 && /^[0-9a-fA-F]+$/.test(s)).map((s) => new ObjectId(s));
    if (validObjIds.length === 0) {
      return NextResponse.json({ error: "No valid ids provided" }, { status: 400 });
    }

    const updateRes = await DeviceSessions.updateMany(
      { _id: { $in: validObjIds }, userId },
      { $set: { valid: false, invalidatedAt: new Date() } }
    );

    const sessions = await DeviceSessions.find({ userId }).sort({ createdAt: -1 }).toArray();
    const activeSessions = sessions.map((s: any) => ({
      _id: s._id.toString(),
      deviceId: s.deviceId,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      valid: !!s.valid
    }));

    return NextResponse.json({ modifiedCount: updateRes.modifiedCount ?? 0, activeSessions });
  } catch (err: any) {
    console.error("PUT /api/device-sessions error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
