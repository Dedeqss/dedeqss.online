"use client"

import { useState, useEffect } from "react"
import { useLanyard, avatarUrl, type LanyardActivity } from "@/lib/use-lanyard"

const STATUS_CONFIG = {
  online: { label: "Online", color: "bg-emerald-400", ring: "ring-emerald-400/30" },
  idle: { label: "Idle", color: "bg-amber-400", ring: "ring-amber-400/30" },
  dnd: { label: "Do Not Disturb", color: "bg-rose-400", ring: "ring-rose-400/30" },
  offline: { label: "Offline", color: "bg-neutral-500", ring: "ring-neutral-500/30" },
} as const

function elapsed(start?: number) {
  if (!start) return null
  const diff = Date.now() - start
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  if (hrs > 0) return `${hrs}h ${mins % 60}m`
  return `${mins}m`
}

function activityImage(activity: LanyardActivity) {
  const img = activity.assets?.large_image
  if (!img) return null
  if (img.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${img.replace("mp:external/", "")}`
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`
  }
  return null
}

export function DiscordPresence({ userId }: { userId: string }) {
  const { presence, isLoading, isConfigured } = useLanyard(userId)
  const [tick, setTick] = useState(0)

  // re-render every 30s to update elapsed timers
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(i)
  }, [])

  const status = presence?.discord_status ?? "offline"
  const cfg = STATUS_CONFIG[status]
  const avatar = avatarUrl(presence?.discord_user, 128)
  const name =
    presence?.discord_user?.global_name ||
    presence?.discord_user?.username ||
    "dedeqss"

  // Non-Spotify, non-custom activity
  const activity = presence?.activities?.find((a) => a.type === 0)
  const customStatus = presence?.activities?.find((a) => a.type === 4)
  const spotify = presence?.listening_to_spotify ? presence.spotify : null

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-border-strong">
      {/* subtle top hairline accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Discord
        </span>
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className={`relative flex h-2 w-2`}>
            {status !== "offline" && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.color} opacity-60`}
              />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.color}`} />
          </span>
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className={`relative shrink-0 rounded-full ring-2 ${cfg.ring}`}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar || "/placeholder.svg"}
              alt={`${name} avatar`}
              className="h-14 w-14 rounded-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary font-serif text-xl text-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card ${cfg.color}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{name}</p>
          {customStatus?.state ? (
            <p className="truncate text-sm text-muted-foreground">{customStatus.state}</p>
          ) : (
            <p className="truncate text-sm text-muted-foreground">
              {isConfigured
                ? isLoading
                  ? "Fetching presence…"
                  : status === "offline"
                    ? "Currently offline"
                    : "No status set"
                : "Live presence — add your ID"}
            </p>
          )}
        </div>
      </div>

      {/* Rich activity */}
      {(activity || spotify) && (
        <div className="mt-4 space-y-2 border-t border-border/60 pt-4" key={tick}>
          {spotify && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spotify.album_art_url || "/placeholder.svg"}
                alt={spotify.album}
                className="h-10 w-10 rounded object-cover"
                crossOrigin="anonymous"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Listening to Spotify
                </p>
                <p className="truncate text-sm font-medium text-foreground">{spotify.song}</p>
                <p className="truncate text-xs text-muted-foreground">by {spotify.artist}</p>
              </div>
            </div>
          )}

          {activity && !spotify && (
            <div className="flex items-center gap-3">
              {activityImage(activity) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activityImage(activity) || "/placeholder.svg"}
                  alt={activity.name}
                  className="h-10 w-10 rounded object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-secondary font-mono text-xs text-accent">
                  {activity.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                  Playing
                </p>
                <p className="truncate text-sm font-medium text-foreground">{activity.name}</p>
                {activity.details && (
                  <p className="truncate text-xs text-muted-foreground">{activity.details}</p>
                )}
                {activity.timestamps?.start && (
                  <p className="truncate text-[11px] text-muted-foreground/70">
                    {elapsed(activity.timestamps.start)} elapsed
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
