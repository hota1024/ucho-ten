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
import { useState } from 'react'
import useDarkMode from 'use-dark-mode';


export function Providers({ children }: { children: React.ReactNode }) {
  const { isBrowser } = useSSR()
  const [appearanceColorMode, setAppearanceColorMode] = useState<string>(
      window.localStorage.getItem('appearanceColorMode') || 'system')
  const [browserAppearanceColor, setBrowserAppearanceColor] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const darkMode = useDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  //console.log( browserAppearanceColor)
  console.log(appearanceColorMode)


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
  console.log(appearanceColorMode)
  console.log(darkMode.value)

  return isBrowser ? (
    <JotaiProvider>
      <NextThemesProvider
          defaultTheme={appearanceColorMode === '"dark"' ? darkTheme : (appearanceColorMode === '"light"' ? lightTheme : (darkMode.value ? darkTheme : lightTheme))}
          //defaultTheme={'system'}
          //themes={appearanceColorMode === '"dark"' ? [darkTheme] : [lightTheme]}
          //forcedTheme={appearanceColorMode === '"dark"' ? 'darkTheme' : (appearanceColorMode === '"light"' ? lightTheme : (appearanceColorMode === '"system"' && darkMode.value ? darkTheme : lightTheme))}
          attribute="class"
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
