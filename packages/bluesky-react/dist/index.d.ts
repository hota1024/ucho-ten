import * as _atproto_api from '@atproto/api';
import { BskyAgent, AtpSessionData, AtpAgentLoginOpts } from '@atproto/api';
import * as react from 'react';
import react__default from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface EventUnsubscribe {
    (): void;
}
interface EventHandler<T> {
    (data: T): void;
}

interface ClientInterface {
    /**
     * `BskyAgent` instance of `@atproto/api`
     */
    readonly agent: BskyAgent;
    /**
     * subscribe session change.
     */
    onSessionChanged(handler: EventHandler<AtpSessionData | null>): EventUnsubscribe;
    /**
     * login with credentials.
     *
     * @param opts `AtpAgentLoginOpts`
     */
    login(opts: AtpAgentLoginOpts): Promise<AtpSessionData>;
    /**
     * logout.
     */
    logout(): void;
}

declare class Client implements ClientInterface {
    #private;
    readonly agent: BskyAgent;
    /**
     * @param agent `BskyAgent` instance of `@atproto/api`
     */
    constructor(agent: BskyAgent);
    onSessionChanged(handler: EventHandler<AtpSessionData | null>): EventUnsubscribe;
    login(opts: AtpAgentLoginOpts): Promise<AtpSessionData>;
    logout(): void;
}

interface BlueskyContextData {
    client?: Client;
}
declare const defaultData: BlueskyContextData;

declare const BlueskyContext: react.Context<BlueskyContextData>;

interface BlueskyProviderProps extends react__default.PropsWithChildren {
    /**
     * URL of atproto service.
     */
    service: string | URL;
}
declare function BlueskyProvider(props: BlueskyProviderProps): react_jsx_runtime.JSX.Element;

declare function useClient(): Client;

type AuthState = "logging-in" | "logged-in" | "logging-out" | "logged-out";

/**
 * returns shared session data and login function.
 *
 * @returns `AtpSessionData` with login, logout methods.
 */
declare function useSession(): {
    login: (opts: AtpAgentLoginOpts) => Promise<_atproto_api.AtpSessionData>;
    logout: () => Promise<void>;
    session: _atproto_api.AtpSessionData | null;
    authState: AuthState;
};
/**
 * returns shared persist session data and login function.
 *
 * @returns `AtpSessionData` with login, logout methods.
 */
declare function usePersistSession(): {
    login: (opts: AtpAgentLoginOpts) => Promise<_atproto_api.AtpSessionData>;
    logout: () => Promise<void>;
    session: _atproto_api.AtpSessionData | null;
    authState: AuthState;
};

declare class BlueskyReactError extends Error {
    constructor(message: string);
}
declare class BlueskyContextIsNotProvidedError extends BlueskyReactError {
    constructor();
}
declare class InvalidIdentifierOrPassword extends BlueskyReactError {
    constructor();
}

export { BlueskyContext, BlueskyContextData, BlueskyContextIsNotProvidedError, BlueskyProvider, BlueskyProviderProps, BlueskyReactError, Client, ClientInterface, InvalidIdentifierOrPassword, defaultData, useClient, usePersistSession, useSession };
