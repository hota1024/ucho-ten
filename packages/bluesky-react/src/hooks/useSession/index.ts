import type { AtpSessionData } from "@atproto/api";
import { useEffect, useState } from "react";

import type { AuthState } from "@/client";
import { useClient } from "@/hooks";

import type { UseSessionReturn } from "./type";

/**
 * returns shared session data and login function.
 */
export function useSession(): UseSessionReturn {
  // shared states //
  const client = useClient();

  // local states //
  const [session, setSession] = useState<AtpSessionData | null>(client.session);
  const [authState, setAuthState] = useState<AuthState>("logged-out");

  // effects //
  useEffect(() => {
    const handleSessionChanged = (session: AtpSessionData) => {
      setSession(session);
    };
    const handleAuthStateChanged = (authState: AuthState) => {
      setAuthState(authState);
    };

    const unsubscribeSessionChange =
      client.eventSessionChanged.subscribe(handleSessionChanged);
    const unsubscribeAuthStateChange = client.eventAuthStateChanged.subscribe(
      handleAuthStateChanged
    );

    return () => {
      unsubscribeSessionChange();
      unsubscribeAuthStateChange();
    };
  }, [client.eventAuthStateChanged, client.eventSessionChanged]);

  return {
    login: client.login.bind(client),
    logout: client.logout.bind(client),
    resumeSession: client.resumeSession.bind(client),
    session,
    authState,
  };
}
