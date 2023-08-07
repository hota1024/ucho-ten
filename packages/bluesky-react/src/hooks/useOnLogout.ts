import { useEffect } from "react";
import { useClient } from "./useClient";

export interface UseOnLogoutHandler {
  (): void;
}

export function useOnLogout(handler: UseOnLogoutHandler) {
  const client = useClient();

  useEffect(() => {
    const unsubscribe = client.onLogout(() => {
      handler();
    });

    return () => unsubscribe();
  }, [client]);
}
