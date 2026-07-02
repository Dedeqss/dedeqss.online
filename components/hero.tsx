"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { DiscordPresence } from "@/components/discord-presence"

interface HeroProps {
  discordUserId: string
  discordUsername: string
  gunsUrl: string
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero({ discordUserId, discordUsername, gunsUrl }: HeroProps) {
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
    <section className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-36 md:pb-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr] md:items-center">
        {/* Left: intro */}
        <div>
          <motion.p
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span className="h-px w-8 bg-accent" />
            Full-stack developer
          </motion.p>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="text-balance font-serif text-5xl leading-[0.95] tracking-tight text-foreground md:text-7xl"
          >
            Dede
            <span className="text-accent">.</span>
            <br />
            <span className="text-muted-foreground">building things</span>
            <br />
            that ship.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-md text-pretty leading-relaxed text-muted-foreground"
          >
            Proficient in Python, JavaScript, Java, and Lua. I blend hands-on coding
            with modern AI workflows to build high-performance tools, custom Discord
            bots, and fully optimized Minecraft servers.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href={gunsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Get in contact
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M3 11L11 3M11 3H5M11 3V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              onClick={copyDiscord}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-border-strong hover:bg-card"
            >
              {copied ? "Copied!" : discordUsername}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                {copied ? (
                  <path
                    d="M2.5 7.5L5.5 10.5L11.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10.5 5H11.5V11.5H5V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Right: presence */}
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
        >
          <DiscordPresence userId={discordUserId} />
        </motion.div>
      </div>
    </section>
  )
}
