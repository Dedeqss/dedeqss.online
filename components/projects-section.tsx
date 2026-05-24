"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Project {
  id: string
  name: string
  description: string
  category: string
  image?: string
  tags: string[]
}

interface ProjectsSectionProps {
  projects: Project[]
  categories: string[]
}

export function ProjectsSection({ projects, categories }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-neon-purple/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-acid-green/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-neon-purple/3 blur-3xl"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-neon-purple to-foreground bg-clip-text text-transparent">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A collection of my work across different domains
          </p>
        </motion.div>

        {/* Category tabs with cool animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {["All", ...categories].map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-5 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 overflow-hidden group ${
                activeCategory === category
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Background for active state */}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-neon-purple via-purple-500 to-neon-purple rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Animated border for inactive tabs */}
              {activeCategory !== category && (
                <>
                  <div className="absolute inset-0 rounded-xl border border-border group-hover:border-neon-purple/50 transition-colors duration-300" />
                  {/* Glowing outline on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                      boxShadow: 'inset 0 0 20px rgba(139, 92, 246, 0.1)',
                    }}
                  />
                  {/* Animated border trace */}
                  <svg className="absolute inset-0 w-full h-full rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="11"
                      ry="11"
                      fill="none"
                      stroke="url(#tab-gradient)"
                      strokeWidth="1.5"
                      strokeDasharray="100 200"
                      className="animate-border-trace"
                    />
                    <defs>
                      <linearGradient id="tab-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
                        <stop offset="50%" stopColor="rgba(139, 92, 246, 1)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </>
              )}
              
              {/* Glow effect for active tab */}
              {activeCategory === category && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-xl blur-md bg-neon-purple/30 -z-10"
                />
              )}
              
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-12"
          >
            No projects found in this category.
          </motion.p>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ 
  project, 
  index, 
  onSelect 
}: { 
  project: Project; 
  index: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)

  const handleClick = useCallback(() => {
    if (clickTimer) {
      // Double click detected
      clearTimeout(clickTimer)
      setClickTimer(null)
      setClickCount(0)
      onSelect()
    } else {
      // First click
      setClickCount(1)
      const timer = setTimeout(() => {
        setClickCount(0)
        setClickTimer(null)
      }, 300)
      setClickTimer(timer)
    }
  }, [clickTimer, onSelect])

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className="cyber-card rounded-xl overflow-hidden group cursor-pointer select-none"
    >
      {/* Project header with icon */}
      <div className="relative h-32 bg-gradient-to-br from-neon-purple/20 via-secondary/50 to-acid-green/10 overflow-hidden">
        {/* Animated background on hover */}
        <motion.div
          initial={false}
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 1 : 0.5
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${isHovered ? '30%' : '50%'} ${isHovered ? '30%' : '50%'}, oklch(0.7 0.25 300 / 0.3) 0%, transparent 60%)`,
          }}
        />
        
        {/* Project initial */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.2 : 1,
              rotateY: isHovered ? 180 : 0
            }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full bg-neon-purple/30 backdrop-blur-sm flex items-center justify-center border border-neon-purple/50"
          >
            <span className="text-2xl font-bold text-neon-purple">
              {project.name.charAt(0)}
            </span>
          </motion.div>
        </div>

        {/* Double tap hint */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-neon-purple/30"
        >
          <span className="text-[10px] text-neon-purple font-mono">Double tap to expand</span>
        </motion.div>

        {/* Glowing edges on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px oklch(0.7 0.25 300 / 0.3)',
          }}
        />
      </div>

      {/* Project info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <motion.h3 
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-semibold text-lg text-foreground group-hover:text-neon-purple transition-colors"
          >
            {project.name}
          </motion.h3>
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-secondary text-muted-foreground shrink-0">
            {project.category}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={false}
              animate={{ 
                y: isHovered ? -2 : 0,
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ delay: tagIndex * 0.05, duration: 0.2 }}
              className="px-2 py-0.5 rounded text-xs bg-neon-purple/10 text-neon-purple border border-neon-purple/20 group-hover:border-neon-purple/40 group-hover:bg-neon-purple/20 transition-colors"
            >
              {tag}
            </motion.span>
          ))}
          {project.tags.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300
          }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.8, 
          y: 50,
          transition: { duration: 0.2 }
        }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg z-50"
      >
        {/* Animated border glow */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px oklch(0.65 0.25 285 / 0.3), 0 0 40px oklch(0.65 0.25 285 / 0.1)',
              '0 0 30px oklch(0.65 0.25 285 / 0.5), 0 0 60px oklch(0.65 0.25 285 / 0.2)',
              '0 0 20px oklch(0.65 0.25 285 / 0.3), 0 0 40px oklch(0.65 0.25 285 / 0.1)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-neon-purple via-purple-500 to-acid-green"
        />

        <div className="relative bg-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="relative h-40 bg-gradient-to-br from-neon-purple/30 via-secondary/50 to-acid-green/20 overflow-hidden">
            {/* Animated particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-20, -100],
                  x: [0, (i % 2 === 0 ? 1 : -1) * 20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute w-1 h-1 rounded-full bg-neon-purple"
                style={{ left: `${15 + i * 15}%`, bottom: '20%' }}
              />
            ))}

            {/* Large project initial */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, delay: 0.1 }}
                className="w-24 h-24 rounded-2xl bg-neon-purple/30 backdrop-blur-sm flex items-center justify-center border-2 border-neon-purple/50"
              >
                <span className="text-4xl font-bold text-neon-purple">
                  {project.name.charAt(0)}
                </span>
              </motion.div>
            </div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background hover:border-neon-purple/50 transition-colors group"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-neon-purple transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Category badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute top-4 left-4 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/50 backdrop-blur-sm"
            >
              <span className="text-xs font-mono text-neon-purple">{project.category}</span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold mb-3 text-foreground"
            >
              {project.name}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-muted-foreground mb-6 leading-relaxed"
            >
              {project.description}
            </motion.p>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="px-3 py-1 rounded-lg text-sm bg-neon-purple/10 text-neon-purple border border-neon-purple/30"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Get in contact button */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              href="https://guns.lol/dedeqss.22"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-primary-foreground overflow-hidden"
            >
              {/* Button background with animated gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-purple via-purple-500 to-neon-purple bg-[length:200%_100%]"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-neon-purple/50" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Get in Contact
              </span>
              
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </>
  )
}
