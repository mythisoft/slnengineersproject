import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle,
  AlertCircle,
  Save,
  Sparkles,
  Smartphone,
  MapPin,
  Check,
  MessageSquare,
  FileText,
  RotateCcw,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

export default function QrManager() {
  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sln_admin_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  // Active Tab: 'customer' (Add Customer Reviews) vs 'google' (Google Reviews)
  const [activeTab, setActiveTab] = useState('customer');

  // Customer Review QR Code State
  const [customerData, setCustomerData] = useState(null);
  const [customerUrlInput, setCustomerUrlInput] = useState('');
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerSaving, setCustomerSaving] = useState(false);
  const [customerGenerating, setCustomerGenerating] = useState(false);
  const [customerSaveSuccess, setCustomerSaveSuccess] = useState(false);
  const [customerReplacedMessage, setCustomerReplacedMessage] = useState('');
  const [customerCopied, setCustomerCopied] = useState(false);
  const [customerPrintModalOpen, setCustomerPrintModalOpen] = useState(false);

  // Google Review QR Code State
  const [googleData, setGoogleData] = useState(null);
  const [googleUrlInput, setGoogleUrlInput] = useState('');
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleSaving, setGoogleSaving] = useState(false);
  const [googleGenerating, setGoogleGenerating] = useState(false);
  const [googleSaveSuccess, setGoogleSaveSuccess] = useState(false);
  const [googleReplacedMessage, setGoogleReplacedMessage] = useState('');
  const [googleCopied, setGoogleCopied] = useState(false);
  const [googlePrintModalOpen, setGooglePrintModalOpen] = useState(false);

  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Load Customer Review QR Code
  const loadCustomerQr = async () => {
    setCustomerLoading(true);
    try {
      const res = await fetchApi('/admin/customer-review-qr');
      if (res.success && res.data) {
        setCustomerData(res.data);
        setCustomerUrlInput(res.data.customerReviewUrl || `${window.location.origin}/review`);
      }
    } catch (e) {
      console.error('Failed to load Customer review QR code:', e);
      const defaultUrl = `${window.location.origin}/review`;
      setCustomerUrlInput(defaultUrl);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Load Google Review QR Code
  const loadGoogleQr = async () => {
    setGoogleLoading(true);
    try {
      const res = await fetchApi('/admin/google-review-qr');
      if (res.success && res.data) {
        setGoogleData(res.data);
        setGoogleUrlInput(res.data.googleReviewUrl || '');
      }
    } catch (e) {
      console.error('Failed to load Google review QR code:', e);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerQr();
    loadGoogleQr();
  }, []);

  // Format timestamp helper
  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Active (Default)';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Active';
    }
  };

  // =========================================================================
  // CUSTOMER REVIEW QR ACTIONS
  // =========================================================================

  // 1. Generate Brand New Customer QR (Replace Old)
  const handleGenerateNewCustomerQr = async (withNewVersion = false) => {
    setCustomerGenerating(true);
    setCustomerReplacedMessage('');

    try {
      const res = await fetchApi('/admin/customer-review-qr/generate-new', {
        method: 'POST',
        body: JSON.stringify({
          customerReviewUrl: customerUrlInput.trim(),
          generateNewVersion: withNewVersion,
        }),
      });

      if (res.success && res.data) {
        setCustomerData(res.data);
        setCustomerUrlInput(res.data.customerReviewUrl);
        setCustomerReplacedMessage(
          `New QR code generated successfully! Old QR code replaced on ${formatTimestamp(res.data.updatedAt)}.`
        );
        setTimeout(() => setCustomerReplacedMessage(''), 6000);
      } else {
        alert(res.message || 'Failed to generate new Customer Review QR code.');
      }
    } catch (err) {
      alert(err.message || 'Failed to generate new Customer Review QR code.');
    } finally {
      setCustomerGenerating(false);
    }
  };

  // 2. Save Updated Customer Review URL & Replace QR
  const handleSaveCustomerUrl = async (e) => {
    e.preventDefault();
    if (!customerUrlInput.trim()) {
      alert('Please enter a valid Customer Review URL.');
      return;
    }

    setCustomerSaving(true);
    setCustomerSaveSuccess(false);

    try {
      const res = await fetchApi('/admin/customer-review-qr', {
        method: 'PUT',
        body: JSON.stringify({ customerReviewUrl: customerUrlInput.trim() }),
      });
      if (res.success && res.data) {
        setCustomerData(res.data);
        setCustomerSaveSuccess(true);
        setCustomerReplacedMessage('Old QR replaced with new QR matching your updated URL.');
        setTimeout(() => {
          setCustomerSaveSuccess(false);
          setCustomerReplacedMessage('');
        }, 5000);
      } else {
        alert(res.message || 'Failed to update Customer Review URL.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update Customer Review URL.');
    } finally {
      setCustomerSaving(false);
    }
  };

  // 3. Reset Customer Review QR to Default
  const handleResetCustomerQr = async () => {
    if (!window.confirm('Are you sure you want to reset the Customer Review QR code to default? This will replace the current QR code.')) {
      return;
    }

    setCustomerGenerating(true);
    try {
      const res = await fetchApi('/admin/customer-review-qr/reset', {
        method: 'POST',
      });
      if (res.success && res.data) {
        setCustomerData(res.data);
        setCustomerUrlInput(res.data.customerReviewUrl);
        setCustomerReplacedMessage('Customer Review QR code reset to default and replaced successfully.');
        setTimeout(() => setCustomerReplacedMessage(''), 5000);
      }
    } catch (err) {
      alert(err.message || 'Failed to reset Customer Review QR code.');
    } finally {
      setCustomerGenerating(false);
    }
  };

  // =========================================================================
  // GOOGLE REVIEW QR ACTIONS
  // =========================================================================

  // 1. Generate Brand New Google QR (Replace Old)
  const handleGenerateNewGoogleQr = async () => {
    setGoogleGenerating(true);
    setGoogleReplacedMessage('');

    try {
      const res = await fetchApi('/admin/google-review-qr/generate-new', {
        method: 'POST',
        body: JSON.stringify({
          googleReviewUrl: googleUrlInput.trim(),
        }),
      });

      if (res.success && res.data) {
        setGoogleData(res.data);
        setGoogleUrlInput(res.data.googleReviewUrl);
        setGoogleReplacedMessage(
          `New Google QR code generated successfully! Old QR code replaced on ${formatTimestamp(res.data.updatedAt)}.`
        );
        setTimeout(() => setGoogleReplacedMessage(''), 6000);
      } else {
        alert(res.message || 'Failed to generate new Google Review QR code.');
      }
    } catch (err) {
      alert(err.message || 'Failed to generate new Google Review QR code.');
    } finally {
      setGoogleGenerating(false);
    }
  };

  // 2. Save Updated Google Review URL & Replace QR
  const handleSaveGoogleUrl = async (e) => {
    e.preventDefault();
    if (!googleUrlInput.trim()) {
      alert('Please enter a valid Google Review URL.');
      return;
    }

    setGoogleSaving(true);
    setGoogleSaveSuccess(false);

    try {
      const res = await fetchApi('/admin/google-review-qr', {
        method: 'PUT',
        body: JSON.stringify({ googleReviewUrl: googleUrlInput.trim() }),
      });
      if (res.success && res.data) {
        setGoogleData(res.data);
        setGoogleSaveSuccess(true);
        setGoogleReplacedMessage('Old Google QR replaced with new QR matching your updated URL.');
        setTimeout(() => {
          setGoogleSaveSuccess(false);
          setGoogleReplacedMessage('');
        }, 5000);
      } else {
        alert(res.message || 'Failed to update Google Review URL.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update Google Review URL.');
    } finally {
      setGoogleSaving(false);
    }
  };

  // 3. Reset Google Review QR to Default
  const handleResetGoogleQr = async () => {
    if (!window.confirm('Are you sure you want to reset the Google Review QR code to default? This will replace the current QR code.')) {
      return;
    }

    setGoogleGenerating(true);
    try {
      const res = await fetchApi('/admin/google-review-qr/reset', {
        method: 'POST',
      });
      if (res.success && res.data) {
        setGoogleData(res.data);
        setGoogleUrlInput(res.data.googleReviewUrl);
        setGoogleReplacedMessage('Google Review QR code reset to default and replaced successfully.');
        setTimeout(() => setGoogleReplacedMessage(''), 5000);
      }
    } catch (err) {
      alert(err.message || 'Failed to reset Google Review QR code.');
    } finally {
      setGoogleGenerating(false);
    }
  };

  // Clipboard Helpers
  const copyCustomerLink = () => {
    const url = customerData?.customerReviewUrl || customerUrlInput;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCustomerCopied(true);
    setTimeout(() => setCustomerCopied(false), 2000);
  };

  const copyGoogleLink = () => {
    const url = googleData?.googleReviewUrl || googleUrlInput;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setGoogleCopied(true);
    setTimeout(() => setGoogleCopied(false), 2000);
  };

  // Download Helpers
  const handleDownloadCustomerPNG = () => {
    if (!customerData?.qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = customerData.qrCodeDataUrl;
    link.download = `sln-customer-review-qr-${customerData?.version || 'active'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadGooglePNG = () => {
    if (!googleData?.qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = googleData.qrCodeDataUrl;
    link.download = 'sln-google-review-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Super Admin Access Required
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The Official Review QR Codes are restricted strictly to Super Administrators. Please log in with a Superadmin account to manage these configurations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs mb-2">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Superadmin Exclusive • Separate QR Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Review QR Codes Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Generate and replace brand new QR codes independently for both <strong>Customer Reviews</strong> (Website) and <strong>Google Reviews</strong> (Google Maps).
          </p>
        </div>
      </div>

      {/* Two Tab Buttons Switcher */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 border border-slate-200 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('customer')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
            activeTab === 'customer'
              ? 'bg-white text-emerald-800 shadow-md border border-emerald-200/80 scale-[1.01]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
            activeTab === 'customer' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            <Star size={14} fill="currentColor" />
          </div>
          <span>1. Customer Review QR Code</span>
          <span className="badge badge-green text-[10px] uppercase font-bold py-0.5 px-2">
            Website Form (/review)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('google')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
            activeTab === 'google'
              ? 'bg-white text-sky-900 shadow-md border border-sky-200/80 scale-[1.01]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
            activeTab === 'google' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            G
          </div>
          <span>2. Google Review QR Code</span>
          <span className="badge badge-blue text-[10px] uppercase font-bold py-0.5 px-2">
            Google Maps Profile
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CUSTOMER REVIEW QR CODE (ADD TO WEBSITE VIA /review)               */}
      {/* ========================================================================= */}
      {activeTab === 'customer' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Customer Review QR Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#03261a] to-slate-950 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            {/* Ambient Glow accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
              {/* Left Column: Information, URL, Replacement Status & Action Buttons */}
              <div className="space-y-5 max-w-xl text-center lg:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Customer Review QR ({customerData?.version || 'v1'})</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-slate-300 border border-white/10">
                    <Clock size={11} className="text-emerald-400" />
                    <span>Replaced: {formatTimestamp(customerData?.updatedAt)}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  QR Code to Add Customer Reviews
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When clients scan this QR code, it <strong className="text-white">directly opens the SLN Engineers Review Form</strong> (<code className="text-emerald-300 font-mono text-[11px] bg-slate-900/80 px-1.5 py-0.5 rounded">/review</code>) to rate stars, enter their name, and submit feedback directly to your website.
                </p>

                {/* Direct Customer Review Destination Link Box */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Current Destination Link:
                  </label>
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs">
                    <span className="text-emerald-300 font-mono truncate flex-1 pl-1">
                      {customerData?.customerReviewUrl || `${window.location.origin}/review`}
                    </span>
                    <button
                      type="button"
                      onClick={copyCustomerLink}
                      className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold btn-sm text-[11px] py-1 px-3 flex items-center gap-1.5 shrink-0"
                      title="Copy customer review URL"
                    >
                      {customerCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{customerCopied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadCustomerPNG}
                    disabled={!customerData?.qrCodeDataUrl}
                    className="btn bg-white text-slate-900 hover:bg-slate-100 font-bold btn-sm text-xs flex items-center gap-1.5 shadow-md px-4 py-2"
                  >
                    <Download size={14} className="text-emerald-700" />
                    <span>Download QR PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerPrintModalOpen(true)}
                    disabled={!customerData?.qrCodeDataUrl}
                    className="btn btn-outline border-white/30 text-white hover:bg-white/10 btn-sm text-xs flex items-center gap-1.5 px-4 py-2"
                  >
                    <Printer size={14} />
                    <span>Print Standee Card</span>
                  </button>

                  <a
                    href={customerData?.customerReviewUrl || `${window.location.origin}/review`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 btn-sm text-xs flex items-center gap-1.5 px-4 py-2"
                  >
                    <ExternalLink size={14} />
                    <span>Test Form</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual QR Code Standee Preview Card */}
              <div className="bg-white rounded-3xl p-6 text-center text-slate-900 shadow-2xl border-4 border-white/20 shrink-0 w-72 sm:w-80 group">
                {/* SLN Brand Header Badge */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">
                      Customer Review QR
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">
                      Version: {customerData?.version || 'v1'}
                    </div>
                  </div>
                </div>

                {/* High-Contrast Scannable QR Code */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200/90 inline-block mb-3 shadow-inner">
                  {customerData?.qrCodeDataUrl ? (
                    <img
                      src={customerData.qrCodeDataUrl}
                      alt="Customer Review QR Code"
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-52 sm:h-52 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
                      {customerLoading ? 'Generating QR Code...' : 'QR Code Unavailable'}
                    </div>
                  )}
                </div>

                {/* 5 Stars Rating Bar */}
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="text-amber-400 drop-shadow-2xs" />
                  ))}
                </div>

                <p className="text-xs font-black text-slate-900">
                  Scan to Add Customer Review
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                  Replaces previous QR across website
                </span>
              </div>
            </div>
          </div>

          {/* GENERATE NEW QR CODE & REPLACE OLD (SUPERADMIN CONTROL PANEL) */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <RefreshCw size={22} className={customerGenerating ? 'animate-spin' : ''} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Generate New QR Code (Replace Old Customer QR)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instantly create a brand new QR code. The old QR code is completely replaced in the database, warranty cards, and live reviews page.
                  </p>
                </div>
              </div>

              {/* Instant 1-Click Replace Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleGenerateNewCustomerQr(true)}
                  disabled={customerGenerating}
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold btn-sm text-xs flex items-center gap-2 px-4 py-2.5 shadow-md shadow-emerald-600/20"
                >
                  <RefreshCw size={14} className={customerGenerating ? 'animate-spin' : ''} />
                  <span>{customerGenerating ? 'Replacing...' : 'Generate New QR (New Version)'}</span>
                </button>
              </div>
            </div>

            {/* Notification alert banner */}
            {customerReplacedMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>{customerReplacedMessage}</span>
              </div>
            )}

            {/* Manual URL Update & QR Replacement Form */}
            <form onSubmit={handleSaveCustomerUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Review Form URL (Optional — e.g. custom domain or campaign):
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={customerUrlInput}
                    onChange={(e) => setCustomerUrlInput(e.target.value)}
                    placeholder={`${window.location.origin}/review`}
                    required
                    className="form-input flex-1 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleResetCustomerQr}
                    disabled={customerGenerating}
                    className="btn btn-outline btn-sm text-xs flex items-center justify-center gap-1.5 px-3 py-2 shrink-0 font-medium"
                    title="Reset to default /review link"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Default</span>
                  </button>
                  <button
                    type="submit"
                    disabled={customerSaving || customerGenerating}
                    className="btn bg-slate-900 hover:bg-slate-800 text-white btn-sm text-xs flex items-center justify-center gap-1.5 px-5 py-2 shrink-0 font-bold"
                  >
                    {customerSaving ? (
                      <span>Replacing QR...</span>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save &amp; Replace QR</span>
                      </>
                    )}
                  </button>
                </div>
                {customerSaveSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle size={13} />
                    Customer review URL updated and QR code replaced successfully!
                  </p>
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>How "Replace Old QR" works for Customer Reviews:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11.5px] text-slate-500">
                  <li>Clicking <strong>"Generate New QR (New Version)"</strong> increments the version tag and creates a fresh QR code.</li>
                  <li>The old QR code is immediately overwritten in the system settings and warranty card mockups.</li>
                  <li>Property owners scanning this new QR code land on your feedback portal to submit reviews with stars, customer name, and comments.</li>
                </ul>
              </div>
            </form>
          </div>

          {/* Where to Deploy Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Warranty Handover Folders
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Print the newly generated QR code on the final civil inspection sign-off sheet or 10-year bonded warranty certificate.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Smartphone size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Digital PDF Reports &amp; Invoices
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download the high-resolution PNG to embed into digital project handover completion dossiers sent via WhatsApp or email.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Printer size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Office &amp; Site Counter Standee
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Print the acrylic standee card and place it on your front desk so visiting clients can leave an on-the-spot review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GOOGLE REVIEW QR CODE (GOOGLE MAPS / BUSINESS PROFILE)              */}
      {/* ========================================================================= */}
      {activeTab === 'google' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Google Review QR Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#051c33] to-slate-950 text-white p-6 sm:p-10 border border-sky-500/30 shadow-2xl relative overflow-hidden">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
              {/* Left Column: Information, URL, Replacement Status & Action Buttons */}
              <div className="space-y-5 max-w-xl text-center lg:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/10 text-sky-200 border border-white/15 backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Official Google Business Profile QR</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-slate-300 border border-white/10">
                    <Clock size={11} className="text-sky-400" />
                    <span>Replaced: {formatTimestamp(googleData?.updatedAt)}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  One QR Code to Move to Google for Client Reviews
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When property owners, villa residents, or commercial clients scan this QR code with their mobile phone camera, it <strong className="text-white">immediately opens Google</strong> to leave a verified 5-star review for SLN Engineers Projects Pvt. Ltd.
                </p>

                {/* Direct Google Review URL Box */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Direct Google Destination Link:
                  </label>
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-2 sm:p-2.5 rounded-xl text-xs">
                    <span className="text-sky-300 font-mono truncate flex-1 pl-1">
                      {googleData?.googleReviewUrl || 'https://www.google.com/maps/...'}
                    </span>
                    <button
                      type="button"
                      onClick={copyGoogleLink}
                      className="btn btn-primary btn-sm text-[11px] py-1 px-3 flex items-center gap-1.5 shrink-0"
                      title="Copy Google review URL"
                    >
                      {googleCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{googleCopied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadGooglePNG}
                    disabled={!googleData?.qrCodeDataUrl}
                    className="btn bg-white text-slate-900 hover:bg-slate-100 font-bold btn-sm text-xs flex items-center gap-1.5 shadow-md px-4 py-2"
                  >
                    <Download size={14} className="text-sky-700" />
                    <span>Download QR PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGooglePrintModalOpen(true)}
                    disabled={!googleData?.qrCodeDataUrl}
                    className="btn btn-outline border-white/30 text-white hover:bg-white/10 btn-sm text-xs flex items-center gap-1.5 px-4 py-2"
                  >
                    <Printer size={14} />
                    <span>Print Standee Card</span>
                  </button>

                  <a
                    href={googleData?.googleReviewUrl || 'https://www.google.com/maps/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline border-sky-400/40 text-sky-300 hover:bg-sky-500/10 btn-sm text-xs flex items-center gap-1.5 px-4 py-2"
                  >
                    <ExternalLink size={14} />
                    <span>Test Link (Open Google)</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual QR Code Standee Preview Card */}
              <div className="bg-white rounded-3xl p-6 text-center text-slate-900 shadow-2xl border-4 border-white/20 shrink-0 w-72 sm:w-80 group">
                {/* Google "G" Logo Badge Header */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-lg shadow-2xs">
                    <span className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                      G
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">
                      Google Review
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      SLN Engineers Projects
                    </div>
                  </div>
                </div>

                {/* High-Contrast Scannable QR Code */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200/90 inline-block mb-3 shadow-inner">
                  {googleData?.qrCodeDataUrl ? (
                    <img
                      src={googleData.qrCodeDataUrl}
                      alt="Official Google Review QR Code"
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-52 sm:h-52 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
                      {googleLoading ? 'Generating QR Code...' : 'QR Code Unavailable'}
                    </div>
                  )}
                </div>

                {/* 5 Stars Rating Bar */}
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="text-amber-400 drop-shadow-2xs" />
                  ))}
                </div>

                <p className="text-xs font-black text-slate-900">
                  Scan to Review on Google
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Direct mobile camera instant redirect
                </span>
              </div>
            </div>
          </div>

          {/* GENERATE NEW GOOGLE QR & REPLACE OLD (SUPERADMIN CONTROL PANEL) */}
          <div className="bg-white rounded-2xl border-2 border-sky-500/40 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <RefreshCw size={22} className={googleGenerating ? 'animate-spin' : ''} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Generate New QR Code (Replace Old Google QR)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Generate a fresh Google Review QR code. Replaces the old Google QR code across the website and marketing standees.
                  </p>
                </div>
              </div>

              {/* Instant 1-Click Replace Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleGenerateNewGoogleQr}
                  disabled={googleGenerating}
                  className="btn btn-primary font-extrabold btn-sm text-xs flex items-center gap-2 px-4 py-2.5 shadow-md shadow-sky-600/20"
                >
                  <RefreshCw size={14} className={googleGenerating ? 'animate-spin' : ''} />
                  <span>{googleGenerating ? 'Replacing...' : 'Generate New Google QR'}</span>
                </button>
              </div>
            </div>

            {/* Notification alert banner */}
            {googleReplacedMessage && (
              <div className="bg-sky-50 border border-sky-300 text-sky-900 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle size={16} className="text-sky-600 shrink-0" />
                <span>{googleReplacedMessage}</span>
              </div>
            )}

            {/* Manual URL Update & QR Replacement Form */}
            <form onSubmit={handleSaveGoogleUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Review URL / Maps Link:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={googleUrlInput}
                    onChange={(e) => setGoogleUrlInput(e.target.value)}
                    placeholder="https://www.google.com/maps/place/..."
                    required
                    className="form-input flex-1 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleResetGoogleQr}
                    disabled={googleGenerating}
                    className="btn btn-outline btn-sm text-xs flex items-center justify-center gap-1.5 px-3 py-2 shrink-0 font-medium"
                    title="Reset to default Google Maps link"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Default</span>
                  </button>
                  <button
                    type="submit"
                    disabled={googleSaving || googleGenerating}
                    className="btn bg-slate-900 hover:bg-slate-800 text-white btn-sm text-xs flex items-center justify-center gap-1.5 px-5 py-2 shrink-0 font-bold"
                  >
                    {googleSaving ? (
                      <span>Replacing QR...</span>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save &amp; Replace QR</span>
                      </>
                    )}
                  </button>
                </div>
                {googleSaveSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle size={13} />
                    Google review URL saved and QR code replaced successfully!
                  </p>
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>How to get your direct Google Review Link:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11.5px] text-slate-500">
                  <li>Open your <strong>Google Business Profile</strong> on Google search or Maps.</li>
                  <li>Click on <strong>"Ask for reviews"</strong> or <strong>"Get more reviews"</strong>.</li>
                  <li>Copy the review link (or Google Maps share link).</li>
                  <li>Paste it into the field above and click <strong>"Save &amp; Replace QR"</strong>. The old QR code is replaced immediately!</li>
                </ol>
              </div>
            </form>
          </div>

          {/* Where to Deploy Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Printer size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Office Reception &amp; Counter Standee
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Print the table tent card and place it in an acrylic holder on your front desk for visiting clients, architects, and vendors.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Smartphone size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Project Handover Warranty Files
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Include the QR code on the final civil inspection sign-off sheet or warranty handover dossier upon leak-free testing.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Invoices, Visiting Cards &amp; Boards
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download the high-resolution PNG file to print directly onto corporate visiting cards, tax invoices, and site supervision banners.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE STANDEE MODAL: CUSTOMER REVIEW QR CODE                          */}
      {/* ========================================================================= */}
      {customerPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between no-print">
              <span className="badge badge-green font-bold text-xs">
                Customer Review Standee / Tent Card ({customerData?.version || 'v1'})
              </span>
              <button
                onClick={() => setCustomerPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-black p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Standee Content Layout */}
            <div className="print-card border-4 border-emerald-800 rounded-3xl p-6 text-center bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs flex items-center justify-center text-emerald-700">
                  <Star size={20} fill="currentColor" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 leading-tight">
                    Customer Review
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    Rate Your Experience
                  </div>
                </div>
              </div>

              {/* 5 Big Gold Stars */}
              <div className="flex items-center justify-center gap-1.5 text-amber-400 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="currentColor" className="text-amber-400" />
                ))}
              </div>

              {/* QR Code */}
              <div className="py-2">
                <img
                  src={customerData?.qrCodeDataUrl}
                  alt="Customer Review QR Code"
                  className="w-52 h-52 mx-auto border-2 border-emerald-300 p-2.5 rounded-2xl shadow-xs"
                />
              </div>

              {/* Instructions Box */}
              <div className="text-xs text-slate-700 max-w-xs mx-auto leading-relaxed space-y-1">
                <p className="font-extrabold text-slate-900 text-sm">
                  Scan with your phone camera
                </p>
                <p className="text-[11px] text-slate-600">
                  Open your camera, point at the QR code, and tap the link to share your feedback directly with SLN Engineers.
                </p>
              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t-2 border-slate-200 text-center space-y-0.5">
                <div className="text-xs font-black text-slate-900">
                  {customerData?.companyName || 'SLN Engineers Projects Pvt. Ltd.'}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {customerData?.tagline || 'Restoration for Three Generations'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold pt-1">
                  Helpline: {customerData?.phone || '+91 8977668776'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 no-print">
              <button
                type="button"
                onClick={() => setCustomerPrintModalOpen(false)}
                className="btn btn-outline btn-sm text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white btn-sm text-xs flex items-center gap-1.5 font-bold px-4"
              >
                <Printer size={15} />
                <span>Print Standee Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE STANDEE MODAL: GOOGLE REVIEW QR CODE                            */}
      {/* ========================================================================= */}
      {googlePrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between no-print">
              <span className="badge badge-blue font-bold text-xs">
                Printable Standee / Counter Card
              </span>
              <button
                onClick={() => setGooglePrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-black p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Standee Content Layout */}
            <div className="print-card border-4 border-slate-900 rounded-3xl p-6 text-center bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-xl font-black">
                  <span className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                    G
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 leading-tight">
                    Google Review
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    Rate Your Experience
                  </div>
                </div>
              </div>

              {/* 5 Big Gold Stars */}
              <div className="flex items-center justify-center gap-1.5 text-amber-400 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="currentColor" className="text-amber-400" />
                ))}
              </div>

              {/* Prominent QR Code */}
              <div className="py-2">
                <img
                  src={googleData?.qrCodeDataUrl}
                  alt="Google Review QR Code"
                  className="w-52 h-52 mx-auto border-2 border-slate-300 p-2.5 rounded-2xl shadow-xs"
                />
              </div>

              {/* Instructions Box */}
              <div className="text-xs text-slate-700 max-w-xs mx-auto leading-relaxed space-y-1">
                <p className="font-extrabold text-slate-900 text-sm">
                  Scan with your phone camera
                </p>
                <p className="text-[11px] text-slate-600">
                  Open your camera, point at the QR code, and tap the link to leave a 5-star Google review.
                </p>
              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t-2 border-slate-200 text-center space-y-0.5">
                <div className="text-xs font-black text-slate-900">
                  {googleData?.companyName || 'SLN Engineers Projects Pvt. Ltd.'}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {googleData?.tagline || 'Restoration for Three Generations'}
                </div>
                <div className="text-[10px] text-sky-700 font-bold pt-1">
                  Helpline: {googleData?.phone || '+91 8977668776'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 no-print">
              <button
                type="button"
                onClick={() => setGooglePrintModalOpen(false)}
                className="btn btn-outline btn-sm text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold px-4"
              >
                <Printer size={15} />
                <span>Print Standee Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
