// app/dashboard/page.tsx  (or pages/dashboard.tsx)
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getOrCreateDeviceId } from "@/lib/device";
import { safeFetchJson } from "@/lib/safeFetch";
import ForceLogoutModal from "../components/ForceLogoutModal";

type Device = {
  _id: string;
  deviceId: string;
  userAgent?: string;
  createdAt?: string;
  lastSeenAt?: string;
  valid?: boolean;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // modal state & sessions list returned by validate
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSessions, setActiveSessions] = useState<Device[]>([]);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") router.push("/");
      return;
    }

    (async () => {
      setError(null);
      try {
        // 1) call validate
        const deviceId = getOrCreateDeviceId();
        const v = await safeFetchJson("/api/device-sessions/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });

        if (!v.valid) {
          // show modal listing active sessions (from server)
          setActiveSessions(v.activeSessions ?? []);
          setModalOpen(true);
          return;
        }

        // valid -> fetch profile
        const profile = await safeFetchJson("/api/profile");
        setPhone(profile?.phone ?? "");
      } catch (err: any) {
        console.error("Dashboard init error:", err);
        setError(err?.message ?? "Failed to initialize dashboard");
      }
    })();
  }, [status]);

  async function handleForceLogout(ids: string[]) {
    setBusy(true);
    setError(null);
    try {
      // call revoke (PUT on /api/device-sessions with ids)
      const res = await safeFetchJson("/api/device-sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      // server returns activeSessions — update it
      setActiveSessions(res.activeSessions ?? []);
      setMessage("Selected devices logged out. Completing login…");
      setModalOpen(false);

      // re-run validate to create this session (or confirm)
      const deviceId = getOrCreateDeviceId();
      const v = await safeFetchJson("/api/device-sessions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      if (v.valid) {
        const profile = await safeFetchJson("/api/profile");
        setPhone(profile?.phone ?? "");
        setMessage("Logged in successfully");
      } else {
        // if still not valid, reopen modal or show error
        setActiveSessions(v.activeSessions ?? []);
        setModalOpen(true);
        setError("Could not create session after revoking; please try again or cancel login.");
      }
    } catch (err: any) {
      console.error("Force logout error:", err);
      setError(err?.message ?? "Failed to revoke devices");
    } finally {
      setBusy(false);
      setTimeout(() => setMessage(""), 2500);
    }
  }

  async function savePhone(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await safeFetchJson("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setMessage("Saved");
    } catch (err: any) {
      setError(err?.message ?? "Failed to save phone");
    } finally {
      setBusy(false);
      setTimeout(() => setMessage(""), 2000);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5EB]">
        <div className="animate-pulse text-gray-700">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5EB]">
        <div className="text-center text-gray-700">Please login from the home page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5EB] pb-12">
      <ForceLogoutModal
        open={modalOpen}
        sessions={activeSessions}
        onClose={() => {
          // Cancel login: sign out / send user back to home
          setModalOpen(false);
          signOut({ callbackUrl: "/" });
        }}
        onForceLogout={async (ids) => {
          await handleForceLogout(ids);
        }}
      />

      <header className="border-b bg-white/60 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg transform rotate-45" />
            <div>
              <div className="text-lg font-bold">Minerva</div>
              <div className="text-xs text-gray-500">Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700 hidden sm:block">{session.user?.email}</div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="px-4 py-2 rounded-full border bg-white hover:bg-gray-50 text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#FFD93D] flex items-center justify-center text-2xl">
              {session.user?.name?.split(" ").map((n: string) => n?.[0]).slice(0, 2).join("") || "U"}
            </div>
            <div>
              <div className="text-lg font-bold">{session.user?.name}</div>
              <div className="text-sm text-gray-500">{session.user?.email}</div>
            </div>
          </div>

          <form onSubmit={savePhone} className="mt-6">
            <label className="block text-sm text-gray-600 mb-1">Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#6BCB77]" />
            <div className="flex items-center gap-3">
              <button type="submit" disabled={busy} className="px-4 py-2 rounded-full bg-[#6BCB77] text-white">{busy ? "Saving…" : "Save"}</button>
              {message && <div className="text-sm text-green-600">{message}</div>}
              {error && <div className="text-sm text-red-600 ml-3">{error}</div>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
