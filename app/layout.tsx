'use client'
import { Providers } from './providers'
import 'react-medium-image-zoom/dist/styles.css'
import { useState } from 'react'
import useDarkMode from 'use-dark-mode';
import { useAppearanceColorMode } from '@/atoms/settings'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    let appearanceColorMode
    if(typeof window !== 'undefined'){
        appearanceColorMode = window.localStorage.getItem('appearanceColorMode')
    }
    const darkMode = useDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    console.log(appearanceColorMode)

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
          //backgroundImage: 'url(/images/backgroundimg/sky_00421.jpg)',
          backgroundImage: appearanceColorMode === '"dark"' ? 'url(https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg)' :
              (appearanceColorMode === '"light"' ? 'url(/images/backgroundimg/sky_00421.jpg)' : (darkMode.value ? 'url(https://raw.githubusercontent.com/kawaikute-gomen/ucho-ten-images-repo/main/images/backgroundImages/dark/starry-sky-gf5ade6b4f_1920.jpg)' : 'url(/images/backgroundimg/sky_00421.jpg)')),
          backgroundSize: 'cover',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backgroundBlendMode: 'lighten',
        }}
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
