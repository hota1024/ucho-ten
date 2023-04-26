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
        <link rel="shortcut icon" href="favicon.svg" type="image/svg+xml" />
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
