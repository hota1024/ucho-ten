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
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: '$green200',
      primaryLightHover: '$green300',
      primaryLightActive: '$green400',
      primaryLightContrast: '$green600',
      primary: '#4ADE7B',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '$green500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      // you can also create your own color
      myColor: '#ff4ecd'

      // ...  more colors
    },
    space: {},
    fonts: {}
  }
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
      <NextUIProvider theme={darkTheme}>
        {children}
      </NextUIProvider>
    </JotaiProvider>
  ) : (
    <></>
  )
}
