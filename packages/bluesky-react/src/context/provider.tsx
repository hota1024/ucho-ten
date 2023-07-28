import React, { useState } from "react";
import { BlueskyContext } from "./context";
import { BskyAgent } from "@atproto/api";
import { Client } from "../client";

export interface BlueskyProviderProps extends React.PropsWithChildren {
  /**
   * URL of atproto service.
   */
  service: string | URL;
}

export function BlueskyProvider(props: BlueskyProviderProps) {
  const { children, service } = props;

  const [client] = useState(() => new Client(new BskyAgent({ service })));

  return (
    <BlueskyContext.Provider value={{ client }}>
      {children}
    </BlueskyContext.Provider>
  );
}
