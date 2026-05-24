"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LanyardData {
  discord_user: {
    id: string
    username: string
    avatar: string
    display_name: string
  }
  discord_status: "online" | "idle" | "dnd" | "offline"
  activities: Array<{
    name: string
    type: number
    state?: string
    details?: string
    application_id?: string
    assets?: {
      large_image?: string
      large_text?: string
      small_image?: string
      small_text?: string
    }
  }>
  listening_to_spotify: boolean
  spotify?: {
    song: string
    artist: string
    album_art_url: string
  }
}

const statusColors = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-gray-500",
}

const statusLabels = {
  online: "Online",
  idle: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
}

interface HeaderProps {
  discordUserId: string
  discordUsername: string
  name: string
  tagline: string
  bio: string
  gunsLolUrl: string
}

export function Header({ discordUserId, discordUsername, name, tagline, bio, gunsLolUrl }: HeaderProps) {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const ws = new WebSocket("wss://api.lanyard.rest/socket")

    ws.onopen = () => {
      ws.send(JSON.stringify({
        op: 2,
        d: { subscribe_to_id: discordUserId }
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.op === 1) {
        // Heartbeat
        setInterval(() => {
          ws.send(JSON.stringify({ op: 3 }))
        }, data.d.heartbeat_interval)
      }
      
      if (data.op === 0 && data.t === "INIT_STATE") {
        setLanyard(data.d)
        setIsLoading(false)
      }
      
      if (data.op === 0 && data.t === "PRESENCE_UPDATE") {
        setLanyard(data.d)
      }
    }

    ws.onerror = () => {
      setIsLoading(false)
    }

    return () => ws.close()
  }, [discordUserId])

  const status = lanyard?.discord_status || "offline"
  const currentActivity = lanyard?.activities?.find(a => a.type === 0)

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
    <header className="relative min-h-[60vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-transparent" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.7 0.25 300 / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.7 0.25 300 / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-foreground via-neon-purple to-foreground bg-clip-text text-transparent"
        >
          {name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-neon-purple font-mono mb-4"
        >
          {tagline}
        </motion.p>

        {/* Bio */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground max-w-lg mb-6 text-balance"
        >
          {bio}
        </motion.p>

        {/* Status badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
        >
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Loading status...</span>
          ) : (
            <>
              <span className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`} />
              <span className="text-sm text-muted-foreground">
                {statusLabels[status]}
              </span>
              {currentActivity && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="text-sm text-foreground">
                    Playing {currentActivity.name}
                  </span>
                </>
              )}
              {lanyard?.listening_to_spotify && lanyard.spotify && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="text-sm text-acid-green">
                    Listening to {lanyard.spotify.song}
                  </span>
                </>
              )}
            </>
          )}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 mt-8"
        >
          {/* Discord - copy username */}
          <button
            onClick={copyDiscordUsername}
            className="relative p-3 rounded-lg bg-secondary/50 border border-border hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300 group"
            aria-label="Copy Discord username"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {copied ? "Copied!" : `Copy ${discordUsername}`}
            </span>
          </button>
          
          {/* guns.lol */}
          <a
            href={gunsLolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all duration-300 group relative"
            aria-label="guns.lol"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              guns.lol
            </span>
          </a>
        </motion.div>
      </div>
    </header>
  )
}
