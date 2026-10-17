import { Hero } from "@/components/hero"
import { WorkSection, type WorkGroup } from "@/components/work-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"

const CONFIG = {
  name: "Dede",
  discordUserId: "1463214892449530022",
  discordUsername: "@04d4",
  gunsUrl: "https://guns.lol/dedeqss.22",
}

const WORK: WorkGroup[] = [
  {
    category: "featured",
    label: "Glaze",
    blurb: "The one I keep coming back to. Glaze is an all-in-one Discord bot, currently live and growing at glaze.dedeqss.online.",
    featured: true,
    projects: [{ id: "glaze", name: "Glaze", meta: "Live · glaze.dedeqss.online", description: "An all-in-one Discord bot built as one of my biggest ongoing projects — bringing a broad set of useful systems together in one polished product.", tags: ["JavaScript", "Discord", "Live"], link: "https://glaze.dedeqss.online" }],
  },
  {
    category: "bots",
    label: "Bots",
    blurb: "Discord automation and community tooling — built for real use, private communities, and ambitious ideas.",
    projects: [
      { id: "alt-manager", name: "Discord Alt Manager", meta: "Private", description: "A private Discord bot focused on managing owned test accounts and automating controlled server and voice workflows.", tags: ["JavaScript", "Discord", "Private"] },
      { id: "pawmade", name: "Pawmade Bot", meta: "Private · discord.gg/pawmade", description: "A private bot made for the Pawmade community, with custom systems shaped around the server's needs.", tags: ["JavaScript", "Private", "Community"], link: "https://discord.gg/pawmade" },
      { id: "purgew", name: "Purgew Bot", meta: "Private · discord.gg/purgew", description: "A private Discord bot made for Purgew, built around tailored automation and community tooling.", tags: ["JavaScript", "Private", "Automation"], link: "https://discord.gg/purgew" },
      { id: "barbiepjfs", name: "Barbiepjfs Bot", meta: "Mass-DM bot · discord.gg/barbiepjfs", description: "A private messaging automation project made for the Barbiepjfs community.", tags: ["JavaScript", "Private", "Discord"], link: "https://discord.gg/barbiepjfs" },
      { id: "zuki-casino", name: "Zuki Casino", meta: "100k+ weekly messages", description: "A high-traffic casino bot with advanced mechanics, economy systems, and leaderboards.", tags: ["Python", "Scaling", "Economy"] },
      { id: "closet-batman", name: "Closet Bot & Batman", meta: "Moderation", description: "Moderation and anti-nuke protection bots with real-time threat detection and audit logging.", tags: ["Security", "Moderation", "Real-time"] },
    ],
  },
  {
    category: "research",
    label: "Research",
    blurb: "Private game tooling and plugin research. These entries are for educational, local testing only and are not intended to affect other players.",
    projects: [
      { id: "dahood-script", name: "Da Hood Alt Script", meta: "Private · educational", description: "A private local research project exploring an in-game control panel for owned test environments.", tags: ["Lua", "Local", "Research"] },
      { id: "dahood-external", name: "Da Hood External", meta: "Private · educational", description: "A private external interface study for local testing, focused on overlay and input systems.", tags: ["C++", "External", "Local"] },
      { id: "project-slayers", name: "Project Slayers 2 Script", meta: "In development", description: "A work-in-progress automation research project for Project Slayers 2, tested only in controlled local environments.", tags: ["Lua", "WIP", "Research"] },
      { id: "cs2-external", name: "Counter-Strike 2 External", meta: "Private · educational", description: "A private external research project exploring computer-vision and overlay concepts in local test environments.", tags: ["C++", "Overlay", "Research"] },
      { id: "vencord", name: "Discord Spoofer & Fake Deafen", meta: "Vencord plugins", description: "Two Vencord plugin experiments exploring client-side presentation and audio-state UI in local testing.", tags: ["JavaScript", "Vencord", "Plugins"] },
    ],
  },
]

export default function Page() {
  return <main className="relative min-h-screen"><div className="grain" /><Hero discordUserId={CONFIG.discordUserId} discordUsername={CONFIG.discordUsername} gunsUrl={CONFIG.gunsUrl} /><WorkSection groups={WORK} gunsUrl={CONFIG.gunsUrl} /><ReviewsSection /><Footer name={CONFIG.name} discordUsername={CONFIG.discordUsername} gunsLolUrl={CONFIG.gunsUrl} /></main>
}
