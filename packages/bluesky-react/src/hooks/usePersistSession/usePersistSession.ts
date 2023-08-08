import { useEffect, useState } from "react";

import { useOnLogin, useOnLogout, useSession } from "@/hooks";

import type { PersistSessionManager, UsePersistSessionReturn } from "./type";

/**
 * use persist session.
 *
 * @param manager persist session manager.
 */
export function usePersistSession(
  manager: PersistSessionManager
): UsePersistSessionReturn {
  // shared states //
  const { resumeSession } = useSession();

  // local states//
  const [confirmed, setConfirmed] = useState(false);

  // effects //
  useOnLogin((session) => {
    manager.store(session);
  });

  useOnLogout(() => {
    manager.remove();
  });

  useEffect(() => {
    const session = manager.resume();

    if (session) {
      resumeSession(session).finally(() => {
        setConfirmed(true);
      });
    } else {
      setConfirmed(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { confirmed };
}
