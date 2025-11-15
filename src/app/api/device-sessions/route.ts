// src/app/api/device-sessions/route.ts
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const N = 3; // concurrency limit

export async function POST(request: Request) {
  // Create a device session (called by client right after sign-in)
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Safely derive a userId string. Try session.user.id (if you've added it to the session),
  // otherwise fall back to email. Adjust if you prefer a different fallback.
  const userId =
    // cast to any to read potential custom id added in your session callback
    ((session.user as any)?.id as string | undefined) ?? session.user?.email ?? "";

  if (!userId) return NextResponse.json({ error: "No user id available" }, { status: 400 });

  const body = await request.json();
  const deviceId = body.deviceId;
  const ua = request.headers.get("user-agent") ?? "";
  const client = await clientPromise;
  const db = client.db();

  const DeviceSessions = db.collection("deviceSessions");

  // Create a new session record
  const result = await DeviceSessions.insertOne({
    userId,
    deviceId,
    sessionId: `${userId}-${Date.now()}`, // you can use a different unique id strategy
    userAgent: ua,
    createdAt: new Date(),
    lastSeenAt: new Date(),
    valid: true,
  });

  // Count currently active (valid) sessions
  const activeCount = await DeviceSessions.countDocuments({
    userId,
    valid: true,
  });

  return NextResponse.json({ createdId: result.insertedId, activeCount });
}

export async function GET(request: Request) {
  // List device sessions for current user (for UI to choose which to invalidate)
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = ((session.user as any)?.id as string | undefined) ?? session.user?.email ?? "";
  if (!userId) return NextResponse.json({ error: "No user id available" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const DeviceSessions = db.collection("deviceSessions");

  const sessions = await DeviceSessions.find({ userId }).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ sessions });
}

export async function PUT(request: Request) {
  // Invalidate selected sessions (force logout previous devices)
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = ((session.user as any)?.id as string | undefined) ?? session.user?.email ?? "";
  if (!userId) return NextResponse.json({ error: "No user id available" }, { status: 400 });

  const { ids } = await request.json(); // array of _id strings
  if (!Array.isArray(ids)) return NextResponse.json({ error: "Invalid ids" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const DeviceSessions = db.collection("deviceSessions");

  const objectIds = ids.map((s: string) => new ObjectId(s));
  const { modifiedCount } = await DeviceSessions.updateMany(
    { _id: { $in: objectIds }, userId },
    { $set: { valid: false, invalidatedAt: new Date() } }
  );

  return NextResponse.json({ modifiedCount });
}
