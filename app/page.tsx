import { Hero } from "@/components/hero"
import { WorkSection, type WorkGroup } from "@/components/work-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"

// ─────────────────────────────────────────────────────────────
// CONFIG — update these with your details
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  name: "Dede",
  // Live Discord status via Lanyard. You MUST join discord.gg/lanyard so the
  // API can track your presence, otherwise it falls back gracefully.
  discordUserId: "825846052463968266",
  discordUsername: "@04d4",
  gunsUrl: "https://guns.lol/dedeqss.22",
}

const WORK: WorkGroup[] = [
  {
    category: "discord",
    label: "Discord",
    blurb:
      "Custom bots built for real communities — from high-traffic economy systems to anti-nuke protection handling thousands of events a day.",
    projects: [
      {
        id: "barbiepjfs",
        name: "Barbiepjfs Bot",
        meta: "Mass-DM bot",
        description:
          "A mass-DM bot built for discord.gg/barbiepjfs — handles bulk outreach and messaging automation reliably at scale.",
        tags: ["Python", "Mass-DM", "Automation"],
        link: "https://discord.gg/barbiepjfs",
      },
      {
        id: "pawmade",
        name: "Pawmade Bot",
        meta: "Private bot",
        description:
          "A private bot made for discord.gg/pawmade — built to the community's exact needs with custom systems and tooling.",
        tags: ["Python", "discord.py", "Private"],
        link: "https://discord.gg/pawmade",
      },
      {
        id: "purgew",
        name: "Purgew Bot",
        meta: "Private bot",
        description:
          "A private bot made for discord.gg/purgew — tailored features and automation for the server.",
        tags: ["Python", "discord.py", "Private"],
        link: "https://discord.gg/purgew",
      },
      {
        id: "zuki-casino",
        name: "Zuki Casino",
        meta: "100k+ weekly messages",
        description:
          "High-traffic Python casino bot scaled to 100k+ weekly messages with advanced gambling mechanics, an economy, and leaderboards.",
        tags: ["Python", "Economy", "Scaling"],
      },
      {
        id: "closet-batman",
        name: "Closet Bot & Batman",
        meta: "Anti-nuke",
        description:
          "Advanced moderation and anti-nuke protection bots with real-time threat detection, auto-response, and audit logging.",
        tags: ["Moderation", "Security", "Real-time"],
      },
      {
        id: "discord-tools",
        name: "Discord Tools",
        description:
          "Custom 4L name snipers / checkers and voice-channel automation managers built for power users.",
        tags: ["Automation", "Tooling"],
      },
      {
        id: "private-bots",
        name: "Custom Private Bots",
        description:
          "Multiple private bots built for specific communities, including economy and utility systems tailored to each server.",
        tags: ["Custom", "Economy", "Utility"],
      },
    ],
  },
  {
    category: "minecraft",
    label: "Minecraft",
    blurb:
      "Server configuration and optimization — custom setups, UI systems, and performance tuning for live, high-concurrency servers.",
    projects: [
      {
        id: "zuki-smp",
        name: "Zuki SMP",
        meta: "42+ concurrent players",
        description:
          "Main developer and configurator. Built custom configurations, UI systems, and optimized server performance for 42+ concurrent players.",
        tags: ["Server config", "Optimization", "UI systems"],
      },
      {
        id: "server-arch",
        name: "Server Architecture",
        description:
          "Proficient in advanced plugin modification and full server setups — from the ground up to production-ready.",
        tags: ["Plugins", "Setup", "Java"],
      },
      {
        id: "lethium",
        name: "Lethium Network",
        meta: "play.lethium.net",
        description:
          "Media Manager at play.lethium.net — creating TikToks, Reels, and social media posts to grow the network.",
        tags: ["Media", "Social", "Content"],
        link: "https://play.lethium.net",
      },
    ],
  },
  {
    category: "roblox",
    label: "Roblox",
    blurb:
      "Lua frameworks and scripting — complex, private systems built for games and custom projects.",
    projects: [
      {
        id: "dudas-ue",
        name: "Dudasgoodpuppy UE Lua",
        meta: "In development",
        description:
          "A complex, private stand-based item framework built for Roblox Unnamed Enhancements. Currently in active development.",
        tags: ["Lua", "Framework", "Roblox"],
      },
      {
        id: "custom-lua",
        name: "Custom Lua Scripts",
        description:
          "Various Lua projects including game exploits and custom frameworks for different Roblox projects.",
        tags: ["Lua", "Scripting", "Custom"],
      },
      {
        id: "commissions",
        name: "Other Projects",
        description:
          "Various private commissions for clients across different platforms and requirements.",
        tags: ["Commissions", "Private"],
      },
    ],
  },
]

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <Hero
        discordUserId={CONFIG.discordUserId}
        discordUsername={CONFIG.discordUsername}
        gunsUrl={CONFIG.gunsUrl}
      />
      <WorkSection groups={WORK} gunsUrl={CONFIG.gunsUrl} />
      <ReviewsSection />
      <Footer
        name={CONFIG.name}
        discordUsername={CONFIG.discordUsername}
        gunsLolUrl={CONFIG.gunsUrl}
      />
    </main>
  )
}
