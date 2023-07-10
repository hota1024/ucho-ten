'use client'
import { Providers } from './providers'
import { useState } from "react"
import { useCookies } from "react-cookie";
import 'react-medium-image-zoom/dist/styles.css'
import "tailwindcss/tailwind.css"
const LIGHT_THEME = "light"
const DARK_THEME = "dark"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const [cookies, setCookie, removeCookie] = useCookies()
    console.log(cookies)
    const [theme, setTheme] = useState(cookies.appearanceColorMode)
    console.log(theme)
    const switchTheme = () => {
        if (theme === DARK_THEME) {
            document.documentElement.classList.add(DARK_THEME)
            setTheme(DARK_THEME)
        } else {
            document.documentElement.classList.remove(DARK_THEME)
            setTheme(LIGHT_THEME)
        }
    }
  return (
    <html lang="ja">
      <head>
        <title>Home | Ucho-ten</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="robots" content="noarchive,max-image-preview"></meta>
        <meta property="og:type" content="Ucho-tenは「他者から解放され、自己の独立」を目指すクライアントです。いつでも新鮮な気持ちでBlueskyを使うことができます。"></meta>
        <meta property="og:url" content="https://ucho-ten.net"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content="Ucho-ten Bluesky Client"></meta>
        <meta property="og:description" content='Ucho-tenは「他者から解放され、自己の独立」を目指すクライアントです。いつでも新鮮な気持ちでBlueskyを使うことができます。'></meta>
        <meta property="og:site_name" content="Ucho-ten"></meta>
        <meta
          property="og:image"
          content="https://ucho-ten.net/images/Logo/ucho-ten-ogp.png"
        ></meta>
          <meta name="twitter:card" content="summarylargeimage"></meta>
      </head>
      <body
        style={{

          backgroundSize: 'cover',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backgroundBlendMode: 'lighten',
        }}
        className="bg-dark-sky dark:bg-light-sky "
      >
        <Providers>
            {children}
            <div style={{position:"absolute", right:10, bottom:10}}>
                <div style={{fontSize: '0.5em', color:'white'}}>
                    code name: Nirvana
                </div>
            </div>
        </Providers>
      </body>
    </html>
  )
}
