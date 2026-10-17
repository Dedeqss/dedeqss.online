"use client"

import { motion } from "framer-motion"
import { DiscordPresence } from "@/components/discord-presence"

export function Hero({ discordUserId, gunsUrl }: { discordUserId: string; gunsUrl: string }) {
  return (
    <header className="hero-wrap" id="top">
      <nav className="top-nav">
        <a href="#top" className="wordmark">D / <span>DEDE</span></a>
        <div className="nav-links"><a href="#work">index</a><a href="#reviews">notes</a><a href={gunsUrl} target="_blank" rel="noreferrer">contact <span>↗</span></a></div>
        <span className="nav-status"><i /> open to work</span>
      </nav>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> software developer / builder</p>
          <h1>Small team.<br /><em>Big systems.</em></h1>
          <p className="hero-lede">I build the tools that sit behind communities: Discord infrastructure, server systems, private experiments, and the occasional thing that gets way too ambitious.</p>
          <div className="hero-actions"><a className="solid-button" href="#work">view selected work <span>↓</span></a><a className="text-button" href={gunsUrl} target="_blank" rel="noreferrer">say hello <span>↗</span></a></div>
          <div className="stack-line"><span>python</span><span>javascript</span><span>java</span><span>lua</span></div>
        </div>
        <aside className="hero-side">
          <div className="side-label">/ now</div>
          <p>Putting the finishing touches on <strong>Glaze</strong>, an all-in-one Discord bot.</p>
          <div className="side-rule" />
          <DiscordPresence userId={discordUserId} />
          <motion.div className="scroll-mark" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>keep scrolling ↓</motion.div>
        </aside>
      </div>
    </header>
  )
}
