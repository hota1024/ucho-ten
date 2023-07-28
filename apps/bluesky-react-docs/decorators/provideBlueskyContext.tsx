import { BlueskyProvider } from "bluesky-react";
import { DebugMenu } from "./DebugMenu";

export function provideBlueskyContext(story: React.ReactNode) {
  return (
    <BlueskyProvider service="https://bsky.social">
      <div style={{ minHeight: 100 }}>
        <DebugMenu />
        {story}
      </div>
    </BlueskyProvider>
  );
}
