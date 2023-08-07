import { useEffect } from "react";
import { useClient } from "./useClient";
import { AtpSessionData } from "@atproto/api";

export interface UseOnLoginHandler {
  (session: AtpSessionData): void;
}

export function useOnLogin(handler: UseOnLoginHandler) {
  const client = useClient();

  useEffect(() => {
    const unsubscribe = client.onLogin((session) => {
      handler(session);
    });

    return () => unsubscribe();
  }, [client]);
}
