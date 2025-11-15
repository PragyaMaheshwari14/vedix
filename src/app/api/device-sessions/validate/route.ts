// src/app/api/device-sessions/validate/route.ts
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ valid: false }, { status: 401 });

  // Safely derive a userId. Try session.user.id (if you added it in session callback),
  // otherwise fall back to email.
  const userId = ((session.user as any)?.id as string | undefined) ?? session.user?.email ?? "";
  if (!userId) return NextResponse.json({ valid: false, reason: "no_user_id" }, { status: 400 });

  const body = await request.json();
  const deviceId = body.deviceId;
  if (!deviceId) return NextResponse.json({ valid: false, reason: "no_device_id" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const DeviceSessions = db.collection("deviceSessions");

  const rec = await DeviceSessions.findOne({ userId, deviceId });
  if (!rec) return NextResponse.json({ valid: false, reason: "not_found" });
  if (!rec.valid) return NextResponse.json({ valid: false, reason: "invalidated" });

  // update lastSeen
  await DeviceSessions.updateOne({ _id: rec._id }, { $set: { lastSeenAt: new Date() } });

  return NextResponse.json({ valid: true });
}
