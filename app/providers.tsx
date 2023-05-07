'use client'

import { useServerInsertedHTML } from 'next/navigation'

import {
  CssBaseline,
  globalCss,
  NextUIProvider,
  useSSR,
} from '@nextui-org/react'
import { Provider as JotaiProvider } from 'jotai'

export function Providers({ children }: { children: React.ReactNode }) {
  const { isBrowser } = useSSR()

  useServerInsertedHTML(() => {
    return <>{CssBaseline.flush()}</>
  })

  return isBrowser ? (
    <JotaiProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </JotaiProvider>
  ) : (
    <></>
  )
}
