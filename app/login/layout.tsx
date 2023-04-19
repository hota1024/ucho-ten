import { Providers } from '../providers'
import 'react-medium-image-zoom/dist/styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <title>サインイン | ucho-ten</title>
      </head>
      <body style={{backgroundImage:'url(/images/backgroundimg/sky_00421.jpg)', backgroundSize: 'cover'}}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
