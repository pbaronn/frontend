import './globals.css'
import Notification from './components/Notification'

export const metadata = {
  title: 'Report System',
  description: 'Digital Signature Report System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Notification />
        {children}
      </body>
    </html>
  )
}