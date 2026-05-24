import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Dede Portfolio',
  description: 'Full-stack developer proficient in Python, JavaScript, Java, and Lua. Building high-performance tools, custom Discord bots, and optimized Minecraft servers.',
  keywords: ['developer', 'software', 'portfolio', 'discord bots', 'minecraft', 'roblox', 'python', 'javascript', 'lua'],
  authors: [{ name: 'Dede' }],
  openGraph: {
    title: 'Dede Portfolio',
    description: 'Full-stack developer proficient in Python, JavaScript, Java, and Lua.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dede Portfolio',
    description: 'Full-stack developer proficient in Python, JavaScript, Java, and Lua.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
