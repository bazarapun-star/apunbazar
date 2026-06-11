
import { useState, useEffect } from "react";

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("apunbazar_session_id");
    if (!id) {
      id = generateSessionId();
      localStorage.setItem("apunbazar_session_id", id);
    }
    setSessionId(id);
  }, []);

  return { sessionId };
}