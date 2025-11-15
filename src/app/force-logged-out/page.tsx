// app/force-logged-out/page.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ForceLoggedOut() {
  const router = useRouter();

  useEffect(() => {
    // Ensure token/cookies cleared
    (async () => {
      await signOut({ redirect: false });
    })();

    // After a short moment, show the message and let user go back to home
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5EB] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-2">You were signed out</h1>
        <p className="text-gray-700 mb-6">Your session was ended because your account was used to sign in on another device.</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => router.push("/")} className="px-4 py-2 rounded-full bg-[#6BCB77] text-white">Go to Home</button>
          <button onClick={() => router.push("/")} className="px-4 py-2 rounded-full bg-gray-100">Sign in again</button>
        </div>
      </div>
    </div>
  );
}
