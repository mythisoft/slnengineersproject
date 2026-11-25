import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Plus,
  Edit3,
  Search,
  Check,
  X,
  MessageSquare,
  Calendar,
  Building2,
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import { DEFAULT_REVIEWS_HERO } from '../../utils/reviewsData';

export default function ReviewsModeration() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'page-content'
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved, Spam
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Reviews Page Header & Copy Content State
  const [heroFormData, setHeroFormData] = useState(DEFAULT_REVIEWS_HERO);
  const [savingHero, setSavingHero] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modal State for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null); // null = Create, object = Edit
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    feedbackText: '',
    projectTitle: '',
    isApproved: true,
    showOnHome: false,
    isSpam: false,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Homepage 4th Review Replacement Modal State
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [pendingReplaceReview, setPendingReplaceReview] = useState(null);

  const loadReviews = () => {
    setLoading(true);
    fetchApi('/admin/reviews')
      .then((res) => {
        if (res.success) setReviews(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    // Also load reviewsPageContent from database
    fetchApi('/admin/reviews/page-content')
      .then((res) => {
        if (res.success && res.data && Object.keys(res.data).length > 0) {
          setHeroFormData((prev) => ({ ...DEFAULT_REVIEWS_HERO, ...prev, ...res.data }));
        } else {
          // Fallback to settings
          fetchApi('/admin/settings').then((sRes) => {
            if (sRes.success && sRes.data?.reviewsPageContent && Object.keys(sRes.data.reviewsPageContent).length > 0) {
              setHeroFormData((prev) => ({ ...DEFAULT_REVIEWS_HERO, ...prev, ...sRes.data.reviewsPageContent }));
            }
          });
        }
      })
      .catch((e) => console.warn('Could not load reviewsPageContent:', e));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Save Reviews Page Content to MongoDB
  const handleSaveHeroContent = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingHero(true);
    try {
      let res;
      try {
        res = await fetchApi('/admin/reviews/page-content', {
          method: 'PUT',
          body: JSON.stringify(heroFormData),
        });
      } catch {
        res = await fetchApi('/admin/settings', {
          method: 'PUT',
          body: JSON.stringify({ reviewsPageContent: heroFormData }),
        });
      }

      if (res && res.success) {
        showToast('Reviews page header & content saved and published to database!');
      } else {
        showToast(res?.message || 'Failed to save to database.', 'error');
      }
    } catch (err) {
      console.error('Error saving review page content:', err);
      showToast(err.message || 'Failed to save to database.', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  // Reset Reviews Page Content to defaults
  const handleResetHeroContent = async () => {
    if (!window.confirm('Reset Reviews page header & content to default text?')) return;
    setSavingHero(true);
    try {
      setHeroFormData(DEFAULT_REVIEWS_HERO);
      let res;
      try {
        res = await fetchApi('/admin/reviews/page-content/reset', {
          method: 'POST',
        });
      } catch {
        res = await fetchApi('/admin/settings', {
          method: 'PUT',
          body: JSON.stringify({ reviewsPageContent: DEFAULT_REVIEWS_HERO }),
        });
      }

      if (res && res.success) {
        showToast('Reviews page content reset to defaults in database.');
      } else {
        showToast(res?.message || 'Failed to reset.', 'error');
      }
    } catch (err) {
      console.error('Error resetting review page content:', err);
      showToast(err.message || 'Failed to reset.', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingReview(null);
    setFormData({
      customerName: '',
      rating: 5,
      feedbackText: '',
      projectTitle: '',
      isApproved: true,
      showOnHome: false,
      isSpam: false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (review) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName || '',
      rating: review.rating || 5,
      feedbackText: review.feedbackText || '',
      projectTitle: review.projectTitle || '',
      isApproved: Boolean(review.isApproved),
      showOnHome: Boolean(review.showOnHome),
      isSpam: Boolean(review.isSpam),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit Create or Edit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setFormError('Customer name is required.');
      return;
    }
    if (!formData.feedbackText.trim() || formData.feedbackText.trim().length < 5) {
      setFormError('Written feedback must be at least 5 characters long.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      if (editingReview) {
        // UPDATE existing review (PUT /admin/reviews/:id)
        const res = await fetchApi(`/admin/reviews/${editingReview._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setReviews((prev) =>
            prev.map((r) => (r._id === editingReview._id ? res.data : r))
          );
          setIsModalOpen(false);
          showToast('Review updated successfully!', 'success');
          window.dispatchEvent(new Event('sln_reviews_updated'));
        } else {
          setFormError(res.message || 'Failed to update review.');
        }
      } else {
        // CREATE new review (POST /admin/reviews)
        const res = await fetchApi('/admin/reviews', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setReviews((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          showToast('New customer review added & published successfully!', 'success');
          window.dispatchEvent(new Event('sln_reviews_updated'));
        } else {
          setFormError(res.message || 'Failed to create review.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Fast Update Status (Approve / Unpublish / Spam)
  const handleUpdateStatus = async (id, updates) => {
    try {
      const res = await fetchApi(`/admin/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...updates } : r))
        );
        if (updates.isApproved === true) {
          showToast('Review approved & published live to public website!', 'success');
        } else if (updates.isApproved === false) {
          showToast('Review unpublished from public website.', 'info');
        } else if (updates.isSpam === true) {
          showToast('Review moved to Spam.', 'warning');
        } else if (updates.isSpam === false) {
          showToast('Review restored from Spam.', 'success');
        }
        window.dispatchEvent(new Event('sln_reviews_updated'));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update review status', 'error');
    }
  };

  // Fast Toggle for Homepage Feature (Max 3 Reviews)
  const handleToggleHome = async (rev) => {
    const isCurrentlyHome = Boolean(rev.showOnHome);
    const nextState = !isCurrentlyHome;
    if (nextState) {
      const currentHomeReviews = reviews.filter((r) => r.showOnHome && r._id !== rev._id);
      if (currentHomeReviews.length >= 3) {
        // Open Replace Modal to let admin pick which one to remove!
        setPendingReplaceReview(rev);
        setIsReplaceModalOpen(true);
        return;
      }
    }

    try {
      const targetOrder = nextState ? (homeFeaturedReviews.length + 1) : 0;
      const res = await fetchApi(`/admin/reviews/${rev._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ showOnHome: nextState, homeOrder: targetOrder }),
      });
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === rev._id ? { ...r, showOnHome: nextState, homeOrder: targetOrder } : r))
        );
        showToast(
          nextState ? '★ Review pinned to Homepage Testimonials!' : 'Review removed from Homepage.',
          nextState ? 'success' : 'info'
        );
        window.dispatchEvent(new Event('sln_reviews_updated'));
      } else {
        showToast(res.message || 'Failed to update homepage status', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update homepage status', 'error');
    }
  };

  // Replace one of the 3 existing homepage reviews with the newly selected review
  const handleReplaceReview = async (reviewToReplaceId) => {
    if (!pendingReplaceReview) return;
    const oldReview = reviews.find((r) => r._id === reviewToReplaceId);
    const targetOrder = oldReview?.homeOrder || 1;

    try {
      const res = await fetchApi(`/admin/reviews/${pendingReplaceReview._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          showOnHome: true,
          replaceReviewId: reviewToReplaceId,
          homeOrder: targetOrder,
        }),
      });

      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => {
            if (r._id === reviewToReplaceId) {
              return { ...r, showOnHome: false, homeOrder: 0 };
            }
            if (r._id === pendingReplaceReview._id) {
              return { ...r, showOnHome: true, homeOrder: targetOrder };
            }
            return r;
          })
        );
        showToast(
          `★ Replaced "${oldReview?.customerName}" with "${pendingReplaceReview.customerName}" on Homepage!`,
          'success'
        );
        window.dispatchEvent(new Event('sln_reviews_updated'));
        setIsReplaceModalOpen(false);
        setPendingReplaceReview(null);
      } else {
        showToast(res.message || 'Failed to replace review', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to replace review', 'error');
    }
  };

  // Reorder homepage reviews using Left/Right or Up/Down arrows
  const handleMoveHomeReview = async (reviewId, direction) => {
    const currentIndex = homeFeaturedReviews.findIndex((r) => r._id === reviewId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' || direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= homeFeaturedReviews.length) return;

    const newOrderedList = [...homeFeaturedReviews];
    const [moved] = newOrderedList.splice(currentIndex, 1);
    newOrderedList.splice(targetIndex, 0, moved);

    const orderedIds = newOrderedList.map((r) => r._id);

    // Optimistically update local state
    setReviews((prev) =>
      prev.map((r) => {
        const orderIdx = orderedIds.indexOf(r._id);
        if (orderIdx !== -1) {
          return { ...r, homeOrder: orderIdx + 1, showOnHome: true };
        }
        return r;
      })
    );

    try {
      const res = await fetchApi('/admin/reviews/reorder/home', {
        method: 'PATCH',
        body: JSON.stringify({ orderedIds }),
      });
      if (res.success) {
        showToast('Homepage reviews display order updated!', 'success');
        window.dispatchEvent(new Event('sln_reviews_updated'));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order', 'error');
    }
  };

  // DELETE Single Review
  const handleDeleteReview = async (id, customerName) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the review from "${customerName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetchApi(`/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        showToast('Review deleted permanently.', 'error');
        window.dispatchEvent(new Event('sln_reviews_updated'));
      } else {
        showToast(res.message || 'Failed to delete review', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete review', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Multi-Select Helpers
  const handleToggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReviews.map((r) => r._id));
    }
  };

  // BULK DELETE
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} selected reviews? This cannot be undone.`
      )
    ) {
      return;
    }

    setBulkProcessing(true);
    try {
      const deletePromises = selectedIds.map((id) =>
        fetchApi(`/admin/reviews/${id}`, { method: 'DELETE' })
      );
      await Promise.allSettled(deletePromises);
      setReviews((prev) => prev.filter((r) => !selectedIds.includes(r._id)));
      setSelectedIds([]);
    } catch (err) {
      alert(err.message || 'Failed to delete selected reviews');
    } finally {
      setBulkProcessing(false);
    }
  };

  // Filtered Reviews computation
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Status filter
      if (filter === 'Pending' && (r.isApproved || r.isSpam)) return false;
      if (filter === 'Approved' && (!r.isApproved || r.isSpam)) return false;
      if (filter === 'Home' && !r.showOnHome) return false;
      if (filter === 'Spam' && !r.isSpam) return false;

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = r.customerName?.toLowerCase().includes(query);
        const textMatch = r.feedbackText?.toLowerCase().includes(query);
        const projMatch = r.projectTitle?.toLowerCase().includes(query);
        return nameMatch || textMatch || projMatch;
      }
      return true;
    });
  }, [reviews, filter, searchTerm]);

  // 3 Featured Reviews on Homepage, sorted strictly by homeOrder
  const homeFeaturedReviews = useMemo(() => {
    return reviews
      .filter((r) => r.showOnHome)
      .sort((a, b) => {
        const orderA = typeof a.homeOrder === 'number' && a.homeOrder > 0 ? a.homeOrder : 999;
        const orderB = typeof b.homeOrder === 'number' && b.homeOrder > 0 ? b.homeOrder : 999;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [reviews]);

  // Counts for tabs
  const pendingCount = reviews.filter((r) => !r.isApproved && !r.isSpam).length;
  const approvedCount = reviews.filter((r) => r.isApproved && !r.isSpam).length;
  const homeCount = reviews.filter((r) => r.showOnHome).length;
  const spamCount = reviews.filter((r) => r.isSpam).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-emerald-600 text-white shadow-emerald-600/30'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Customer Reviews &amp; Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full reviews management: moderate client ratings and customize the public review page header &amp; copy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === 'reviews' && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn btn-primary btn-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs font-bold"
            >
              <Plus size={15} />
              <span>Add New Review</span>
            </button>
          )}

          {activeTab === 'page-content' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetHeroContent}
                disabled={savingHero}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer bg-white text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={13} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSaveHeroContent}
                disabled={savingHero}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold shadow-md shadow-sky-600/30 cursor-pointer"
              >
                <Save size={14} />
                <span>{savingHero ? 'Saving...' : 'Save & Publish'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern High-Level Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Star size={14} />
          <span>Client Reviews List ({reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('page-content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'page-content'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles size={14} />
          <span>Review Page Header &amp; Copy (CRUD)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: CLIENT REVIEWS LIST & MODERATION TABLE                         */}
      {/* ===================================================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* ======================================================== */}
          {/* HOMEPAGE FEATURED REVIEWS STRIP (3 SLOTS & ORDER ARROWS) */}
          {/* ======================================================== */}
          <div className="card p-4 sm:p-5 bg-gradient-to-r from-amber-50/70 via-amber-50/30 to-sky-50/40 border border-amber-200/90 shadow-sm rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black shadow-xs">
                  <Star size={14} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    Homepage Featured Testimonials (Max 3 Slots)
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Use order arrows ◀ ▶ to arrange slot positions (Slot 1 = Left, Slot 2 = Center, Slot 3 = Right on Homepage)
                  </p>
                </div>
              </div>
              <span className="badge text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 self-start sm:self-auto">
                {homeFeaturedReviews.length}/3 Slots Filled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[0, 1, 2].map((slotIndex) => {
                const rev = homeFeaturedReviews[slotIndex];
                const slotLabels = ['Slot 1 (Left)', 'Slot 2 (Center)', 'Slot 3 (Right)'];
                return (
                  <div
                    key={slotIndex}
                    className={`p-3 rounded-xl border transition-all ${
                      rev
                        ? 'bg-white border-amber-300 shadow-xs'
                        : 'bg-white/60 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[110px] text-center'
                    }`}
                  >
                    {rev ? (
                      <div className="flex flex-col justify-between h-full space-y-2">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                              {slotLabels[slotIndex]}
                            </span>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} size={10} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {rev.customerName}
                          </h4>
                          <p className="text-[11px] text-slate-600 line-clamp-2 italic mt-0.5">
                            “{rev.feedbackText}”
                          </p>
                        </div>

                        {/* Order Controls & Unpin */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            {/* Move Left / Earlier Arrow */}
                            <button
                              type="button"
                              onClick={() => handleMoveHomeReview(rev._id, 'left')}
                              disabled={slotIndex === 0}
                              className={`p-1 rounded-md text-xs border transition-colors ${
                                slotIndex === 0
                                  ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                                  : 'text-slate-700 border-slate-300 hover:bg-amber-100 hover:text-amber-800 active:scale-95 cursor-pointer'
                              }`}
                              title={slotIndex === 0 ? 'Already in leftmost slot' : 'Move Left (earlier)'}
                            >
                              <ArrowLeft size={13} />
                            </button>

                            {/* Move Right / Later Arrow */}
                            <button
                              type="button"
                              onClick={() => handleMoveHomeReview(rev._id, 'right')}
                              disabled={slotIndex === homeFeaturedReviews.length - 1}
                              className={`p-1 rounded-md text-xs border transition-colors ${
                                slotIndex === homeFeaturedReviews.length - 1
                                  ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                                  : 'text-slate-700 border-slate-300 hover:bg-amber-100 hover:text-amber-800 active:scale-95 cursor-pointer'
                              }`}
                              title={
                                slotIndex === homeFeaturedReviews.length - 1
                                  ? 'Already in rightmost slot'
                                  : 'Move Right (later)'
                              }
                            >
                              <ArrowRight size={13} />
                            </button>
                          </div>

                          {/* Unpin button */}
                          <button
                            type="button"
                            onClick={() => handleToggleHome(rev)}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            title="Remove from Homepage"
                          >
                            <X size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {slotLabels[slotIndex]}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Empty Slot — Click “Show on Home” on any review below to feature here.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="card p-3 bg-white border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'All'
                ? 'bg-sky-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'Pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('Approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'Approved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('Home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'Home'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Homepage ({homeCount}/3)
          </button>
          <button
            onClick={() => setFilter('Spam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'Spam'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Spam ({spamCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, text, project..."
            className="form-input text-xs pl-8 pr-3 py-1.5 w-full bg-slate-50 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {filteredReviews.length > 0 && (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === filteredReviews.length
                }
                onChange={handleSelectAll}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
              />
              <span>Select All in View ({filteredReviews.length})</span>
            </label>

            {selectedIds.length > 0 && (
              <span className="text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded-md">
                {selectedIds.length} selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkProcessing}
              className="btn btn-outline border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white btn-sm py-1 px-3 text-xs flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={13} className={bulkProcessing ? 'animate-spin' : ''} />
              <span>
                {bulkProcessing
                  ? 'Deleting...'
                  : `Delete Selected (${selectedIds.length})`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card p-12 text-center text-slate-400 text-xs">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="card p-12 text-center text-slate-500 text-xs">
            No reviews match the current filters.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isChecked = selectedIds.includes(rev._id);
            return (
              <div
                key={rev._id}
                className={`card p-5 bg-white border-slate-200 flex flex-col md:flex-row items-start justify-between gap-6 hover:shadow-md transition-shadow border-l-4 ${
                  rev.isApproved
                    ? 'border-l-emerald-500'
                    : rev.isSpam
                    ? 'border-l-rose-500'
                    : 'border-l-amber-500'
                }`}
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleToggleSelect(rev._id, e)}
                      className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer shrink-0"
                    />

                    {/* Stars */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                          className={i < rev.rating ? 'text-amber-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>

                    <span className="font-extrabold text-slate-900 text-sm">
                      {rev.customerName}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`badge text-[11px] font-bold ${
                        rev.isApproved
                          ? 'badge-green'
                          : rev.isSpam
                          ? 'badge-slate'
                          : 'badge-amber'
                      }`}
                    >
                      {rev.isApproved
                        ? 'Approved Public'
                        : rev.isSpam
                        ? 'Flagged Spam'
                        : 'Pending Review'}
                    </span>

                    {/* Show on Home (Star Icon) + Order Arrows */}
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleHome(rev)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          rev.showOnHome
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs hover:bg-amber-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400 hover:bg-amber-50/70'
                        }`}
                        title={
                          rev.showOnHome
                            ? 'Featured on Homepage (Click to unpin)'
                            : 'Show on Home: Pins this review to the Homepage Testimonial section (up to 3)'
                        }
                      >
                        <Star
                          size={13}
                          fill={rev.showOnHome ? 'currentColor' : 'none'}
                          className={rev.showOnHome ? 'text-white' : 'text-amber-500'}
                        />
                        <span>
                          {rev.showOnHome
                            ? `★ Slot #${homeFeaturedReviews.findIndex((h) => h._id === rev._id) + 1}`
                            : 'Show on Home'}
                        </span>
                      </button>

                      {/* Order Arrows for reviews featured on Home */}
                      {rev.showOnHome && (
                        <div className="inline-flex items-center border border-slate-200 rounded-full bg-white p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleMoveHomeReview(rev._id, 'left')}
                            disabled={homeFeaturedReviews.findIndex((h) => h._id === rev._id) === 0}
                            className={`p-1 rounded-full transition-colors ${
                              homeFeaturedReviews.findIndex((h) => h._id === rev._id) === 0
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-amber-100 hover:text-amber-800 cursor-pointer'
                            }`}
                            title="Move earlier in Homepage order (← Left)"
                          >
                            <ArrowLeft size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveHomeReview(rev._id, 'right')}
                            disabled={
                              homeFeaturedReviews.findIndex((h) => h._id === rev._id) ===
                              homeFeaturedReviews.length - 1
                            }
                            className={`p-1 rounded-full transition-colors ${
                              homeFeaturedReviews.findIndex((h) => h._id === rev._id) ===
                              homeFeaturedReviews.length - 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-amber-100 hover:text-amber-800 cursor-pointer'
                            }`}
                            title="Move later in Homepage order (Right →)"
                          >
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Text Quote */}
                  <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    “{rev.feedbackText}”
                  </p>

                  {/* Metadata Row (No Date) */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5 flex-wrap">
                    {rev.projectTitle && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} className="text-sky-600" />
                        <span>{rev.projectTitle}</span>
                      </span>
                    )}
                    {rev.token && (
                      <>
                        {rev.projectTitle && <span>•</span>}
                        <span className="font-mono text-[10px] text-slate-400">
                          Source: {rev.token === 'universal' ? 'Universal QR' : rev.token === 'admin-created' ? 'Admin Entry' : 'Handover Token'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* CRUD Action Buttons */}
                <div className="flex items-center md:flex-col gap-2 shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Approve / Publish (Green Checkmark) vs Unpublish */}
                  {!rev.isApproved ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(rev._id, { isApproved: true, isSpam: false })
                      }
                      className="btn btn-success btn-sm text-xs flex items-center justify-center gap-1.5 w-full md:w-auto"
                      title="Approve / Publish: Immediately makes the review live and visible on the public Customer Reviews page"
                    >
                      <CheckCircle size={14} className="text-white" />
                      <span>Approve / Publish</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev._id, { isApproved: false })}
                      className="btn btn-outline border-amber-300 text-amber-700 hover:bg-amber-50 btn-sm text-xs flex items-center justify-center gap-1.5 w-full md:w-auto"
                      title="Unpublish: Temporarily hides the review from the public website without deleting it"
                    >
                      <XCircle size={14} className="text-amber-600" />
                      <span>Unpublish</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 w-full md:w-auto">
                    {/* Edit (Pencil Icon) */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(rev)}
                      className="btn btn-outline border-slate-200 text-slate-700 hover:bg-slate-100 btn-sm text-xs flex items-center justify-center gap-1 flex-1 md:flex-initial"
                      title="Edit: Allows you to fix typos or link the review to a specific project"
                    >
                      <Edit3 size={13} className="text-sky-600" />
                      <span>Edit</span>
                    </button>

                    {/* Mark as Spam / Unmark Spam */}
                    {!rev.isSpam ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(rev._id, { isSpam: true, isApproved: false })
                        }
                        className="btn btn-outline border-rose-200 text-rose-600 hover:bg-rose-50 btn-sm text-xs flex items-center justify-center gap-1 px-2.5"
                        title="Mark as Spam: Moves irrelevant or fake reviews to the Spam tab"
                      >
                        <AlertTriangle size={13} />
                        <span className="hidden sm:inline">Spam</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(rev._id, { isSpam: false })}
                        className="btn btn-outline border-slate-200 text-slate-600 hover:bg-slate-100 btn-sm text-xs"
                        title="Un-spam: Moves back to active reviews"
                      >
                        Un-spam
                      </button>
                    )}

                    {/* Delete Permanently */}
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev._id, rev.customerName)}
                      disabled={deletingId === rev._id}
                      className="btn btn-outline border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white btn-sm text-xs flex items-center justify-center p-2"
                      title="Delete: Permanently removes the review from the database"
                    >
                      <Trash2
                        size={13}
                        className={deletingId === rev._id ? 'animate-spin' : ''}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: REVIEWS PAGE HEADER & COPY (CRUD CONTROLS)                     */}
      {/* ===================================================================== */}
      {activeTab === 'page-content' && (
        <div className="space-y-6">
          {/* Banner Bar with status and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20 shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-sky-950">
                  Live Public Header &amp; Copy Editor for /reviews
                </h3>
                <p className="text-xs text-sky-800/80 mt-0.5">
                  Update the hero title, lineage badge, Google review callout, 4 trust metrics, and testimonial catalog headings. Changes publish immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/reviews"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer bg-white text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink size={13} />
                <span>Open Live Page</span>
              </a>
              <button
                type="button"
                onClick={handleSaveHeroContent}
                disabled={savingHero}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold shadow-md shadow-sky-600/30 cursor-pointer"
              >
                <Save size={14} />
                <span>{savingHero ? 'Saving...' : 'Save & Publish'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Hero Simulation / Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye size={13} />
                <span>Live Hero Preview (As seen on /reviews)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Real-time preview of public hero styling
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#f0f9ff] via-[#e0f2fe]/80 to-[#f8fafc] text-slate-900 p-6 sm:p-8 border border-sky-200 shadow-md">
              <div className="relative z-10 max-w-2xl space-y-4">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-300 text-[#0284c7] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] shrink-0" />
                  <span>{heroFormData.badge || '40 Years of Field Engineering • Three Generations'}</span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {heroFormData.title || 'Customer Reviews'}{' '}
                  {heroFormData.titleAccent && (
                    <span className="text-[#0284c7] font-extrabold">{heroFormData.titleAccent}</span>
                  )}
                </h1>

                {/* Narrative */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  {heroFormData.description || 'Genuine experiences submitted by property owners, luxury villa residents, facility managers, and civil architects through our tamper-proof handover QR-code warranty system.'}
                </p>

                {/* Star rating preview */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm font-black text-slate-900">5.0</span>
                  <span className="text-xs text-slate-500 font-medium">Based on verified client reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls for Review Page Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders size={16} className="text-sky-600" />
                <span>1. Hero Header &amp; Subtitle Copy</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the badge, primary headline, accented text, and description paragraph.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={heroFormData.badge || ''}
                  onChange={(e) => setHeroFormData({ ...heroFormData, badge: e.target.value })}
                  placeholder="e.g. 40 Years of Field Engineering • Three Generations"
                  className="form-input text-xs w-full py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Title Prefix
                </label>
                <input
                  type="text"
                  value={heroFormData.title || ''}
                  onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  placeholder="e.g. Customer Reviews"
                  className="form-input text-xs w-full py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Accented Colored Title (Blue)
                </label>
                <input
                  type="text"
                  value={heroFormData.titleAccent || ''}
                  onChange={(e) => setHeroFormData({ ...heroFormData, titleAccent: e.target.value })}
                  placeholder="e.g. & Feedback"
                  className="form-input text-xs w-full py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hero Technical Narrative / Description
                </label>
                <textarea
                  rows="3"
                  value={heroFormData.description || ''}
                  onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                  placeholder="Explain your customer verification and quality review system..."
                  className="form-input text-xs w-full py-2"
                />
              </div>
            </div>

            {/* Google Review Box Section */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <Star size={16} className="text-amber-500" />
                <span>2. Google Business Profile Callout Card</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Customize the copy on the floating Google Review card in the hero section.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Headline
                  </label>
                  <input
                    type="text"
                    value={heroFormData.googleCardHeadline || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, googleCardHeadline: e.target.value })}
                    placeholder="e.g. Review Us on"
                    className="form-input text-xs w-full py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Sub-headline
                  </label>
                  <input
                    type="text"
                    value={heroFormData.googleCardSubheadline || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, googleCardSubheadline: e.target.value })}
                    placeholder="e.g. Google Business Profile"
                    className="form-input text-xs w-full py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description Text
                  </label>
                  <input
                    type="text"
                    value={heroFormData.googleCardDescription || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, googleCardDescription: e.target.value })}
                    placeholder="e.g. We believe in total transparency. We invite all clients to share their candid feedback on our public Google Business listing."
                    className="form-input text-xs w-full py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={heroFormData.googleCardCtaText || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, googleCardCtaText: e.target.value })}
                    placeholder="e.g. Give a Customer Review"
                    className="form-input text-xs w-full py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    External Google CTA Text
                  </label>
                  <input
                    type="text"
                    value={heroFormData.googleCardExternalText || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, googleCardExternalText: e.target.value })}
                    placeholder="e.g. Write a Google Review"
                    className="form-input text-xs w-full py-2"
                  />
                </div>
              </div>
            </div>

            {/* 4 Trust Metric Tiles Section */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>3. Four Trust Metric Banners</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Customize the 4 horizontal metric cards placed below the hero section.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tile 1 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-700 block">Metric 1 (Rating)</span>
                  <input
                    type="text"
                    value={heroFormData.trustTile1Value || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile1Value: e.target.value })}
                    placeholder="5.0 / 5.0"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile1Label || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile1Label: e.target.value })}
                    placeholder="Average Star Rating"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile1Sub || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile1Sub: e.target.value })}
                    placeholder="100% Verified Clients"
                    className="form-input text-xs w-full py-1.5"
                  />
                </div>

                {/* Tile 2 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-sky-700 block">Metric 2 (Lineage)</span>
                  <input
                    type="text"
                    value={heroFormData.trustTile2Value || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile2Value: e.target.value })}
                    placeholder="3"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile2Label || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile2Label: e.target.value })}
                    placeholder="Generations of Engineers"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile2Sub || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile2Sub: e.target.value })}
                    placeholder="Family-Led Integrity"
                    className="form-input text-xs w-full py-1.5"
                  />
                </div>

                {/* Tile 3 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-sky-700 block">Metric 3 (Track Record)</span>
                  <input
                    type="text"
                    value={heroFormData.trustTile3Value || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile3Value: e.target.value })}
                    placeholder="1,450+"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile3Label || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile3Label: e.target.value })}
                    placeholder="Zero-Leak Sites Sealed"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile3Sub || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile3Sub: e.target.value })}
                    placeholder="Zero Re-leak Failures"
                    className="form-input text-xs w-full py-1.5"
                  />
                </div>

                {/* Tile 4 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-700 block">Metric 4 (Verification)</span>
                  <input
                    type="text"
                    value={heroFormData.trustTile4Value || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile4Value: e.target.value })}
                    placeholder="QR Handover"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile4Label || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile4Label: e.target.value })}
                    placeholder="Authentic QR Verification"
                    className="form-input text-xs w-full py-1.5"
                  />
                  <input
                    type="text"
                    value={heroFormData.trustTile4Sub || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, trustTile4Sub: e.target.value })}
                    placeholder="Bonded Warranty Included"
                    className="form-input text-xs w-full py-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials Catalog Section */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <Star size={16} className="text-sky-600" />
                <span>4. Reviews Catalog Section Headings</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Headings above the grid of client testimonial cards.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Section Subtitle / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={heroFormData.catalogSubtitle || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, catalogSubtitle: e.target.value })}
                    placeholder="e.g. Field Verified Testimonials"
                    className="form-input text-xs w-full py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Section Main Title
                  </label>
                  <input
                    type="text"
                    value={heroFormData.catalogTitle || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, catalogTitle: e.target.value })}
                    placeholder="e.g. Real Experiences From Property Owners"
                    className="form-input text-xs w-full py-2"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetHeroContent}
                disabled={savingHero}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveHeroContent}
                disabled={savingHero}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold shadow-md shadow-sky-600/30 cursor-pointer"
              >
                <Save size={14} />
                <span>{savingHero ? 'Saving...' : 'Save & Publish Reviews Content'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingReview ? 'Edit Customer Review' : 'Add New Customer Review'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* 1. Star Rating Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Star Rating *
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="p-1 cursor-pointer transition-transform active:scale-95"
                    >
                      <Star
                        size={28}
                        className={
                          formData.rating >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {formData.rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* 2. Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sundaram"
                  className="form-input text-xs w-full py-2.5 rounded-xl border border-slate-300"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                />
              </div>

              {/* 3. Written Feedback Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Feedback Message *
                </label>
                <textarea
                  required
                  rows="4"
                  minLength="5"
                  maxLength="2000"
                  placeholder="Customer feedback details..."
                  className="form-textarea text-xs w-full rounded-xl border border-slate-300"
                  value={formData.feedbackText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, feedbackText: e.target.value }))
                  }
                ></textarea>
                <div className="text-[11px] text-slate-400 text-right mt-0.5">
                  {formData.feedbackText.length} / 2000 characters
                </div>
              </div>

              {/* Show on Homepage Star Toggle (Max 3) */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span>Show on Home (Homepage Testimonials, Max 3)</span>
                    <span className="text-[10px] text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full font-bold">
                      {reviews.filter((r) => r.showOnHome && (!editingReview || r._id !== editingReview._id)).length}/3 Selected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Feature this review prominently in the 3 testimonial cards on the public homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.showOnHome) {
                      const currentHomeCount = reviews.filter(
                        (r) => r.showOnHome && (!editingReview || r._id !== editingReview._id)
                      ).length;
                      if (currentHomeCount >= 3) {
                        showToast(
                          'Maximum of 3 reviews can be featured on the Homepage. Please unpin another review first.',
                          'warning'
                        );
                        return;
                      }
                      setFormData((prev) => ({ ...prev, showOnHome: true }));
                    } else {
                      setFormData((prev) => ({ ...prev, showOnHome: false }));
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    formData.showOnHome
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs hover:bg-amber-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400 hover:bg-amber-50/70'
                  }`}
                >
                  <Star
                    size={13}
                    fill={formData.showOnHome ? 'currentColor' : 'none'}
                    className={formData.showOnHome ? 'text-white' : 'text-amber-500'}
                  />
                  <span>{formData.showOnHome ? '★ On Homepage' : 'Pin to Home'}</span>
                </button>
              </div>

              {/* Publication Status Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modalIsApproved"
                  checked={formData.isApproved}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isApproved: e.target.checked }))
                  }
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="modalIsApproved"
                  className="text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Publish immediately on website (Approved)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline btn-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn btn-primary btn-sm text-xs font-bold flex items-center gap-1.5"
                >
                  {formSubmitting
                    ? 'Saving...'
                    : editingReview
                    ? 'Update Review'
                    : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REPLACE A HOMEPAGE REVIEW (WHEN 4TH IS SELECTED)   */}
      {/* ======================================================== */}
      {isReplaceModalOpen && pendingReplaceReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Star size={18} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    Replace a Homepage Review
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Only 3 reviews can be featured on the Homepage.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  setPendingReplaceReview(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <p className="font-semibold">
                You selected <span className="font-black text-amber-950">“{pendingReplaceReview.customerName}”</span> ({pendingReplaceReview.rating}★) to feature on the Homepage.
              </p>
              <p className="mt-1 text-[11.5px] text-amber-800">
                Please select which of the current 3 reviews to remove and replace:
              </p>
            </div>

            {/* 3 Existing Reviews to Choose from */}
            <div className="space-y-2.5">
              {homeFeaturedReviews.map((currRev, idx) => (
                <div
                  key={currRev._id}
                  onClick={() => handleReplaceReview(currRev._id)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Slot #{idx + 1}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(currRev.rating || 5)].map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900 truncate">
                      {currRev.customerName}
                    </div>
                    <div className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                      “{currRev.feedbackText}”
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplaceReview(currRev._id);
                    }}
                    className="btn btn-primary btn-sm text-xs shrink-0 whitespace-nowrap cursor-pointer"
                  >
                    Replace This
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  setPendingReplaceReview(null);
                }}
                className="btn btn-outline btn-sm text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
