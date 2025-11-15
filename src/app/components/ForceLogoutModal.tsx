"use client";

import React, { useState } from "react";

type Device = {
  _id: string;
  deviceId: string;
  userAgent?: string;
  createdAt?: string;
  lastSeenAt?: string;
};

export default function ForceLogoutModal({
  open,
  sessions,
  onClose,
  onForceLogout,
}: {
  open: boolean;
  sessions: Device[];
  onClose: () => void;
  onForceLogout: (ids: string[]) => Promise<void>;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  async function handleForce() {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (!ids.length) return alert("Select at least one device to force logout.");
    if (!confirm(`Force logout ${ids.length} device(s)?`)) return;
    setBusy(true);
    try {
      await onForceLogout(ids);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Too many active devices</h3>
        <p className="text-sm text-gray-600 mb-4">
          You are already signed in on 3 devices. Choose older devices to force logout, or cancel.
        </p>

        <div className="max-h-64 overflow-auto mb-4">
          {sessions.length === 0 ? (
            <div className="text-sm text-gray-500">No active sessions found.</div>
          ) : (
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s._id} className="p-3 rounded-lg bg-gray-50 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{s.userAgent ?? s.deviceId}</div>
                    <div className="text-xs text-gray-500">
                      {s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleString() : s.createdAt ? new Date(s.createdAt).toLocaleString() : "Unknown"}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!selected[s._id]} onChange={() => toggle(s._id)} />
                    Select
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-100">Cancel login</button>
          <button
            onClick={handleForce}
            disabled={busy}
            className="px-4 py-2 rounded-full bg-red-600 text-white"
          >
            {busy ? "Working…" : "Force logout selected"}
          </button>
        </div>
      </div>
    </div>
  );
}
