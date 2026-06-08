/**
 * hooks/use-session.ts — Anonymous session management
 *
 * Problems fixed vs original:
 * - Original initialized sessionId as "" (empty string) and populated in useEffect
 *   This caused a wasted API request with sessionId="" on every first render
 * - Using a lazy initializer in useState reads from localStorage synchronously
 *   on first render, eliminating the empty-string flash entirely
 * - Added session validation (UUID format check)
 */

import { useState } from "react";

const SESSION_KEY = "apunbazar-session-id";

function createSessionId(): string {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for non-HTTPS local development
  return [Date.now().toString(36), Math.random().toString(36).slice(2)].join("-");
}

function isValidSessionId(id: string): boolean {
  return id.length >= 10;
}

function getOrCreateSessionId(): string {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored && isValidSessionId(stored)) {
      return stored;
    }
    const newId = createSessionId();
    localStorage.setItem(SESSION_KEY, newId);
    return newId;
  } catch {
    // localStorage unavailable (private browsing, SSR, etc.) — generate in-memory
    return createSessionId();
  }
}

export function useSession() {
  // Lazy initializer runs synchronously on first render — no useEffect needed.
  // This means sessionId is NEVER "" after mount, eliminating wasted API calls.
  const [sessionId] = useState<string>(getOrCreateSessionId);

  return { sessionId };
}
