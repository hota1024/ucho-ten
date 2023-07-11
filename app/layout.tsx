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
          <script>
              {`
            if (!('theme' in localStorage) || localStorage.theme === 'system') {
              // OS の設定を読み取る
              if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // OS の設定がダークモードの場合、html に dark クラスを付与する
                document.documentElement.classList.add('dark')
              }
              // LocalStorage に設定を保存する
              localStorage.setItem('theme', 'system')
            } else if (localStorage.theme === 'dark') {
              // LocalStorage に theme が保存されていて、theme が dark の場合
              document.documentElement.classList.add('dark')
            } else {
              // それ以外の場合
              document.documentElement.classList.remove('dark')
            }
          `}
          </script>
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
