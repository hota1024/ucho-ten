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
  theme: {
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
  }
})
export function Providers({ children }: { children: React.ReactNode }) {
  const { isBrowser } = useSSR()
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false)
  const darkMode = useDarkMode(false);

  useEffect(() => {
    // you can use any storage
    let theme = window.localStorage.getItem('data-theme');
    setIsDark(theme === 'dark');

    const observer = new MutationObserver((mutation) => {
      let newTheme = getDocumentTheme(document?.documentElement);
      setIsDark(newTheme === 'dark');
    });

    // Observe the document theme changes
    observer.observe(document?.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style']
    });

    return () => observer.disconnect();
  }, []);

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
