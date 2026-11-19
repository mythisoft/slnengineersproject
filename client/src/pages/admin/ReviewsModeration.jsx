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
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

export default function ReviewsModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved, Spam
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

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

  const loadReviews = () => {
    setLoading(true);
    fetchApi('/admin/reviews')
      .then((res) => {
        if (res.success) setReviews(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingReview(null);
    setFormData({
      customerName: '',
      rating: 5,
      feedbackText: '',
      projectTitle: 'Precision Waterproofing & Restoration',
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
      }
    } catch (err) {
      alert(err.message || 'Failed to update review status');
    }
  };

  // Fast Toggle for Homepage Feature (Max 3 Reviews)
  const handleToggleHome = async (rev) => {
    const isCurrentlyHome = Boolean(rev.showOnHome);
    if (!isCurrentlyHome) {
      const homeCount = reviews.filter((r) => r.showOnHome).length;
      if (homeCount >= 3) {
        alert(
          'Maximum of 3 reviews can be featured on the Homepage. Please deselect another review first.'
        );
        return;
      }
    }

    try {
      const res = await fetchApi(`/admin/reviews/${rev._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ showOnHome: !isCurrentlyHome }),
      });
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === rev._id ? { ...r, showOnHome: !isCurrentlyHome } : r))
        );
      } else {
        alert(res.message || 'Failed to update homepage status');
      }
    } catch (err) {
      alert(err.message || 'Failed to update homepage status');
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
      } else {
        alert(res.message || 'Failed to delete review');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete review');
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

  // Counts for tabs
  const pendingCount = reviews.filter((r) => !r.isApproved && !r.isSpam).length;
  const approvedCount = reviews.filter((r) => r.isApproved && !r.isSpam).length;
  const homeCount = reviews.filter((r) => r.showOnHome).length;
  const spamCount = reviews.filter((r) => r.isSpam).length;

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Customer Reviews &amp; Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full review management: create, edit, approve, or delete client testimonials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="btn btn-primary btn-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm text-xs font-bold"
        >
          <Plus size={15} />
          <span>Add New Review</span>
        </button>
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

                    {/* Radio Button for Homepage Feature (Max 3) */}
                    <button
                      type="button"
                      onClick={() => handleToggleHome(rev)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        rev.showOnHome
                          ? 'bg-amber-500 text-white border-amber-600 shadow-2xs hover:bg-amber-600'
                          : 'bg-slate-50 text-slate-600 border-slate-300 hover:border-amber-400 hover:bg-amber-50/70'
                      }`}
                      title={
                        rev.showOnHome
                          ? 'Click to remove from Homepage'
                          : 'Click to feature on Homepage (Up to 3 only)'
                      }
                    >
                      <input
                        type="radio"
                        readOnly
                        checked={Boolean(rev.showOnHome)}
                        className="accent-amber-600 w-3.5 h-3.5 cursor-pointer pointer-events-none"
                      />
                      <span>{rev.showOnHome ? '★ On Homepage' : 'Add to Home'}</span>
                    </button>
                  </div>

                  {/* Feedback Text Quote */}
                  <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    “{rev.feedbackText}”
                  </p>

                  {/* Metadata Row (Date removed as requested) */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} className="text-sky-600" />
                      <span>{rev.projectTitle || 'Waterproofing Service'}</span>
                    </span>
                    {rev.token && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Source: {rev.token === 'universal' ? 'Universal QR' : rev.token === 'admin-created' ? 'Admin Entry' : 'Handover Token'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* CRUD Action Buttons */}
                <div className="flex items-center md:flex-col gap-2 shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Approve / Unpublish Button */}
                  {!rev.isApproved ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(rev._id, { isApproved: true, isSpam: false })
                      }
                      className="btn btn-success btn-sm text-xs flex items-center justify-center gap-1.5 w-full md:w-auto"
                      title="Publish review on public website"
                    >
                      <CheckCircle size={13} />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev._id, { isApproved: false })}
                      className="btn btn-outline btn-sm text-xs flex items-center justify-center gap-1.5 w-full md:w-auto"
                      title="Unpublish from website"
                    >
                      <XCircle size={13} />
                      <span>Unpublish</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 w-full md:w-auto">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(rev)}
                      className="btn btn-outline border-slate-200 text-slate-700 hover:bg-slate-100 btn-sm text-xs flex items-center justify-center gap-1 flex-1 md:flex-initial"
                      title="Edit review text & details"
                    >
                      <Edit3 size={13} className="text-sky-600" />
                      <span>Edit</span>
                    </button>

                    {/* Spam Toggle Button */}
                    {!rev.isSpam ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(rev._id, { isSpam: true, isApproved: false })
                        }
                        className="btn btn-outline border-slate-200 text-rose-600 hover:bg-rose-50 btn-sm text-xs flex items-center justify-center gap-1"
                        title="Mark as Spam"
                      >
                        <AlertTriangle size={13} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(rev._id, { isSpam: false })}
                        className="btn btn-outline border-slate-200 text-slate-600 hover:bg-slate-100 btn-sm text-xs"
                        title="Unmark spam"
                      >
                        Un-spam
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev._id, rev.customerName)}
                      disabled={deletingId === rev._id}
                      className="btn btn-outline border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white btn-sm text-xs flex items-center justify-center p-2"
                      title="Delete review permanently"
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
              {/* Star Rating Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rating *
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

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sundaram"
                  className="form-input text-xs w-full py-2"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                />
              </div>

              {/* Project / Service Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project or Service Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penthouse Terrace Waterproofing, Banjara Hills"
                  className="form-input text-xs w-full py-2"
                  value={formData.projectTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, projectTitle: e.target.value }))
                  }
                />
              </div>

              {/* Written Feedback Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Written Feedback *
                </label>
                <textarea
                  required
                  rows="4"
                  minLength="5"
                  placeholder="Customer feedback details..."
                  className="form-textarea text-xs w-full"
                  value={formData.feedbackText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, feedbackText: e.target.value }))
                  }
                ></textarea>
              </div>

              {/* Show on Homepage Radio Control (Max 3) */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Feature on Homepage (Max 3)</span>
                    <span className="text-[10px] text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full font-bold">
                      {reviews.filter((r) => r.showOnHome && (!editingReview || r._id !== editingReview._id)).length}/3 Selected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select to show this review in the 3 featured slots on the public homepage.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="modalShowOnHomeRadio"
                    checked={Boolean(formData.showOnHome)}
                    onClick={() => {
                      if (!formData.showOnHome) {
                        const currentHomeCount = reviews.filter(
                          (r) => r.showOnHome && (!editingReview || r._id !== editingReview._id)
                        ).length;
                        if (currentHomeCount >= 3) {
                          alert(
                            'Maximum of 3 reviews can be featured on the Homepage. Please deselect another review first.'
                          );
                          return;
                        }
                        setFormData((prev) => ({ ...prev, showOnHome: true }));
                      } else {
                        setFormData((prev) => ({ ...prev, showOnHome: false }));
                      }
                    }}
                    onChange={() => {}}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </label>
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
    </div>
  );
}
