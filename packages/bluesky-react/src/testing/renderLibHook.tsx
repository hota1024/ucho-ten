/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Queries,
  queries,
  RenderHookOptions,
  RenderHookResult,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import { BlueskyProvider } from "@/context";

export function renderBlueskyHook<
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  render: (initialProps: Props) => Result,
  service: string,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>
): RenderHookResult<Result, Props> {
  return renderHook(render, {
    wrapper({ children }) {
      const result = (
        <BlueskyProvider service={service}>{children}</BlueskyProvider>
      );

      if (typeof options?.wrapper === "function") {
        return (options.wrapper as any)({ children: result });
      }

      return result;
    },
  });
}

export function renderLibHooks<
  T extends object,
  R = {
    [K in keyof T]: () => T[K];
  }
>(render: () => T, service: string): R {
  const { result } = renderBlueskyHook(() => render() as any, service);
  const getters: any = {};

  for (const [key] of Object.entries(result.current as any)) {
    getters[key as keyof T] = () => (result.current as any)[key];
  }

  return getters;
}
