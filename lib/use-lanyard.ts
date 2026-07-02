"use client"

import useSWR from "swr"

export interface LanyardActivity {
  id: string
  name: string
  type: number
  state?: string
  details?: string
  application_id?: string
  timestamps?: { start?: number; end?: number }
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
}

export interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline"
  discord_user: {
    id: string
    username: string
    global_name?: string
    avatar?: string
    display_name?: string
  }
  activities: LanyardActivity[]
  listening_to_spotify: boolean
  spotify?: {
    song: string
    artist: string
    album: string
    album_art_url: string
    timestamps?: { start: number; end: number }
  }
}

const fetcher = async (url: string): Promise<LanyardData | null> => {
  const res = await fetch(url)
  if (!res.ok) return null
  const json = await res.json()
  if (!json?.success) return null
  return json.data as LanyardData
}

/**
 * Fetches live Discord presence via the Lanyard API.
 * Requires the user to have joined discord.gg/lanyard.
 * Pass a numeric Discord user ID.
 */
export function useLanyard(userId: string) {
  const isValidId = /^\d{17,20}$/.test(userId)

  const { data, error, isLoading } = useSWR<LanyardData | null>(
    isValidId ? `https://api.lanyard.rest/v1/users/${userId}` : null,
    fetcher,
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryInterval: 20000,
    }
  )

  return {
    presence: data ?? null,
    isLoading: isValidId && isLoading,
    isConfigured: isValidId,
    error,
  }
}

export function avatarUrl(user: LanyardData["discord_user"] | undefined, size = 128) {
  if (!user?.avatar) return null
  const ext = user.avatar.startsWith("a_") ? "gif" : "png"
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`
}
