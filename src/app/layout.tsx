import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Voice Call Center | Build Intelligent Voice AI Agents',
  description:
    'Build intelligent voice AI agents that handle customer calls 24/7. Perfect for support, sales, and appointment reminders.',
  openGraph: {
    title: 'AI Voice Call Center',
    description: 'Build intelligent voice AI agents that handle customer calls 24/7',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Call Center',
    description: 'Build intelligent voice AI agents that handle customer calls 24/7',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
