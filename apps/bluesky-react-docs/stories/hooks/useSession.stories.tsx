import type { Meta, StoryObj } from "@storybook/react";
import { provideBlueskyContext } from "../../decorators/provideBlueskyContext";
import { usePersistSession, useSession } from "bluesky-react";
import { useState } from "react";

const meta = {
  title: "hooks/useSession",
  decorators: [(Story) => provideBlueskyContext(<Story />)],
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Demo: Story = {
  args: {},
  render() {
    const { login, logout, session, authState } = useSession();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<Error>();

    const handleLoginClick = async () => {
      try {
        await login({ identifier, password });
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      }
    };

    return (
      <div>
        <div>Auth state: {authState}</div>
        {session ? (
          <div>
            <div>
              Logged-in as {session.handle} ({session.did})
            </div>
            <div>
              <button onClick={() => logout()}>logout</button>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                placeholder="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={authState === "logging-in"}
              />
              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authState === "logging-in"}
              />
              <button
                onClick={handleLoginClick}
                disabled={authState === "logging-in"}
              >
                {authState === "logging-in" ? "logging-in..." : "login"}
              </button>
            </form>
            <div style={{ color: "red" }}>{error?.message}</div>
          </div>
        )}
      </div>
    );
  },
};

export const UsePersistSession: Story = {
  name: "usePersistSession",
  args: {},
  render() {
    const { login, logout, session, authState } = usePersistSession();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<Error>();

    const handleLoginClick = async () => {
      try {
        await login({ identifier, password });
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      }
    };

    return (
      <div>
        <div>This example stores your session data to localStorage</div>
        <div>Auth state: {authState}</div>
        {session ? (
          <div>
            <div>
              Logged-in as {session.handle} ({session.did})
            </div>
            <div>
              <button onClick={() => logout()}>logout</button>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                placeholder="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={authState === "logging-in"}
              />
              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authState === "logging-in"}
              />
              <button
                onClick={handleLoginClick}
                disabled={authState === "logging-in"}
              >
                {authState === "logging-in" ? "logging-in..." : "login"}
              </button>
            </form>
            <div style={{ color: "red" }}>{error?.message}</div>
          </div>
        )}
      </div>
    );
  },
};
