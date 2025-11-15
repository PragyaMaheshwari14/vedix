
export function getOrCreateDeviceId() {
  if (typeof window === "undefined") return null;
  let d = localStorage.getItem("deviceId");
  if (!d) {
    d = crypto.randomUUID();
    localStorage.setItem("deviceId", d);
  }
  return d;
}
