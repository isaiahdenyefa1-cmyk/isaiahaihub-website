import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Check, AlertCircle, Send, User } from 'lucide-react';
import type { AppReview, AppRatingSummary } from '../types/app.js';

interface ReviewSectionProps {
  appId: string;
  appVersion: string;
  appName: string;
  onReviewAdded?: (summary: AppRatingSummary) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  appId,
  appVersion,
  appName,
  onReviewAdded
}) => {
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [summary, setSummary] = useState<AppRatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reviews?appId=${encodeURIComponent(appId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setReviews(data.reviews || []);
          setSummary(data.summary || null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load reviews from server.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [appId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (reviewerName.trim().length < 2) {
      setFormError('Please enter your name or alias (minimum 2 characters).');
      return;
    }
    if (comment.trim().length < 5) {
      setFormError('Please write a brief review comment (minimum 5 characters).');
      return;
    }
    if (rating < 1 || rating > 5) {
      setFormError('Please select a star rating from 1 to 5.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          reviewerName: reviewerName.trim(),
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          version: appVersion
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      // Add to list and update summary
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
      }
      if (data.summary) {
        setSummary(data.summary);
        if (onReviewAdded) onReviewAdded(data.summary);
      }

      setSubmitSuccess(true);
      setReviewerName('');
      setTitle('');
      setComment('');
      setRating(5);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting review';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReviews = summary?.totalReviews || reviews.length;
  const avgRating = summary?.averageRating || 0;
  const distribution = summary?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className="pt-6 border-t border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Community Ratings & Reviews</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real feedback from Android developers and users.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* Rating Score & Breakdown Strip */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-2 border-b md:border-b-0 md:border-r border-slate-800">
          <span className="text-4xl font-extrabold text-white tabular-nums">
            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(avgRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Right: Distribution Bars */}
        <div className="md:col-span-8 space-y-1.5 text-xs font-mono">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-right text-slate-400 text-[11px]">{star}★</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-500 text-[11px] tabular-nums">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-slate-950/80 border border-slate-700/80 rounded-xl mb-6 space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Submit Review for {appName}
            </h4>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError(null);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="p-2.5 bg-red-950/50 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Thank you! Your review has been recorded.</span>
            </div>
          )}

          {/* Interactive Star Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 focus:outline-none"
                      aria-label={`Rate ${starVal} stars`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Name or Handle *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex M. or @alexdev"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                maxLength={60}
                required
                className="w-full h-9 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Fast and reliable on Android 14"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="w-full h-9 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Your Review / Feedback *
            </label>
            <textarea
              rows={3}
              placeholder="What worked well? How is the performance and stability on your device?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting Review...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading && (
        <div className="text-center py-6 text-xs text-slate-500 font-mono">
          Loading community reviews...
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-4 text-xs text-slate-400 font-mono">
          {error}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl text-center">
          <p className="text-xs text-slate-400 mb-3">
            No reviews yet for this app. Be the first to try it and leave feedback!
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Leave First Review</span>
            </button>
          )}
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl text-xs leading-relaxed"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">
                      {rev.reviewerName}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <span>Tested on v{rev.version}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && (
                <h5 className="font-semibold text-slate-200 text-xs mb-1">
                  {rev.title}
                </h5>
              )}

              <p className="text-slate-300 font-sans text-xs">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
