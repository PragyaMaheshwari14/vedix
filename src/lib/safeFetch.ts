// lib/safeFetch.ts
export async function safeFetchJson(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    const summary = text.length > 400 ? text.slice(0, 400) + "..." : text;
    throw new Error(`Server returned non-JSON (${res.status}): ${summary}`);
  }

  const data = await res.json();
  if (!res.ok) {
    const err = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(err);
  }
  return data;
}
