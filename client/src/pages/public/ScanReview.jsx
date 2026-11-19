import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchApi } from '../../utils/api';

export default function ScanReview({ isUniversal }) {
  const { token } = useParams();
  const isGeneralReview = Boolean(
    isUniversal ||
    !token ||
    token === 'universal' ||
    token === 'general' ||
    token === 'direct'
  );

  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(!isGeneralReview);
  const [error, setError] = useState('');

  // Form State: Only Stars, Customer Name, and Feedback
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isGeneralReview) {
      setLoading(false);
      return;
    }

    fetchApi(`/reviews/token/${token}`)
      .then((res) => {
        if (res.success) setTokenData(res.data);
      })
      .catch((err) => {
        setError(err.message || 'This review link is invalid or has expired.');
      })
      .finally(() => setLoading(false));
  }, [token, isGeneralReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (!feedbackText.trim() || feedbackText.trim().length < 5) {
      setSubmitError('Please write your feedback (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const endpoint = isGeneralReview
        ? '/reviews/universal'
        : `/reviews/token/${token}`;

      const payload = {
        rating,
        customerName: customerName.trim(),
        feedbackText: feedbackText.trim(),
        consentToPublish: true,
      };

      const res = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-semibold text-xs tracking-wide">
            Loading review portal...
          </p>
        </div>
      </div>
    );
  }

  if (!isGeneralReview && (error || !tokenData)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="card p-8 max-w-md w-full text-center bg-white border-slate-200 shadow-xl">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Review Token Inactive</h2>
          <p className="text-slate-600 text-xs mb-6 leading-relaxed">
            {error || 'This QR review token is inactive or has expired.'}
          </p>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/review"
              className="btn btn-primary text-xs flex items-center justify-center gap-1.5"
            >
              Give a Direct Review Instead <Send size={13} />
            </Link>
            <Link to="/" className="btn btn-outline text-xs">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const projectTitle = tokenData?.project?.title || 'Civil & Waterproofing Service';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Brand Header Card */}
        <div className="card p-6 bg-white text-center shadow-lg border-slate-200">
          <img
            src="/sln-logo.png"
            alt="SLN Engineers Projects"
            className="h-14 w-auto object-contain mx-auto mb-2"
          />
          <h2 className="text-base font-black text-slate-900">
            SLN Engineers Projects
          </h2>
          <p className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider mt-0.5">
            Restoration for Three Generations
          </p>
          <div className="h-0.5 w-16 bg-gradient-to-r from-sky-600 to-emerald-500 mx-auto rounded-full mt-2.5"></div>

          {!isGeneralReview && tokenData?.project && (
            <div className="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Project
              </span>
              <span className="text-xs font-extrabold text-slate-800">
                {projectTitle}
              </span>
            </div>
          )}
        </div>

        {/* Feedback Submitted Success State */}
        {submitted ? (
          <div className="card p-8 bg-white text-center shadow-xl border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1.5">
                Thank You, {customerName}!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                Your feedback and {rating}-star rating have been successfully submitted to SLN Engineers Projects.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/api/social/click/whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm w-full sm:w-auto text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={15} /> WhatsApp Support
              </a>
              <Link to="/" className="btn btn-outline btn-sm w-full sm:w-auto text-xs">
                Visit SLN Website
              </Link>
            </div>
          </div>
        ) : (
          /* Simplified Form: Customer Name, Feedback, and Stars */
          <div className="card p-6 sm:p-8 bg-white shadow-xl border-slate-200">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                Customer Review
              </h3>
              <p className="text-xs text-slate-500">
                Please rate your experience with SLN Engineers Projects
              </p>
            </div>

            {submitError && (
              <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs border border-rose-200 mb-5">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Star Rating Selection */}
              <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Rating *
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="p-1 transition-transform active:scale-90 focus:outline-hidden cursor-pointer"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`${star} star rating`}
                    >
                      <Star
                        size={40}
                        className={`transition-colors drop-shadow-xs ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-2">
                  {rating === 5 && '★★★★★ Excellent (5 Stars)'}
                  {rating === 4 && '★★★★☆ Very Good (4 Stars)'}
                  {rating === 3 && '★★★☆☆ Good (3 Stars)'}
                  {rating === 2 && '★★☆☆☆ Average (2 Stars)'}
                  {rating === 1 && '★☆☆☆☆ Poor (1 Star)'}
                </div>
              </div>

              {/* 2. Customer Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="form-input text-xs sm:text-sm w-full py-2.5"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* 3. Written Feedback */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Feedback *
                </label>
                <textarea
                  required
                  rows="4"
                  minLength="5"
                  maxLength="2000"
                  placeholder="Write your review and comments about the service..."
                  className="form-textarea text-xs sm:text-sm w-full"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                ></textarea>
                <div className="text-[11px] text-slate-400 text-right">
                  {feedbackText.length} / 2000 characters
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-sky-950 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
