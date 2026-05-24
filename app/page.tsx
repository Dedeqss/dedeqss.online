import { Header } from "@/components/header"
import { ProjectsSection, type Project } from "@/components/projects-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"

// Configuration - Update these values with your info
const CONFIG = {
  discordUserId: "123456789012345678", // Replace with your Discord user ID for Lanyard
  discordUsername: "@04d4",
  name: "Dede",
  tagline: "15 y/o Software Developer",
  bio: "Full-stack developer proficient in Python, JavaScript, Java, and Lua. I blend manual coding expertise with modern AI workflows to build high-performance tools, custom Discord bots, and fully optimized Minecraft servers. Always open to learning new tech for ambitious projects.",
  gunsLolUrl: "https://guns.lol/dedeqss.22",
}

// Projects organized by category
const PROJECTS: Project[] = [
  // Discord Tools
  {
    id: "1",
    name: "Zuki Casino",
    description: "High-traffic Python casino bot scaled to 100k+ weekly messages with advanced gambling mechanics.",
    category: "Discord",
    tags: ["Python", "Discord.py", "Async", "Database"],
  },
  {
    id: "2",
    name: "Closet Bot & Batman",
    description: "Advanced moderation and anti-nuke protection bots with real-time threat detection.",
    category: "Discord",
    tags: ["Python", "Security", "Moderation", "Anti-Nuke"],
  },
  {
    id: "3",
    name: "Discord Tools",
    description: "Custom 4L name snipers/checkers and voice-channel automation managers.",
    category: "Discord",
    tags: ["Python", "Automation", "API", "Tools"],
  },
  {
    id: "4",
    name: "Custom Private Bots",
    description: "Multiple private bots built for specific communities including economy and utility systems.",
    category: "Discord",
    tags: ["Python", "Economy", "Utility", "Custom"],
  },
  // Minecraft
  {
    id: "5",
    name: "Zuki SMP",
    description: "Main developer and configurator. Built custom configurations, UI systems, and optimized server performance for 42+ concurrent players.",
    category: "Minecraft",
    tags: ["Java", "Spigot", "Configuration", "Optimization"],
  },
  {
    id: "6",
    name: "Server Architecture",
    description: "Proficient in advanced plugin modification, server setups, and performance optimization.",
    category: "Minecraft",
    tags: ["Java", "Plugins", "Architecture", "Performance"],
  },
  {
    id: "7",
    name: "Lethium Network",
    description: "Media Manager at play.lethium.net - helping with TikToks, Reels, and social media posts.",
    category: "Minecraft",
    tags: ["Media", "Marketing", "Social Media", "Content"],
  },
  // Roblox
  {
    id: "8",
    name: "Dudasgoodpuppy UE LUA",
    description: "A complex, private stand-based item framework built for Roblox Unnamed Enhancements. Currently in active development.",
    category: "Roblox",
    tags: ["Lua", "Roblox", "Framework", "Development"],
  },
  {
    id: "9",
    name: "Custom Lua Scripts",
    description: "Various Lua projects including game exploits and custom frameworks for different Roblox projects.",
    category: "Roblox",
    tags: ["Lua", "Scripting", "Exploits", "Frameworks"],
  },
  {
    id: "10",
    name: "Other Projects",
    description: "Various private commissions for clients across different Roblox games and platforms.",
    category: "Roblox",
    tags: ["Lua", "Commissions", "Private", "Custom"],
  },
]

const CATEGORIES = ["Discord", "Minecraft", "Roblox"]

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header
        discordUserId={CONFIG.discordUserId}
        discordUsername={CONFIG.discordUsername}
        name={CONFIG.name}
        tagline={CONFIG.tagline}
        bio={CONFIG.bio}
        gunsLolUrl={CONFIG.gunsLolUrl}
      />
      
      <section id="projects">
        <ProjectsSection projects={PROJECTS} categories={CATEGORIES} />
      </section>
      
      <section id="reviews">
        <ReviewsSection />
      </section>
      
      <Footer
        name={CONFIG.name}
        discordUsername={CONFIG.discordUsername}
        gunsLolUrl={CONFIG.gunsLolUrl}
      />
    </main>
  )
}
