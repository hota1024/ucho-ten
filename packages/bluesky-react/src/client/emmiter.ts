export interface EventUnsubscribe {
  (): void;
}

export interface EventHandler<T> {
  (data: T): void;
}

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
    const key = Symbol();

    this.#handlers.set(key, handler);

    return () => {
      this.#handlers.delete(key);
    };
  }
}
