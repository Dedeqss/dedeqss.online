import { Hero } from "@/components/hero"
import { WorkSection, type WorkGroup } from "@/components/work-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"

const config = {
  name: "Dede",
  discordUserId: "1463214892449530022",
  gunsUrl: "https://guns.lol/dedeqss.22",
}

const work: WorkGroup[] = [
  { category: "bots", label: "Discord bots", blurb: "Bots, moderation systems, and community tooling built for real servers and private communities.", projects: [
    { id: "pawmade", name: "Pawmade Bot", meta: "Private · discord.gg/pawmade", description: "A private JavaScript bot built around the Pawmade community's custom systems and day-to-day tooling.", tags: ["JavaScript", "Discord", "Private"], link: "https://discord.gg/pawmade" },
    { id: "purgew", name: "Purgew Bot", meta: "Private · discord.gg/purgew", description: "A private JavaScript bot made for Purgew, with tailored automation and community features.", tags: ["JavaScript", "Automation", "Private"], link: "https://discord.gg/purgew" },
    { id: "barbiepjfs", name: "Barbiepjfs Bot", meta: "Private · discord.gg/barbiepjfs", description: "A JavaScript mass-DM bot made for the Barbiepjfs community and its messaging workflows.", tags: ["JavaScript", "Mass-DM", "Private"], link: "https://discord.gg/barbiepjfs" },
    { id: "alt-manager", name: "Discord Alt Manager", meta: "Private", description: "A private bot for managing owned test accounts and controlled server, voice, and messaging workflows.", tags: ["JavaScript", "Discord", "Private"] },
    { id: "zuki-casino", name: "Zuki Casino", meta: "100k+ weekly messages", description: "A high-traffic casino bot with gambling mechanics, economy systems, and leaderboards.", tags: ["Python", "Scaling", "Economy"] },
    { id: "closet-batman", name: "Closet Bot & Batman", meta: "Moderation", description: "Moderation and anti-nuke systems with real-time threat detection and audit logging.", tags: ["Security", "Moderation", "Real-time"] },
  ] },
  { category: "minecraft", label: "Minecraft", blurb: "Server configuration, plugin work, and performance tuning for communities that need a solid foundation.", projects: [
    { id: "zuki-smp", name: "Zuki SMP", meta: "Main developer & configurator", description: "Custom configurations, UI systems, plugin work, and performance tuning for 42+ concurrent players.", tags: ["Java", "Configuration", "Performance"] },
    { id: "server-architecture", name: "Server Architecture", meta: "Plugin modification", description: "Advanced plugin modification and complete server setups shaped around how a community actually plays.", tags: ["Java", "Plugins", "Systems"] },
    { id: "lethium", name: "Lethium Network", meta: "Media manager · play.lethium.net", description: "Media management for TikToks, Reels, and social content supporting the network.", tags: ["Media", "Content", "Community"] },
  ] },
  { category: "roblox", label: "Roblox / Lua", blurb: "Private Lua frameworks and client-side experiments, documented here as work in progress rather than finished products.", projects: [
    { id: "dudasgoodpuppy", name: "Dudasgoodpuppy UE LUA", meta: "Private · active development", description: "A complex private stand-based item framework for Roblox Unnamed Enhancements, currently in active development.", tags: ["Lua", "Framework", "WIP"] },
    { id: "custom-lua", name: "Custom Lua Scripts", meta: "Private projects", description: "A range of Lua projects and custom frameworks made for different Roblox projects and commissions.", tags: ["Lua", "Scripting", "Private"] },
    { id: "other-projects", name: "Other Projects", meta: "Private commissions", description: "Various private commissions for clients across different platforms, tools, and technical ideas.", tags: ["Mixed", "Commissions", "Private"] },
  ] },
  { category: "research", label: "Research", blurb: "Private local research projects, shared for context only and not intended to affect other players or public services.", projects: [
    { id: "dahood-script", name: "Da Hood Alt Script", meta: "Private · local research", description: "A local research project exploring a control panel for owned test environments.", tags: ["Lua", "Local", "Research"] },
    { id: "dahood-external", name: "Da Hood External", meta: "Private · local research", description: "A private interface study exploring overlays and input systems in controlled environments.", tags: ["C++", "External", "Local"] },
    { id: "project-slayers", name: "Project Slayers 2 Script", meta: "Under development", description: "A work-in-progress Lua research project with automation concepts, tested only in controlled local environments.", tags: ["Lua", "WIP", "Research"] },
    { id: "cs2-external", name: "Counter-Strike 2 External", meta: "Private · local research", description: "A private computer-vision and overlay study for local test environments.", tags: ["C++", "Overlay", "Research"] },
    { id: "vencord", name: "Discord Spoofer & Fake Deafen", meta: "Vencord plugins", description: "Two Vencord plugin experiments exploring client-side presentation and audio-state UI in local testing.", tags: ["JavaScript", "Vencord", "Plugins"] },
  ] },
]

export default function Page() {
  return <main className="site-shell"><div className="site-noise" /><Hero discordUserId={config.discordUserId} gunsUrl={config.gunsUrl} /><WorkSection groups={work} featuredUrl="https://glaze.dedeqss.online" /><ReviewsSection /><Footer name={config.name} gunsLolUrl={config.gunsUrl} /></main>
}
