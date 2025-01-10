import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MikasaAI - Your AI Developer Assistant',
  description: 'An AI-powered developer assistant inspired by Mikasa Ackerman',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

