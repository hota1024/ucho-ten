import { Providers } from './providers'
import 'react-medium-image-zoom/dist/styles.css'

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
        <meta property="og:url" content="https://ucho-ten.net"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content="Ucho-ten Bluesky Client"></meta>
        <meta property="og:description" content="test"></meta>
        <meta property="og:site_name" content="Ucho-ten"></meta>
        <meta
          property="og:image"
          content="https://staging.ucho-ten.net/public/images/Logo/Ucho-ten-ogp.png"
        ></meta>
      </head>
      <body
        style={{
          backgroundImage: 'url(/images/backgroundimg/sky_00421.jpg)',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backgroundBlendMode: 'lighten',
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
