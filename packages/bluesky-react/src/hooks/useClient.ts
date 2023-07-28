import { useContext } from "react";
import { BlueskyContext } from "../context";
import { BlueskyContextIsNotProvidedError } from "../errors";

export function useClient() {
  const { client } = useContext(BlueskyContext);

  if (client) {
    return client;
  }

  throw new BlueskyContextIsNotProvidedError();
}
