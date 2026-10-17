"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface Project {
  id: string
  name: string
  description: string
  meta?: string
  tags: string[]
  link?: string
  featured?: boolean
}

export interface WorkGroup {
  category: string
  label: string
  blurb: string
  projects: Project[]
}

export function WorkSection({ groups }: { groups: WorkGroup[] }) {
  const [active, setActive] = useState("all")
  const all = groups.flatMap((group) => group.projects.map((project) => ({ ...project, category: group.label })))
  const visible = active === "all" ? all : all.filter((project) => project.category === groups.find((group) => group.category === active)?.label)
  const activeGroup = groups.find((group) => group.category === active)

  return (
    <section id="work" className="work-wrap">
      <div className="section-heading">
        <div><p className="eyebrow"><span>02</span> selected work</p><h2>Made to<br /><em>hold up.</em></h2></div>
        <p className="section-note">A practical index of bots, systems, server work, and experiments built with intent.</p>
      </div>

      <div className="index-header"><p className="eyebrow"><span>04</span> selected work</p><span>click a row to expand</span></div>
      <div className="work-tabs"><button className={active === "all" ? "active" : ""} onClick={() => setActive("all")}>All <small>{all.length}</small></button>{groups.map((group) => <button key={group.category} className={active === group.category ? "active" : ""} onClick={() => setActive(group.category)}>{group.label} <small>{group.projects.length}</small></button>)}</div>
      {activeGroup && <p className="active-blurb">{activeGroup.blurb}</p>}
      <AnimatePresence mode="wait"><motion.div key={active} className="project-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .25 }}>{visible.map((project, index) => <ProjectRow key={project.id} project={project} index={index} />)}</motion.div></AnimatePresence>
    </section>
  )
}

function ProjectRow({ project, index }: { project: Project & { category?: string }; index: number }) {
  const [open, setOpen] = useState(false)
  return <motion.article layout className={`project-row ${project.featured ? "is-featured" : ""} ${open ? "is-open" : ""}`} onClick={() => setOpen(!open)}><span className="project-index">{String(index + 1).padStart(2, "0")}</span><div className="project-main"><div className="project-title-line"><h3>{project.name}</h3>{project.featured && <span className="featured-badge">featured</span>}</div><p className="project-meta">{project.meta}</p>{open && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="project-desc">{project.description}</motion.p>}<div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><span className="project-category">{project.category}</span>{project.link ? <a className="project-link" href={project.link} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>↗</a> : <span className="project-link">{open ? "−" : "+"}</span>}</motion.article>
}
