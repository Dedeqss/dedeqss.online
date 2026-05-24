"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface FooterProps {
  name: string
  discordUsername: string
  gunsLolUrl: string
}

export function Footer({ name, discordUsername, gunsLolUrl }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [copied, setCopied] = useState(false)

  const copyDiscordUsername = async () => {
    try {
      await navigator.clipboard.writeText(discordUsername)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <footer className="relative py-12 px-4 border-t border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 via-transparent to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Logo/Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-xl font-bold text-neon-purple mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground font-mono">
              Software Developer
            </p>
          </motion.div>

          {/* Center - Quick links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6"
            aria-label="Footer navigation"
          >
            <a
              href="#projects"
              className="text-sm text-muted-foreground hover:text-neon-purple transition-colors"
            >
              Projects
            </a>
            <a
              href="#reviews"
              className="text-sm text-muted-foreground hover:text-neon-purple transition-colors"
            >
              Reviews
            </a>
          </motion.nav>

          {/* Right side - Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Discord - copy username */}
            <button
              onClick={copyDiscordUsername}
              className="relative p-2 rounded-lg bg-secondary/50 border border-border hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300 group"
              aria-label="Copy Discord username"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {copied ? "Copied!" : `Copy ${discordUsername}`}
              </span>
            </button>
            
            {/* guns.lol */}
            <a
              href={gunsLolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2 rounded-lg bg-secondary/50 border border-border hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300 group"
              aria-label="guns.lol"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                guns.lol
              </span>
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border/50 text-center"
        >
          <p className="text-sm text-muted-foreground font-mono">
            &copy; {currentYear} {name}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
