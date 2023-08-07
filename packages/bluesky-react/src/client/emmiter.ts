export interface EventUnsubscribe {
  (): void;
}

export type EventHandler<T = void> = T extends void
  ? {
      (): void;
    }
  : {
      (data: T): void;
    };

export class Emitter<T> {
  #handlers = new Map<symbol, EventHandler<T>>();

  emit(data: T) {
    for (const [_, handler] of this.#handlers) {
      try {
        handler(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  on(handler: EventHandler<T>): EventUnsubscribe {
    const key = Symbol(`handler#${this.#handlers.size}`);

    this.#handlers.set(key, handler);

    return () => {
      this.#handlers.delete(key);
    };
  }
}
