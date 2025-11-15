// src/app/api/device-sessions/validate/route.ts
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import { NextResponse } from "next/server";

const N = 3;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ valid: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const deviceId = body?.deviceId;
    if (!deviceId) return NextResponse.json({ valid: false, error: "deviceId required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const DeviceSessions = db.collection("deviceSessions");

    const userId = (session.user as any).id ?? session.user?.email;
    if (!userId) return NextResponse.json({ valid: false, error: "Missing user id" }, { status: 500 });

    // count active sessions
    const activeCount = await DeviceSessions.countDocuments({ userId, valid: true });

    // find existing session for this device
    const rec = await DeviceSessions.findOne({ userId, deviceId });

    // if existing and invalidated -> explicitly invalidated (force-logged-out)
    if (rec && rec.valid === false) {
      return NextResponse.json({ valid: false, reason: "invalidated" });
    }

    // if exists & valid -> update lastSeen and return success
    if (rec && rec.valid) {
      await DeviceSessions.updateOne({ _id: rec._id }, { $set: { lastSeenAt: new Date() } });

      const sessions = await DeviceSessions.find({ userId }).sort({ createdAt: -1 }).toArray();
      const activeSessions = sessions.map((s: any) => ({
        _id: s._id.toString(),
        deviceId: s.deviceId,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        lastSeenAt: s.lastSeenAt,
        valid: !!s.valid
      }));

      return NextResponse.json({ valid: true, activeCount, activeSessions });
    }

    // not found -> try to create if limit not reached
    if (activeCount >= N) {
      // limit reached -> return list so client can show choices
      const sessions = await DeviceSessions.find({ userId, valid: true }).sort({ createdAt: -1 }).toArray();
      const activeSessions = sessions.map((s: any) => ({
        _id: s._id.toString(),
        deviceId: s.deviceId,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        lastSeenAt: s.lastSeenAt,
        valid: !!s.valid
      }));

      return NextResponse.json({ valid: false, reason: "limit_reached", activeCount, activeSessions });
    }

    // create new session record
    const ua = request.headers.get("user-agent") ?? "";
    const newRec = {
      userId,
      deviceId,
      sessionId: `${userId}-${Date.now()}`,
      userAgent: ua,
      createdAt: new Date(),
      lastSeenAt: new Date(),
      valid: true
    };
    const insertRes = await DeviceSessions.insertOne(newRec);
    const activeCountAfter = await DeviceSessions.countDocuments({ userId, valid: true });
    const sessions = await DeviceSessions.find({ userId }).sort({ createdAt: -1 }).toArray();
    const activeSessions = sessions.map((s: any) => ({
      _id: s._id.toString(),
      deviceId: s.deviceId,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      valid: !!s.valid
    }));

    return NextResponse.json({ valid: true, createdId: insertRes.insertedId?.toString?.(), activeCount: activeCountAfter, activeSessions });
  } catch (err: any) {
    console.error("POST /api/device-sessions/validate error:", err);
    return NextResponse.json({ valid: false, error: err?.message ?? "Server error" }, { status: 500 });
  }
}
