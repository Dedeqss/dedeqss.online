"use client"

import { useState } from "react"

interface FooterProps {
  name: string
  discordUsername: string
  gunsLolUrl: string
}

export function Footer({ name, discordUsername, gunsLolUrl }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [copied, setCopied] = useState(false)

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(discordUsername)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* noop */
    }
  }

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-3xl text-foreground">
              Let&apos;s build something.
            </p>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Always open to learning new tech for ambitious projects. Reach out and
              let&apos;s talk.
            </p>
            <a
              href={gunsLolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Get in contact
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Elsewhere
            </span>
            <button
              onClick={copyDiscord}
              className="group flex items-center gap-2 text-left text-foreground transition-colors hover:text-accent"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span className="text-sm">{copied ? "Copied!" : discordUsername}</span>
            </button>
            <a
              href={gunsLolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-foreground transition-colors hover:text-accent"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm">guns.lol</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-muted-foreground">
            © {currentYear} {name}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Designed &amp; built with care.
          </p>
        </div>
      </div>
    </footer>
  )
}
