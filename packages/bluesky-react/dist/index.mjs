var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

// src/client/emmiter.ts
var _handlers;
var Emitter = class {
  constructor() {
    __privateAdd(this, _handlers, new Map());
  }
  emit(data) {
    for (const [_, handler] of __privateGet(this, _handlers)) {
      try {
        handler(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
  on(handler) {
    const key = Symbol();
    __privateGet(this, _handlers).set(key, handler);
    return () => {
      __privateGet(this, _handlers).delete(key);
    };
  }
};
_handlers = new WeakMap();

// src/errors/errors.ts
var BlueskyReactError = class extends Error {
  constructor(message) {
    super(`[bluesky-react] ${message}`);
  }
};
var BlueskyContextIsNotProvidedError = class extends BlueskyReactError {
  constructor() {
    super("BlueskyContext is not provided in current context. Please use <BlueskyProvider ... /> in your code.");
  }
};
var InvalidIdentifierOrPassword = class extends BlueskyReactError {
  constructor() {
    super("Invalid identifier or password");
  }
};

// src/client/client.ts
var _eventSessionChanged;
var Client = class {
  constructor(agent) {
    this.agent = agent;
    __privateAdd(this, _eventSessionChanged, new Emitter());
  }
  onSessionChanged(handler) {
    return __privateGet(this, _eventSessionChanged).on(handler);
  }
  async login(opts) {
    try {
      const { data } = await this.agent.login(opts);
      __privateGet(this, _eventSessionChanged).emit(data);
      return data;
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid identifier or password") {
        throw new InvalidIdentifierOrPassword();
      } else {
        throw error;
      }
    }
  }
  logout() {
    this.agent.session = void 0;
    __privateGet(this, _eventSessionChanged).emit(null);
  }
};
_eventSessionChanged = new WeakMap();

// src/context/context.tsx
import { createContext } from "react";

// src/context/data.ts
var defaultData = {};

// src/context/context.tsx
var BlueskyContext = createContext(defaultData);

// src/context/provider.tsx
import React, { useState } from "react";
import { BskyAgent } from "@atproto/api";
function BlueskyProvider(props) {
  const { children, service } = props;
  const [client] = useState(() => new Client(new BskyAgent({ service })));
  return /* @__PURE__ */ React.createElement(BlueskyContext.Provider, {
    value: { client }
  }, children);
}

// src/hooks/useClient.ts
import { useContext } from "react";
function useClient() {
  const { client } = useContext(BlueskyContext);
  if (client) {
    return client;
  }
  throw new BlueskyContextIsNotProvidedError();
}

// src/hooks/useSession.ts
import { useCallback, useEffect } from "react";

// src/states/session.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
var useSessionStore = create((set) => ({
  session: null,
  authState: "logged-out",
  setSession: (session) => set({ session }),
  setAuthState: (state) => set({ authState: state })
}));
var useLocalStorageSession = create(persist((set) => ({
  session: null,
  authState: "logged-out",
  setSession: (session) => set({ session }),
  setAuthState: (state) => set({ authState: state })
}), {
  name: "bluesky-react-session-storage"
}));

// src/hooks/useSession.ts
function useSessionOfStore(useStore) {
  const client = useClient();
  const { session, setSession, authState, setAuthState } = useStore();
  useEffect(() => {
    const unsubscribe = client.onSessionChanged((session2) => {
      setSession(session2);
    });
    return () => unsubscribe();
  }, [client]);
  const login = useCallback(async (opts) => {
    setAuthState("logging-in");
    try {
      const result = await client.login(opts);
      setAuthState("logged-in");
      return result;
    } catch (error) {
      if (error instanceof InvalidIdentifierOrPassword) {
        setAuthState("logged-out");
      }
      throw error;
    }
  }, [client]);
  const logout = useCallback(async () => {
    setAuthState("logging-out");
    const result = await client.logout();
    setAuthState("logged-out");
    return result;
  }, [client]);
  return { login, logout, session, authState };
}
function useSession() {
  return useSessionOfStore(useSessionStore);
}
function usePersistSession() {
  return useSessionOfStore(useLocalStorageSession);
}
export {
  BlueskyContext,
  BlueskyContextIsNotProvidedError,
  BlueskyProvider,
  BlueskyReactError,
  Client,
  InvalidIdentifierOrPassword,
  defaultData,
  useClient,
  usePersistSession,
  useSession
};
