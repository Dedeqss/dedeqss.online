"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Review {
  id: string
  user_name: string
  review_text: string
  rating: number
  role?: string | null
  created_at: string
  owned?: boolean
}

interface ReviewsResponse {
  reviews: Review[]
  remaining: number
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.13l-4.95 2.6.94-5.5-4-3.9 5.53-.81L10 1.5z"
            fill={n <= rating ? "var(--color-accent)" : "none"}
            stroke={n <= rating ? "var(--color-accent)" : "var(--color-border-strong)"}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [remaining, setRemaining] = useState(2)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Review | null>(null)

  // marquee focus/pause
  const [paused, setPaused] = useState(false)

  // owner admin
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminCode, setAdminCode] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews")
      if (!res.ok) return
      const data: ReviewsResponse = await res.json()
      setReviews(data.reviews ?? [])
      setRemaining(data.remaining ?? 0)
    } catch {
      /* noop */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (r: Review) => {
    setEditing(r)
    setModalOpen(true)
  }

  const marquee = reviews.length >= 3 ? [...reviews, ...reviews] : reviews
  // Slower scroll — scale with number of reviews so density stays comfortable.
  const marqueeDuration = Math.max(45, reviews.length * 12)

  return (
    <section id="reviews" className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
      <div className="mb-12 flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          02 — Testimonials
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              Kind words
            </h2>
            {/* Owner crown — opens the secret-code gate */}
            <button
              onClick={() => setAdminOpen(true)}
              aria-label="Owner tools"
              title="Owner tools"
              className="group mb-1 text-muted-foreground/30 transition-colors hover:text-accent"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8l3.5 3L12 5l5.5 6L21 8l-1.5 10h-15L3 8z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  className="transition-all group-hover:fill-accent/15"
                />
                <path d="M6.5 18h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong hover:bg-card"
          >
            Leave a review
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 flex-1 animate-pulse rounded-2xl border border-border bg-card/40"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">No reviews yet — be the first.</p>
        </div>
      ) : reviews.length >= 3 ? (
        <div className="relative">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
            <div
              className="flex w-max gap-5 animate-marquee"
              style={{
                // @ts-expect-error CSS var
                "--marquee-duration": `${marqueeDuration}s`,
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              {marquee.map((r, i) => (
                <ReviewCard
                  key={`${r.id}-${i}`}
                  review={r}
                  onEdit={openEdit}
                  onToggleFocus={() => setPaused((p) => !p)}
                  dimmed={false}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
            {paused ? "Paused — click any card to resume" : "Click any card to pause & read"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onEdit={openEdit} fixedWidth={false} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <ReviewModal
            key="modal"
            editing={editing}
            remaining={remaining}
            onClose={() => setModalOpen(false)}
            onSaved={() => {
              setModalOpen(false)
              load()
            }}
          />
        )}
        {adminOpen && (
          <AdminPanel
            key="admin"
            reviews={reviews}
            adminCode={adminCode}
            onUnlock={setAdminCode}
            onClose={() => setAdminOpen(false)}
            onChanged={load}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ReviewCard({
  review,
  onEdit,
  onToggleFocus,
  fixedWidth = true,
}: {
  review: Review
  onEdit: (r: Review) => void
  onToggleFocus?: () => void
  fixedWidth?: boolean
  dimmed?: boolean
}) {
  return (
    <div
      onClick={onToggleFocus}
      className={`relative flex flex-col rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-border-strong ${
        fixedWidth ? "w-[340px] shrink-0 cursor-pointer" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <Stars rating={review.rating} />
        {review.owned && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(review)
            }}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5l2 2L5 11l-2.5.5L3 9l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            Edit
          </button>
        )}
      </div>

      <p className="flex-1 text-pretty leading-relaxed text-foreground/90">
        &ldquo;{review.review_text}&rdquo;
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-serif text-sm text-foreground">
          {review.user_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{review.user_name}</p>
          {review.role && (
            <p className="truncate font-mono text-[11px] text-muted-foreground">{review.role}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminPanel({
  reviews,
  adminCode,
  onUnlock,
  onClose,
  onChanged,
}: {
  reviews: Review[]
  adminCode: string | null
  onUnlock: (code: string) => void
  onClose: () => void
  onChanged: () => void
}) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const unlocked = Boolean(adminCode)

  const tryUnlock = async () => {
    if (!code.trim()) return
    setChecking(true)
    setError(null)
    // Validate by attempting a harmless authorized request path: we verify the
    // code client-side by doing a dummy DELETE guard. Instead, just accept and
    // let real deletes confirm — but to give feedback, do a probe delete on a
    // non-existent id which returns 400 (valid code) vs 401 (bad code).
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-code": code.trim() },
        body: JSON.stringify({ id: "__probe__" }),
      })
      if (res.status === 401) {
        setError("Incorrect code.")
        setChecking(false)
        return
      }
      // 400 (missing/other) or 500 means the code was accepted.
      onUnlock(code.trim())
    } catch {
      setError("Network error.")
    } finally {
      setChecking(false)
    }
  }

  const remove = async (id: string) => {
    if (!adminCode) return
    setDeletingId(id)
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        onChanged()
      }
    } catch {
      /* noop */
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-card p-7"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M3 8l3.5 3L12 5l5.5 6L21 8l-1.5 10h-15L3 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
              <path d="M6.5 18h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div>
              <h3 className="font-serif text-2xl text-foreground">Owner tools</h3>
              <p className="text-sm text-muted-foreground">
                {unlocked ? "Manage and remove reviews." : "Enter your secret code to continue."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!unlocked ? (
          <div className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) tryUnlock()
              }}
              placeholder="Secret code"
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center font-mono text-lg tracking-[0.5em] text-foreground outline-none transition-colors placeholder:tracking-normal placeholder:text-muted-foreground/40 focus:border-accent"
            />
            {error && <p className="text-center text-sm text-rose-400">{error}</p>}
            <button
              onClick={tryUnlock}
              disabled={checking}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {checking ? "Checking…" : "Unlock"}
            </button>
          </div>
        ) : (
          <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No reviews to manage.</p>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/60 p-4"
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{r.user_name}</span>
                      <Stars rating={r.rating} size={11} />
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{r.review_text}</p>
                  </div>
                  <button
                    onClick={() => remove(r.id)}
                    disabled={deletingId === r.id}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-destructive-foreground/90 transition-colors hover:bg-destructive/15 disabled:opacity-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 3.5h9M5.5 3.5V2.5h3v1M3.5 3.5l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {deletingId === r.id ? "…" : "Delete"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function ReviewModal({
  editing,
  remaining,
  onClose,
  onSaved,
}: {
  editing: Review | null
  remaining: number
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(editing?.user_name ?? "")
  const [role, setRole] = useState(editing?.role ?? "")
  const [text, setText] = useState(editing?.review_text ?? "")
  const [rating, setRating] = useState(editing?.rating ?? 5)
  const [hover, setHover] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const atLimit = !editing && remaining <= 0

  const submit = async () => {
    if (atLimit) return
    if (!name.trim() || !text.trim()) {
      setError("Please fill in your name and review.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/reviews", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing?.id,
          user_name: name.trim(),
          role: role.trim() || null,
          review_text: text.trim(),
          rating,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.")
        setSubmitting(false)
        return
      }
      onSaved()
    } catch {
      setError("Network error. Try again.")
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border-strong bg-card p-7"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="font-serif text-2xl text-foreground">
              {editing ? "Edit your review" : "Leave a review"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {editing
                ? "Update what you shared earlier."
                : `${remaining} review${remaining === 1 ? "" : "s"} remaining for you.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {atLimit ? (
          <p className="rounded-lg border border-border bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
            You&apos;ve reached the maximum of 2 reviews. You can edit your existing
            ones instead.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Rating
              </label>
              <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.13l-4.95 2.6.94-5.5-4-3.9 5.53-.81L10 1.5z"
                        fill={n <= (hover || rating) ? "var(--color-accent)" : "none"}
                        stroke={n <= (hover || rating) ? "var(--color-accent)" : "var(--color-border-strong)"}
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Role <span className="normal-case opacity-60">(optional)</span>
                </label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  maxLength={40}
                  placeholder="e.g. Server owner"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
                rows={4}
                placeholder="Share your experience…"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent"
              />
              <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground/60">
                {text.length}/280
              </p>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? "Saving…" : editing ? "Save changes" : "Submit review"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
