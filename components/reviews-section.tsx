"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import useSWR, { mutate } from "swr"

interface Review {
  id: string
  user_name: string
  review_text: string
  rating: number
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ReviewsSection() {
  const { data: reviews, error, isLoading } = useSWR<Review[]>("/api/reviews", fetcher, {
    refreshInterval: 30000,
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const progressRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(0)
  const progressWidth = useTransform(progress, [0, 100], ["0%", "100%"])

  // Auto-rotate reviews with progress bar
  useEffect(() => {
    if (!reviews || reviews.length <= 1 || isPaused) {
      progress.set(0)
      return
    }
    
    // Animate progress bar
    const controls = animate(progress, 100, {
      duration: 6,
      ease: "linear",
      onComplete: () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
        progress.set(0)
      }
    })

    return () => controls.stop()
  }, [reviews, currentIndex, isPaused, progress])

  const goToReview = useCallback((index: number) => {
    if (index > currentIndex) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setCurrentIndex(index)
    progress.set(0)
  }, [currentIndex, progress])

  const goToPrevious = useCallback(() => {
    if (!reviews) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    progress.set(0)
  }, [reviews, progress])

  const goToNext = useCallback(() => {
    if (!reviews) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
    progress.set(0)
  }, [reviews, progress])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -15 : 15,
    }),
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-neon-purple to-foreground bg-clip-text text-transparent">
            Reviews
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            What people say about working with me
          </p>
        </motion.div>

        {/* Reviews carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {isLoading ? (
            <div className="cyber-card rounded-xl p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-secondary rounded w-3/4 mx-auto" />
                <div className="h-4 bg-secondary rounded w-1/2 mx-auto" />
                <div className="h-4 bg-secondary rounded w-2/3 mx-auto" />
              </div>
            </div>
          ) : error ? (
            <div className="cyber-card rounded-xl p-8 text-center text-destructive">
              Failed to load reviews. Please try again later.
            </div>
          ) : reviews && reviews.length > 0 ? (
            <>
              {/* Navigation arrows */}
              <motion.button
                onClick={goToPrevious}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 rounded-full bg-secondary/50 border border-border hover:border-neon-purple hover:bg-neon-purple/20 hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
                aria-label="Previous review"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                onClick={goToNext}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 rounded-full bg-secondary/50 border border-border hover:border-neon-purple hover:bg-neon-purple/20 hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
                aria-label="Next review"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* Review card with 3D effect */}
              <div className="overflow-hidden perspective-1000">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={reviews[currentIndex].id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      opacity: { duration: 0.2 }
                    }}
                    className="cyber-card rounded-xl p-8 relative overflow-hidden"
                  >
                    {/* Animated glow effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/10 to-neon-purple/0"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Stars with stagger animation */}
                    <div className="flex justify-center gap-1 mb-6 relative z-10">
                      {[1, 2, 3, 4, 5].map((star, i) => (
                        <motion.svg
                          key={star}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            delay: i * 0.1,
                            type: "spring",
                            stiffness: 500,
                            damping: 15
                          }}
                          className={`w-6 h-6 ${
                            star <= reviews[currentIndex].rating
                              ? "text-acid-green drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                              : "text-muted"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </motion.svg>
                      ))}
                    </div>

                    {/* Review text with typing effect */}
                    <motion.blockquote 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg md:text-xl text-center text-foreground mb-6 italic relative z-10"
                    >
                      &quot;{reviews[currentIndex].review_text}&quot;
                    </motion.blockquote>

                    {/* Author */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center relative z-10"
                    >
                      <p className="font-semibold text-neon-purple">
                        {reviews[currentIndex].user_name}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {new Date(reviews[currentIndex].created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress bar and dots navigation */}
              <div className="mt-6 space-y-4">
                {/* Auto-scroll progress bar */}
                <div className="h-1 bg-secondary rounded-full overflow-hidden mx-auto max-w-xs">
                  <motion.div
                    ref={progressRef}
                    className="h-full bg-gradient-to-r from-neon-purple to-acid-green rounded-full"
                    style={{ width: progressWidth }}
                  />
                </div>

                {/* Dots navigation */}
                <div className="flex justify-center gap-2">
                  {reviews.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToReview(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentIndex
                          ? "bg-gradient-to-r from-neon-purple to-acid-green w-8 shadow-lg shadow-neon-purple/30"
                          : "bg-muted hover:bg-muted-foreground w-2"
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Pause indicator */}
                <AnimatePresence>
                  {isPaused && reviews.length > 1 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-center text-xs text-muted-foreground"
                    >
                      Paused - hover to keep viewing
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="cyber-card rounded-xl p-8 text-center text-muted-foreground">
              No reviews yet. Be the first to leave one!
            </div>
          )}
        </div>

        {/* Add review button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={() => setIsFormOpen(true)}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-neon-purple text-primary-foreground font-medium transition-all duration-300 shadow-lg shadow-neon-purple/25"
          >
            Leave a Review
          </motion.button>
        </motion.div>
      </div>

      {/* Review form modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ReviewFormModal
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false)
              mutate("/api/reviews")
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ReviewFormModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    user_name: "",
    review_text: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit review")
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="cyber-card rounded-xl p-6 md:p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Leave a Review</h3>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-foreground mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              id="user_name"
              required
              maxLength={50}
              value={formData.user_name}
              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all text-foreground"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1.5">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= formData.rating 
                        ? "text-acid-green drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
                        : "text-muted"
                    } transition-colors`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review_text" className="block text-sm font-medium text-foreground mb-1.5">
              Your Review
            </label>
            <textarea
              id="review_text"
              required
              maxLength={500}
              rows={4}
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all resize-none text-foreground"
              placeholder="Share your experience..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.review_text.length}/500 characters
            </p>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 rounded-lg bg-neon-purple text-primary-foreground font-medium hover:bg-neon-purple/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neon-purple/25"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
