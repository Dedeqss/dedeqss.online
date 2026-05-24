"use client"

import { useState } from "react"
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

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
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

        {/* Category tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {["All", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-neon-purple text-primary-foreground shadow-lg shadow-neon-purple/25"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
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
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cyber-card rounded-xl overflow-hidden group cursor-default"
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
