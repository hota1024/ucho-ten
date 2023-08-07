import {
  BlueskyProvider,
  useLocalStorageManager,
  usePersistSession,
  useSession,
} from "bluesky-react";
import { Alert, DebugMenu } from "../components/DebugMenu";

function BlueskyContextUser(props: React.PropsWithChildren) {
  const { children } = props;

  console.log("----------------------------");

  return (
    <div style={{ minHeight: 100 }}>
      <DebugMenu />
      {children}
    </div>
  );
}

function BlueskyContextUserAuthRequired(props: React.PropsWithChildren) {
  const { children } = props;
  const { confirmed } = usePersistSession(useLocalStorageManager());
  const { session } = useSession();

  if (!confirmed) {
    return "confirming...";
  }

  if (!session) {
    return (
      <div style={{ minHeight: 100 }}>
        <DebugMenu />
        <Alert>
          <div>This example required authentication.</div>
          <div>
            <a href="/?path=/story/hooks-usesession--use-persist-session">
              To use this example, login here.
            </a>
          </div>
        </Alert>
      </div>
    );
  }

  console.log("----------------------------");

  return (
    <div style={{ minHeight: 100 }}>
      <DebugMenu />
      {children}
    </div>
  );
}

export function provideBlueskyContext(
  story: React.ReactNode,
  { requiredAuth }: { requiredAuth?: boolean; storeSession?: boolean } = {
    requiredAuth: false,
    storeSession: false,
  }
) {
  return (
    <BlueskyProvider service="https://bsky.social">
      {requiredAuth ? (
        <BlueskyContextUserAuthRequired>{story}</BlueskyContextUserAuthRequired>
      ) : (
        <BlueskyContextUser>{story}</BlueskyContextUser>
      )}
    </BlueskyProvider>
  );
}
