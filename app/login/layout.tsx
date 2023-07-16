'use client'
import { Providers } from '../providers'
import 'react-medium-image-zoom/dist/styles.css'
import dynamic from "next/dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const ComponentWithNoSSR = dynamic(() => import('../InsertBackgroundImage'), {
        ssr: false
    })
  return (
    <html lang="ja">
      <head>
        <title>Sign in | Ucho-ten</title>
      </head>
      <ComponentWithNoSSR>
        <Providers>{children}</Providers>
      </ComponentWithNoSSR>
    </html>
  )
}
