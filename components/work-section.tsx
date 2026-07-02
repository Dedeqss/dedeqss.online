"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Project {
  id: string
  name: string
  description: string
  meta?: string
  tags: string[]
  link?: string
}

export interface WorkGroup {
  category: string
  label: string
  blurb: string
  projects: Project[]
}

interface WorkSectionProps {
  groups: WorkGroup[]
  gunsUrl: string
}

export function WorkSection({ groups, gunsUrl }: WorkSectionProps) {
  const [active, setActive] = useState(groups[0]?.category ?? "")
  const activeGroup = groups.find((g) => g.category === active) ?? groups[0]

  return (
    <section id="work" className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
      <div className="mb-12 flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          01 — Selected work
        </span>
        <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Things I&apos;ve built
        </h2>
      </div>

      {/* Category switcher — editorial underline tabs */}
      <div className="mb-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-border">
        {groups.map((g) => {
          const isActive = g.category === active
          return (
            <button
              key={g.category}
              onClick={() => setActive(g.category)}
              className="relative -mb-px pb-4 text-left"
            >
              <span
                className={`font-serif text-xl transition-colors md:text-2xl ${
                  isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
              >
                {g.label}
              </span>
              <span className="ml-2 font-mono text-xs text-muted-foreground/40">
                {String(g.projects.length).padStart(2, "0")}
              </span>
              {isActive && (
                <motion.span
                  layoutId="work-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeGroup.category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-10 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {activeGroup.blurb}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {activeGroup.projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* Closing note — "I've done more" */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-col items-start gap-4 border-t border-dashed border-border pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
              <span className="text-foreground">And plenty more.</span> These are just
              the highlights — I&apos;ve shipped countless private commissions, tools, and
              systems that aren&apos;t listed here.
            </p>
            <a
              href={gunsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-accent-foreground transition-transform hover:scale-105"
            >
              Ask about the rest
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-border-strong"
    >
      {/* Accent corner glow on hover */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-accent/0 blur-3xl transition-colors duration-500 group-hover:bg-accent/10" />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-muted-foreground/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-accent">
            {project.name}
          </h3>
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.name}`}
            className="mt-1 shrink-0 text-muted-foreground/50 transition-colors hover:text-accent"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>

      {project.meta && (
        <span className="mb-3 w-fit font-mono text-[11px] uppercase tracking-wider text-accent/80">
          {project.meta}
        </span>
      )}

      <p
        className={`text-pretty text-sm leading-relaxed text-muted-foreground transition-all ${
          open ? "" : "line-clamp-2"
        }`}
      >
        {project.description}
      </p>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-2 w-fit font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        {open ? "Show less" : "Read more"}
      </button>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
