import { useEffect } from "react";

import { useClient } from "@/hooks";

import type { UseOnLoginHandler } from "./type";

/**
 * calls handler function when user logged in.
 *
 * @param handler `UseOnLoginHandler`
 */
export function useOnLogin(handler: UseOnLoginHandler) {
  // shared states //
  const client = useClient();

  // effects //
  useEffect(() => {
    const unsubscribe = client.eventOnLogin.subscribe((session) => {
      handler(session);
    });

    return () => unsubscribe();
  }, [client, handler]);
}