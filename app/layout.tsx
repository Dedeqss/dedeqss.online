import type { Metadata } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'dedeqss.online',
  description:
    'full-stack dev working in python, javascript, java, and lua. I build discord bots, Minecraft servers, and Roblox systems.',
  keywords: ['developer', 'software', 'portfolio', 'discord bots', 'minecraft', 'roblox', 'python', 'javascript', 'lua'],
  authors: [{ name: 'Dede' }],
  openGraph: {
    title: 'dedeqss.online',
    description: 'check out my portofolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'dedeqss.online',
    description: 'check out my portofolio',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="grain" aria-hidden="true" />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
