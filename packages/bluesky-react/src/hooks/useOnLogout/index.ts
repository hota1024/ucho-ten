import { useEffect } from "react";

import { useClient } from "@/hooks";

import type { UseOnLogoutHandler } from "./type";

/**
 * calls handler function when user logged out.
 *
 * @param handler `UseOnLogoutHandler`
 */
export function useOnLogout(handler: UseOnLogoutHandler) {
  // shared states/
  const client = useClient();

  // effects //
  useEffect(() => {
    const unsubscribe = client.eventOnLogout.subscribe(() => {
      handler();
    });

    return () => unsubscribe();
  }, [client, handler]);
}
