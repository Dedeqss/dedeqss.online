"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { DiscordPresence } from "@/components/discord-presence"

export function Hero({ discordUserId, discordUsername, gunsUrl }: { discordUserId: string; discordUsername: string; gunsUrl: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(discordUsername); setCopied(true); setTimeout(() => setCopied(false), 1600) }
  return <header className="hero-wrap">
    <nav className="top-nav"><a href="#top" className="wordmark">dede<span>/</span>dev</a><div className="nav-links"><a href="#work">work</a><a href="#reviews">reviews</a><a href={gunsUrl} target="_blank" rel="noreferrer">contact <span>↗</span></a></div><span className="nav-status"><i /> available for interesting work</span></nav>
    <div id="top" className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><span>01</span> independent software developer</p>
        <h1>Tools that<br /><em>do the work.</em></h1>
        <p className="hero-lede">I&apos;m Dede — a developer working across Discord, Minecraft, Roblox, and the web. I like turning rough ideas into tools people actually keep open.</p>
        <div className="hero-actions"><a className="solid-button" href="#work">see the work <span>↓</span></a><button className="text-button" onClick={copy}>{copied ? "copied" : discordUsername} <span>⧉</span></button></div>
        <div className="stack-line"><span>python</span><span>javascript</span><span>java</span><span>lua</span></div>
      </div>
      <div className="hero-side"><div className="side-label">currently</div><p>Building <strong>Glaze</strong>, an all-in-one Discord bot.</p><div className="side-rule" /><DiscordPresence userId={discordUserId} /><motion.div className="scroll-mark" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>scroll to explore ↓</motion.div></div>
    </div>
  </header>
}
