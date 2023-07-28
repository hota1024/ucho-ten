var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
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

// src/index.tsx
__export(exports, {
  BlueskyContext: () => BlueskyContext,
  BlueskyContextIsNotProvidedError: () => BlueskyContextIsNotProvidedError,
  BlueskyProvider: () => BlueskyProvider,
  BlueskyReactError: () => BlueskyReactError,
  Client: () => Client,
  InvalidIdentifierOrPassword: () => InvalidIdentifierOrPassword,
  defaultData: () => defaultData,
  useClient: () => useClient,
  usePersistSession: () => usePersistSession,
  useSession: () => useSession
});

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
var import_react = __toModule(require("react"));

// src/context/data.ts
var defaultData = {};

// src/context/context.tsx
var BlueskyContext = (0, import_react.createContext)(defaultData);

// src/context/provider.tsx
var import_react2 = __toModule(require("react"));
var import_api = __toModule(require("@atproto/api"));
function BlueskyProvider(props) {
  const { children, service } = props;
  const [client] = (0, import_react2.useState)(() => new Client(new import_api.BskyAgent({ service })));
  return /* @__PURE__ */ import_react2.default.createElement(BlueskyContext.Provider, {
    value: { client }
  }, children);
}

// src/hooks/useClient.ts
var import_react3 = __toModule(require("react"));
function useClient() {
  const { client } = (0, import_react3.useContext)(BlueskyContext);
  if (client) {
    return client;
  }
  throw new BlueskyContextIsNotProvidedError();
}

// src/hooks/useSession.ts
var import_react4 = __toModule(require("react"));

// src/states/session.ts
var import_zustand = __toModule(require("zustand"));
var import_middleware = __toModule(require("zustand/middleware"));
var useSessionStore = (0, import_zustand.create)((set) => ({
  session: null,
  authState: "logged-out",
  setSession: (session) => set({ session }),
  setAuthState: (state) => set({ authState: state })
}));
var useLocalStorageSession = (0, import_zustand.create)((0, import_middleware.persist)((set) => ({
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
  (0, import_react4.useEffect)(() => {
    const unsubscribe = client.onSessionChanged((session2) => {
      setSession(session2);
    });
    return () => unsubscribe();
  }, [client]);
  const login = (0, import_react4.useCallback)(async (opts) => {
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
  const logout = (0, import_react4.useCallback)(async () => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
