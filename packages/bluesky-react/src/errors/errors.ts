export class BlueskyReactError extends Error {
  constructor(message: string) {
    super(`[bluesky-react] ${message}`);
  }
}

export class BlueskyContextIsNotProvidedError extends BlueskyReactError {
  constructor() {
    super(
      "BlueskyContext is not provided in current context. Please use <BlueskyProvider ... /> in your code."
    );
  }
}

export class InvalidIdentifierOrPassword extends BlueskyReactError {
  constructor() {
    super("Invalid identifier or password");
  }
}
