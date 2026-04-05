import { useCallback, useEffect, useState } from "react";
import { createUser } from "../lib/api";

const KEY = "healthsync_user_id";

export function useClientId() {
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const ensureUser = useCallback(async () => {
    setError(null);
    const existing = localStorage.getItem(KEY);
    if (existing) {
      setUserId(existing);
      setReady(true);
      return existing;
    }
    const { id } = await createUser();
    localStorage.setItem(KEY, id);
    setUserId(id);
    setReady(true);
    return id;
  }, []);

  useEffect(() => {
    ensureUser().catch((e) => {
      setError(e.message || "Session error");
      setReady(true);
    });
  }, [ensureUser]);

  return { userId, ready, error, ensureUser };
}
