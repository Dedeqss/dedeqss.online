"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  // Auto-rotate reviews
  useEffect(() => {
    if (!reviews || reviews.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [reviews])

  const goToReview = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    if (!reviews) return
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews])

  const goToNext = useCallback(() => {
    if (!reviews) return
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }, [reviews])

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
        <div className="relative">
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
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-2 rounded-full bg-secondary/50 border border-border hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all"
                aria-label="Previous review"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-2 rounded-full bg-secondary/50 border border-border hover:border-neon-purple/50 hover:bg-neon-purple/10 transition-all"
                aria-label="Next review"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Review card */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reviews[currentIndex].id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="cyber-card rounded-xl p-8"
                  >
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-6 h-6 ${
                            star <= reviews[currentIndex].rating
                              ? "text-acid-green"
                              : "text-muted"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review text */}
                    <blockquote className="text-lg md:text-xl text-center text-foreground mb-6 italic">
                      &quot;{reviews[currentIndex].review_text}&quot;
                    </blockquote>

                    {/* Author */}
                    <div className="text-center">
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
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots navigation */}
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToReview(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-neon-purple w-6"
                        : "bg-muted hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
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
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 rounded-lg bg-neon-purple text-primary-foreground font-medium hover:bg-neon-purple/80 transition-all duration-300 shadow-lg shadow-neon-purple/25 hover:shadow-neon-purple/40"
          >
            Leave a Review
          </button>
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="cyber-card rounded-xl p-6 md:p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Leave a Review</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= formData.rating ? "text-acid-green" : "text-muted"
                    } transition-colors`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
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
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 rounded-lg bg-neon-purple text-primary-foreground font-medium hover:bg-neon-purple/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
