import { useContext } from "react";

import { BlueskyContext } from "@/context";
import { BlueskyContextIsNotProvidedError } from "@/errors";

/**
 * returns bluesky-react `Client` instance of current context.
 *
 * @returns `Client` instance.
 */
export function useClient() {
  const { client } = useContext(BlueskyContext);

  if (client) {
    return client;
  }

  throw new BlueskyContextIsNotProvidedError();
}
