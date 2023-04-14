import { Providers } from './providers'
import 'react-medium-image-zoom/dist/styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
