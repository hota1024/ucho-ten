import { useCallback, useEffect, useState } from "react";
import { useClient } from "./useClient";
import { AtpAgentLoginOpts, AtpSessionData } from "@atproto/api";
import { AuthState } from "../client";
import { useOnLogin } from "./useOnLogin";
import { useOnLogout } from "./useOnLogout";

/**
 * returns shared session data and login function.
 */
export function useSession() {
  const client = useClient();
  const [session, setSession] = useState<AtpSessionData | null>(client.session);
  const [authState, setAuthState] = useState<AuthState>("logged-out");

  useEffect(() => {
    const handleSessionChanged = (session: AtpSessionData) => {
      setSession(session);
    };
    const handleAuthStateChanged = (authState: AuthState) => {
      setAuthState(authState);
    };

    const unsubscribeSessionChange =
      client.onSessionChanged(handleSessionChanged);

    const unsubscribeAuthStateChange = client.onAuthStateChanged(
      handleAuthStateChanged
    );

    return () => {
      unsubscribeSessionChange();
      unsubscribeAuthStateChange();
    };
  }, []);

  const login = useCallback(
    async (opts: AtpAgentLoginOpts) => {
      return client.login(opts);
    },
    [client]
  );

  const logout = useCallback(async () => {
    return client.logout();
  }, [client]);

  return {
    login,
    logout,
    resumeSession: client.resumeSession.bind(client),
    session,
    authState,
  };
}

/**
 * PersistSessionManager interface.
 */
export interface PersistSessionManager {
  /**
   * store session.
   *
   * @param session `AtpSessionData`
   */
  store(session: AtpSessionData): void;

  /**
   * resume session, if returns session.
   */
  resume(): AtpSessionData | void | null;

  /**
   * remove session.
   */
  remove(): void;
}

/**
 * use persist session.
 *
 * @param manager persist session manager.
 */
export function usePersistSession(manager: PersistSessionManager) {
  const { resumeSession } = useSession();
  const [confirmed, setConfirmed] = useState(false);

  useOnLogin((session) => {
    manager.store(session);
  });

  useOnLogout(() => {
    manager.remove();
  });

  useEffect(() => {
    const session = manager.resume();

    if (session) {
      resumeSession(session).then(() => {
        setConfirmed(true);
      });
    } else {
      setConfirmed(true);
    }
  }, []);

  return { confirmed };
}

/**
 * returns persist session manager that uses localStorage.
 *
 * @param key item key to store session data.
 * @returns `PersistSessionManager` that uses localStorage.
 */
export function useLocalStorageManager(
  key: string = "bluesky-react/session"
): PersistSessionManager {
  return {
    store(session) {
      localStorage.setItem(key, JSON.stringify(session));
    },
    resume() {
      const item = localStorage.getItem(key);

      if (item) {
        return JSON.parse(item);
      }
    },
    remove() {
      localStorage.removeItem(key);
    },
  };
}
