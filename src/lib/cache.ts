/**
 * Global in-memory cache shared across all requests on the same server instance.
 * This means 1 Gemini API call serves ALL users for 30 minutes.
 */

interface CacheEntry {
  data: any;
  timestamp: number;
}

const globalCache: Record<string, CacheEntry> = {};
const TTL = 30 * 60 * 1000; // 30 minutes

export function getCached(key: string): any | null {
  const entry = globalCache[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL) {
    delete globalCache[key];
    return null;
  }
  return entry.data;
}

export function setCached(key: string, data: any) {
  globalCache[key] = { data, timestamp: Date.now() };
}

export function getCacheAge(key: string): number {
  const entry = globalCache[key];
  if (!entry) return -1;
  return Math.floor((Date.now() - entry.timestamp) / 1000 / 60); // minutes
}
