'use client'
import {
  CssBaseline,
  globalCss,
  NextUIProvider,
  useSSR,
  createTheme,
} from '@nextui-org/react'
import { Provider as JotaiProvider } from 'jotai'
import { useServerInsertedHTML } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useAppearanceColorMode } from '@/atoms/settings'
import {useEffect, useState} from 'react'
import useDarkMode from 'use-dark-mode';


export function Providers({ children }: { children: React.ReactNode }) {
  const { isBrowser } = useSSR()
  const [appearanceColorMode, setAppearanceColorMode] = useState<string>('')
  const [isBrowserDarkMode, setIsBrowserDarkMode] = useState<boolean>(false)


  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setAppearanceColorMode(localStorage.getItem('appearanceColorMode') || 'system')
        setIsBrowserDarkMode(matchMedia('(prefers-color-scheme: dark)').matches)
      } catch (error) {
        // エラーハンドリング
      }
    }
  }, [])

  let cookieMemory
  let localMemory
  let modeMemory
  if(process.browser){
    cookieMemory = document.cookie
    localMemory = localStorage.getItem('appearanceColorMode') || 'system'
    modeMemory = matchMedia('(prefers-color-scheme: dark)').matches
  }

  console.log(cookieMemory)
  console.log(localMemory)
  console.log(modeMemory)

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


  useServerInsertedHTML(() => {
    return <>{CssBaseline.flush()}</>
  })

  return isBrowser ? (
      <JotaiProvider>
        <NextThemesProvider
            defaultTheme={localMemory === '"dark"' ? darkTheme : (localMemory === '"light"' ? lightTheme : 'system')}
            //defaultTheme={'system'}
            //themes={appearanceColorMode === '"dark"' ? [darkTheme] : [lightTheme]}
            //forcedTheme={appearanceColorMode === '"dark"' ? 'darkTheme' : (appearanceColorMode === '"light"' ? lightTheme : (appearanceColorMode === '"system"' && darkMode.value ? darkTheme : lightTheme))}
            attribute="class"
            value={{
              light: lightTheme.className,
              dark: darkTheme.className
            }}
        >
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </NextThemesProvider>
      </JotaiProvider>
  ) : (
      <></>
  )
}