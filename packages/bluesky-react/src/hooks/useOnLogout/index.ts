import { useClient } from "@/hooks";
import { UseOnLogoutHandler } from "./type";
import { useEffect } from "react";

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
