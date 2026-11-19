import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Phone,
  MessageCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Site Inspection',
  'Quotation Sent',
  'Converted',
  'Closed',
];

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const loadEnquiries = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (statusFilter !== 'All') query.append('status', statusFilter);
    if (search) query.append('search', search);

    fetchApi(`/admin/enquiries?${query.toString()}`)
      .then((res) => {
        if (res.success) setEnquiries(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEnquiries();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetchApi(`/admin/enquiries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update enquiry status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEnquiry) return;
    setSaving(true);

    try {
      const res = await fetchApi(`/admin/enquiries/${selectedEnquiry._id}`, {
        method: 'PUT',
        body: JSON.stringify({ newNote }),
      });
      if (res.success) {
        setSelectedEnquiry(res.data);
        setEnquiries((prev) =>
          prev.map((item) => (item._id === res.data._id ? res.data : item))
        );
        setNewNote('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEnquiry = async (id, customerName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the enquiry from "${customerName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetchApi(`/admin/enquiries/${id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
      } else {
        alert(res.message || 'Failed to delete enquiry');
      }
    } catch (err) {
      alert(err.message || 'Error deleting enquiry');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === enquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(enquiries.map((e) => e._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected enquiries permanently? This action cannot be undone.`
      )
    ) {
      return;
    }

    setBulkDeleting(true);
    try {
      // Execute parallel deletes
      const deletePromises = selectedIds.map((id) =>
        fetchApi(`/admin/enquiries/${id}`, { method: 'DELETE' })
      );
      await Promise.allSettled(deletePromises);

      setEnquiries((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
      if (selectedEnquiry && selectedIds.includes(selectedEnquiry._id)) {
        setSelectedEnquiry(null);
      }
      setSelectedIds([]);
    } catch (err) {
      alert(err.message || 'Failed to complete bulk deletion');
    } finally {
      setBulkDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'badge-amber';
      case 'Contacted':
        return 'badge-blue';
      case 'Site Inspection':
        return 'badge-blue';
      case 'Quotation Sent':
        return 'badge-slate';
      case 'Converted':
        return 'badge-green';
      case 'Closed':
        return 'badge-slate';
      default:
        return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Enquiry Management Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track leads from website form submission to site inspection, quotation, and contract conversion.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 bg-white border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone, area..."
            className="form-input text-xs pl-8 pr-3 py-1.5 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Bulk Action / Selection Toolbar */}
      {enquiries.length > 0 && (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={selectedIds.length > 0 && selectedIds.length === enquiries.length}
                onChange={handleSelectAll}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
              />
              <span>Select All ({enquiries.length})</span>
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
              disabled={bulkDeleting}
              className="btn btn-outline border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white btn-sm py-1 px-3 text-xs flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={13} className={bulkDeleting ? 'animate-spin' : ''} />
              <span>{bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Table / Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Enquiries */}
        <div className={`${selectedEnquiry ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          {loading ? (
            <div className="card p-12 text-center text-slate-400 text-xs">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="card p-12 text-center text-slate-500 text-xs">
              No enquiries match the current filters.
            </div>
          ) : (
            enquiries.map((enq) => {
              const isSelected = selectedEnquiry?._id === enq._id;
              const isChecked = selectedIds.includes(enq._id);
              return (
                <div
                  key={enq._id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`card p-4 bg-white cursor-pointer transition-all border-l-4 ${
                    isSelected
                      ? 'border-l-sky-600 ring-2 ring-sky-500/20'
                      : enq.status === 'New'
                      ? 'border-l-amber-500'
                      : enq.status === 'Converted'
                      ? 'border-l-emerald-500'
                      : 'border-l-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleToggleSelect(enq._id, e)}
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{enq.customerName}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <MapPin size={12} className="text-sky-600 shrink-0" />
                          <span>{enq.location}</span>
                          <span>•</span>
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                          <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${getStatusBadge(enq.status)} shrink-0`}>{enq.status}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded ml-6">
                    <strong>{enq.serviceRequired}:</strong> {enq.problemDescription}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 ml-6">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${enq.phone.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-outline btn-sm py-1 px-2 text-[11px] flex items-center gap-1"
                      >
                        <Phone size={11} className="text-sky-600" /> {enq.phone}
                      </a>
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20this%20is%20SLN%20Engineers%20Projects%20regarding%20your%20waterproofing%20enquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-whatsapp btn-sm py-1 px-2 text-[11px] flex items-center gap-1"
                      >
                        <MessageCircle size={11} /> WhatsApp
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        {enq.internalNotes?.length || 0} notes
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEnquiry(enq._id, enq.customerName);
                        }}
                        disabled={deletingId === enq._id}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete enquiry"
                      >
                        <Trash2 size={14} className={deletingId === enq._id ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Enquiry Detail & Notes */}
        {selectedEnquiry && (
          <div className="lg:col-span-6 card p-6 bg-white border-slate-200 sticky top-20 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Enquiry Details
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedEnquiry.customerName}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Submitted {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteEnquiry(selectedEnquiry._id, selectedEnquiry.customerName)}
                  disabled={deletingId === selectedEnquiry._id}
                  className="btn btn-outline border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white btn-sm py-1 px-2.5 text-xs flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Delete this lead"
                >
                  <Trash2 size={13} className={deletingId === selectedEnquiry._id ? 'animate-spin' : ''} />
                  <span>{deletingId === selectedEnquiry._id ? 'Deleting...' : 'Delete Lead'}</span>
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* Quick Status Selector */}
            <div>
              <label className="form-label text-xs">Update Status</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedEnquiry._id, st)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedEnquiry.status === st
                        ? 'bg-sky-800 text-white border-sky-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem & Parameters */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900 block mb-0.5">Service Category:</strong>
                <span>{selectedEnquiry.serviceRequired}</span>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Property Location:</strong>
                <span>{selectedEnquiry.location}</span>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Problem Details:</strong>
                <p className="whitespace-pre-line text-slate-800">{selectedEnquiry.problemDescription}</p>
              </div>
              {selectedEnquiry.email && (
                <div>
                  <strong className="text-slate-900 block mb-0.5">Email:</strong>
                  <span>{selectedEnquiry.email}</span>
                </div>
              )}
              <div>
                <strong className="text-slate-900 block mb-0.5">Preferred Contact:</strong>
                <span>{selectedEnquiry.preferredContactMethod || 'Phone'}</span>
              </div>
            </div>

            {/* Attached Photos (if any) */}
            {selectedEnquiry.photos && selectedEnquiry.photos.length > 0 && (
              <div>
                <label className="form-label text-xs">Customer Uploaded Photos</label>
                <div className="flex flex-wrap gap-2">
                  {selectedEnquiry.photos.map((ph, idx) => (
                    <a
                      key={idx}
                      href={ph.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 hover:opacity-80 transition-opacity"
                    >
                      <img src={ph.url} alt="Problem" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Notes Thread */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Internal Staff Notes & Activity Log
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
                {selectedEnquiry.internalNotes && selectedEnquiry.internalNotes.length > 0 ? (
                  selectedEnquiry.internalNotes.map((n, i) => (
                    <div key={i} className="p-2.5 bg-slate-100 rounded-lg text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-bold text-slate-700">{n.author}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-800">{n.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note (e.g. called client, quotation prepared...)"
                  className="form-input text-xs flex-1"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={saving || !newNote.trim()}
                  className="btn btn-primary btn-sm text-xs"
                >
                  {saving ? 'Adding...' : 'Add Note'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
