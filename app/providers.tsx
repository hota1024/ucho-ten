'use client'
import { useServerInsertedHTML } from 'next/navigation'
import { useEffect, useState } from 'react';
import {
  CssBaseline,
  globalCss,
  NextUIProvider,
  createTheme,
  getDocumentTheme,
  useSSR,
} from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as JotaiProvider } from 'jotai'
import "./i18n/config"; //i18
import useDarkMode from 'use-dark-mode';


const lightTheme = createTheme({
  type: 'light',
})

const darkTheme = createTheme({
  type: "dark",
})
export function Providers({ children }: { children: React.ReactNode }) {
  const { isBrowser } = useSSR()
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false)
  const darkMode = useDarkMode(false);

  useServerInsertedHTML(() => {
    return <>{CssBaseline.flush()}</>
  })

  return isBrowser ? (
    <JotaiProvider>
      <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
        {children}
      </NextUIProvider>
    </JotaiProvider>
  ) : (
    <></>
  )
}
