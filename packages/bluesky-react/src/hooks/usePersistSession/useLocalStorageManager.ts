import { PersistSessionManager } from "./type";

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
