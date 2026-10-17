"use client"

interface FooterProps { name: string; gunsLolUrl: string }

export function Footer({ name, gunsLolUrl }: FooterProps) {
  const currentYear = new Date().getFullYear()
  return <footer className="border-t border-border"><div className="mx-auto max-w-5xl px-6 py-14"><div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between"><div className="max-w-sm"><p className="font-serif text-3xl text-foreground">Let&apos;s build something.</p><p className="mt-3 text-pretty leading-relaxed text-muted-foreground">Always open to learning new tech for ambitious projects. Reach out and let&apos;s talk.</p><a href={gunsLolUrl} target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5">Get in contact <span>↗</span></a></div><div className="flex flex-col gap-4"><span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Elsewhere</span><a href={gunsLolUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground transition-colors hover:text-accent">guns.lol ↗</a></div></div><div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center"><p className="font-mono text-xs text-muted-foreground">© {currentYear} {name}</p><p className="font-mono text-xs text-muted-foreground">Designed &amp; built with care.</p></div></div></footer>
}
