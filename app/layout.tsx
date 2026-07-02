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
  title: 'Dede — Developer',
  description:
    'Full-stack developer working in Python, JavaScript, Java, and Lua. I build Discord bots, Minecraft servers, and Roblox systems.',
  keywords: ['developer', 'software', 'portfolio', 'discord bots', 'minecraft', 'roblox', 'python', 'javascript', 'lua'],
  authors: [{ name: 'Dede' }],
  openGraph: {
    title: 'Dede — Developer',
    description: 'I build Discord bots, Minecraft servers, and Roblox systems.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dede — Developer',
    description: 'I build Discord bots, Minecraft servers, and Roblox systems.',
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
