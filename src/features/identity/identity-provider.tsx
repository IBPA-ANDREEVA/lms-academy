"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser, type CurrentUser } from "./api";

type IdentityState = {
  user: CurrentUser | null;
  loading: boolean;
  unavailable: boolean;
};
const IdentityContext = createContext<
  IdentityState & { refresh: () => Promise<CurrentUser | null> }
>({
  user: null,
  loading: false,
  unavailable: false,
  refresh: async () => null,
});

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IdentityState>({
    user: null,
    loading: true,
    unavailable: false,
  });
  const request = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const user = await getCurrentUser(controller.signal);
      if (!controller.signal.aborted)
        setState({ user, loading: false, unavailable: false });
      return user;
    } catch (error) {
      if (!controller.signal.aborted) {
        const unavailable = !(
          error instanceof ApiError && error.status === 401
        );
        setState({ user: null, loading: false, unavailable });
        if (unavailable) throw error;
      }
      return null;
    }
  }, []);
  useEffect(() => {
    const recheck = () => {
      if (document.visibilityState === "visible")
        void refresh().catch(() => {});
    };
    recheck();
    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", recheck);
    return () => {
      request.current?.abort();
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", recheck);
    };
  }, [refresh]);
  return (
    <IdentityContext value={{ ...state, refresh }}>{children}</IdentityContext>
  );
}
export const useIdentity = () => useContext(IdentityContext);
