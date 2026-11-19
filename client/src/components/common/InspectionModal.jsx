import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  User,
  MapPin,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

export const INSPECTION_SERVICES = [
  'All 4 Specializations / Civil Inspection',
  'Terrace Waterproofing & Thermal Defense',
  'Basement Injection Tanking & Retaining Wall',
  'External Façade Sealing & Elastomeric Coating',
  'Wet Area & Podium Structural Waterproofing',
  'Non-Destructive Thermal Moisture Survey',
  'Structural Rehabilitation & Concrete Repair',
];

// Helper to open the modal from anywhere programmatically
export function openInspectionModal(serviceName = '') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('sln_open_inspection_modal', {
        detail: { service: serviceName || '' },
      })
    );
  }
}

export default function InspectionModal({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const nameInputRef = useRef(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    location: '',
    serviceRequired: 'All 4 Specializations / Civil Inspection',
    problemDescription: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Listen for global open events
  useEffect(() => {
    const handleOpen = (e) => {
      const targetService = e.detail?.service;
      setFormData((prev) => ({
        ...prev,
        serviceRequired: targetService || prev.serviceRequired || 'All 4 Specializations / Civil Inspection',
      }));
      setSubmitted(false);
      setSubmittedDetails(null);
      setErrorMsg('');
      setFormErrors({});
      setIsOpen(true);
    };

    window.addEventListener('sln_open_inspection_modal', handleOpen);
    return () => window.removeEventListener('sln_open_inspection_modal', handleOpen);
  }, []);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus input after modal renders
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.customerName.trim()) {
      errs.customerName = 'Please enter your customer or company name.';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Please enter your mobile phone number.';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.location.trim()) {
      errs.location = 'Please provide property location or area.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        serviceRequired: formData.serviceRequired || 'All 4 Specializations / Civil Inspection',
        problemDescription: formData.problemDescription
          ? formData.problemDescription.trim()
          : `Inspection requested via modal for ${formData.serviceRequired} at ${formData.location.trim()}.`,
        preferredContactMethod: 'Phone',
        urgency: 'Standard (24–48h)',
        consentGiven: true,
      };

      const res = await fetchApi('/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSubmittedDetails(payload);
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inspection request. Please reach us via WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const logoUrl = settings?.logoUrl || '/sln-logo.png';
  const brandNameLine1 = settings?.brandNameLine1 || 'SLN ENGINEERS';
  const brandNameLine2 = settings?.brandNameLine2 || 'PROJECTS PVT. LTD.';
  const logoNameColor = settings?.logoNameColor || '#029746';
  const whatsapp = settings?.whatsappNumber || '+918977668776';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto overscroll-none animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-modal-title"
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Sheet Drag Handle */}
        <div
          className="w-10 h-1 bg-slate-300 rounded-full mx-auto sm:hidden mt-2.5 mb-1 cursor-grab"
          onClick={handleClose}
        />

        {/* Top Gradient Accent Line */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${logoNameColor} 0%, #0284c7 50%, #10b981 100%)`,
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer z-20"
          title="Close"
          aria-label="Close Inspection Modal"
        >
          <X size={16} />
        </button>

        <div className="p-5 sm:p-7 space-y-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 pr-8">
            <div className="flex items-center gap-2.5">
              <div
                style={{ borderColor: `${logoNameColor}30` }}
                className="w-10 h-10 rounded-xl bg-white p-1 border shadow-2xs flex items-center justify-center shrink-0"
              >
                <img
                  src={logoUrl}
                  alt={brandNameLine1}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/sln-logo.png';
                  }}
                />
              </div>
              <div className="flex flex-col justify-center leading-tight">
                <span
                  style={{ color: logoNameColor }}
                  className="text-xs sm:text-sm font-black tracking-tight font-heading"
                >
                  {brandNameLine1}
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-bold tracking-wider">
                  {brandNameLine2}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: `${logoNameColor}14`,
                borderColor: `${logoNameColor}35`,
                color: logoNameColor,
              }}
              className="hidden xs:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider"
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: logoNameColor }} />
              <span>Inspection</span>
            </div>
          </div>

          {submitted && submittedDetails ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div
                style={{
                  backgroundColor: `${logoNameColor}18`,
                  borderColor: logoNameColor,
                  color: logoNameColor,
                }}
                className="w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center shadow-md animate-bounce"
              >
                <CheckCircle size={30} />
              </div>
              <div className="space-y-1.5">
                <span
                  style={{
                    backgroundColor: `${logoNameColor}15`,
                    borderColor: `${logoNameColor}35`,
                    color: logoNameColor,
                  }}
                  className="inline-block px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider"
                >
                  Request Confirmed
                </span>
                <h4 className="text-xl font-black text-slate-900">Inspection Request Received!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{submittedDetails.customerName}</strong>! Our structural engineer from <strong style={{ color: logoNameColor }}>{brandNameLine1}</strong> will call you shortly on <strong className="text-slate-900 font-bold">+91 {submittedDetails.phone}</strong> to schedule the on-site inspection for <strong className="text-slate-900">{submittedDetails.location}</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(brandNameLine1)},%20I%20just%20submitted%20an%20inspection%20request%20for%20${encodeURIComponent(submittedDetails.serviceRequired)}%20at%20${encodeURIComponent(submittedDetails.location)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Senior Engineer</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <div>
                <h3 id="inspection-modal-title" className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Schedule On-Site Inspection
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct physical diagnostic survey by licensed civil engineers.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="flex-1 font-medium">{errorMsg}</span>
                </div>
              )}

              {/* 1. Customer Name */}
              <div>
                <label htmlFor="modal-customerName" className="block text-xs font-bold text-slate-700 mb-1">
                  Customer / Company Name <span className="text-amber-500">*</span>
                </label>
                <div
                  className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 ${
                    formErrors.customerName
                      ? 'border-rose-400 ring-1 ring-rose-400/20'
                      : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                  }`}
                >
                  <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor }}>
                    <User size={15} />
                  </span>
                  <input
                    id="modal-customerName"
                    ref={nameInputRef}
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => {
                      setFormData({ ...formData, customerName: e.target.value });
                      if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: '' });
                    }}
                    placeholder="Enter customer or company name"
                    className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-xs md:text-sm focus:outline-hidden"
                  />
                </div>
                {formErrors.customerName && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.customerName}</p>
                )}
              </div>

              {/* 2. Phone Number */}
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Phone Number <span className="text-amber-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">10-digit Indian Mobile</span>
                </label>
                <div
                  className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 overflow-hidden ${
                    formErrors.phone
                      ? 'border-rose-400 ring-1 ring-rose-400/20'
                      : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                  }`}
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 border-r border-slate-200/90 text-xs font-bold shrink-0 text-slate-700">
                    <Phone size={13} className="text-emerald-600" />
                    <span>+91</span>
                  </div>
                  <input
                    id="modal-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: digits });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    placeholder="Enter 10-digit mobile number."
                    className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-xs md:text-sm focus:outline-hidden"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.phone}</p>
                )}
              </div>

              {/* 3. Property Location */}
              <div>
                <label htmlFor="modal-location" className="block text-xs font-bold text-slate-700 mb-1">
                  Property Location / Area <span className="text-amber-500">*</span>
                </label>
                <div
                  className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 ${
                    formErrors.location
                      ? 'border-rose-400 ring-1 ring-rose-400/20'
                      : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                  }`}
                >
                  <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor }}>
                    <MapPin size={15} />
                  </span>
                  <input
                    id="modal-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                    }}
                    placeholder="Enter property location or area."
                    className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-xs md:text-sm focus:outline-hidden"
                  />
                </div>
                {formErrors.location && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.location}</p>
                )}
              </div>

              {/* 4. Service Selection Dropdown */}
              <div>
                <label htmlFor="modal-service" className="block text-xs font-bold text-slate-700 mb-1">
                  Service / Inspection Focus
                </label>
                <div className="relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs">
                  <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor }}>
                    <Layers size={15} />
                  </span>
                  <select
                    id="modal-service"
                    value={formData.serviceRequired}
                    onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                    className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 text-base sm:text-xs md:text-sm focus:outline-hidden cursor-pointer"
                  >
                    {INSPECTION_SERVICES.map((s, idx) => (
                      <option key={idx} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting
                    ? `${logoNameColor}cc`
                    : `linear-gradient(135deg, ${logoNameColor} 0%, #03b655 50%, ${logoNameColor} 100%)`,
                  boxShadow: `0 10px 25px -4px ${logoNameColor}45, 0 4px 10px -2px ${logoNameColor}30`,
                }}
                className="w-full mt-2 py-3 sm:py-3.5 px-4 rounded-xl text-white font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-105 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer group"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Inspection Request</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Micro Trust Badges */}
              <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                  <span>24hr Visit</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                  <span>Zero Obligation</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                  <span>IS 1346 Compliant</span>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
