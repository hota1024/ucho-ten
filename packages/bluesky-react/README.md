# bluesky-react

bluesky-react is an experimental Bluesky client library for React.

## Usage

```tsx
import { BlueskyProvider } from 'bluesky-react'

function App({ children }) {
  return (
    <BlueskyProvider service="https://bsky.social">
      {children}
    </BlueskyProvider>
  )
}
```
