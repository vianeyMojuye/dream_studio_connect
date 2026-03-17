import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dream Studio Connect',
  description: 'La plateforme de mise en relation talents football africain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
