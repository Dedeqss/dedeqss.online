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
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          01 — Selected work
        </span>
        <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          What I build
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
          <p className="mb-8 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {activeGroup.blurb}
          </p>

          <ul className="divide-y divide-border">
            {activeGroup.projects.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} gunsUrl={gunsUrl} />
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ProjectRow({
  project,
  index,
  gunsUrl,
}: {
  project: Project
  index: number
  gunsUrl: string
}) {
  const [open, setOpen] = useState(false)
  const contactHref = project.link ?? gunsUrl

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-baseline gap-4 py-6 text-left"
      >
        <span className="font-mono text-xs text-muted-foreground/50">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="flex-1">
          <span className="flex items-center gap-3">
            <span className="font-serif text-2xl text-foreground transition-colors group-hover:text-accent md:text-3xl">
              {project.name}
            </span>
            {project.meta && (
              <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
                {project.meta}
              </span>
            )}
          </span>
        </span>

        <span
          className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-45 text-accent" : "group-hover:text-foreground"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-8 md:pl-10">
              <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent hover:underline"
                >
                  Visit
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}
