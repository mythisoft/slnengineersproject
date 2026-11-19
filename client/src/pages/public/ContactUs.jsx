import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Shield,
  ShieldCheck,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Upload,
  Send,
  ExternalLink,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  QrCode,
  Copy,
  CheckCheck,
  Search,
  Layers,
  HelpCircle,
  ArrowRight,
  ArrowUp,
  Filter,
  User,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import { DEFAULT_CONTACT_CONTENT } from '../../utils/contactData';

const LOCAL_STORAGE_KEY = 'sln_custom_contact_content';

export default function ContactUs() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const preselectedService = searchParams.get('service') || '';

  const formCardRef = useRef(null);
  const nameInputRef = useRef(null);
  const [formHighlighted, setFormHighlighted] = useState(false);

  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTACT_CONTENT);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll Progress and Back-To-Top Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load public contact content + real-time synchronization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setContent((prev) => ({ ...DEFAULT_CONTACT_CONTENT, ...parsed }));
        }
      }
    } catch (e) {
      // ignore
    }

    fetchApi('/contact')
      .then((res) => {
        if (res.success && res.data) {
          setContent(res.data);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('API error fetching contact content:', err.message);
      });

    fetchApi('/settings')
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch(() => {});

    const handleSync = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setContent((prev) => ({ ...DEFAULT_CONTACT_CONTENT, ...parsed }));
          }
        }
      } catch {}
    };

    window.addEventListener('sln_contact_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('sln_contact_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    location: '',
    serviceRequired: preselectedService || 'All 4 Specializations / Civil Inspection',
    problemDescription: '',
    preferredContactMethod: 'Phone',
    consentGiven: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [copiedField, setCopiedField] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-scroll to form when requested
  useEffect(() => {
    if (
      location.hash === '#inspection-form' ||
      location.hash === '#inspection-enquiry' ||
      preselectedService
    ) {
      setTimeout(() => {
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setFormHighlighted(true);
        nameInputRef.current?.focus();
        setTimeout(() => setFormHighlighted(false), 2400);
      }, 200);
    }
  }, [location.hash, preselectedService]);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceRequired: preselectedService }));
    }
  }, [preselectedService]);

  const handleCopy = (text, fieldName, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
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
      errs.phone = 'Please enter a valid 10-digit Indian mobile number.';
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
        customerName: (formData.customerName || '').trim(),
        phone: (formData.phone || '').trim(),
        email: (formData.email || '').trim(),
        location: (formData.location || '').trim(),
        serviceRequired: formData.serviceRequired || 'All 4 Specializations / Civil Inspection',
        problemDescription: (formData.problemDescription || '').trim()
          ? formData.problemDescription.trim()
          : `Inspection requested from contact page inspection form for property at ${(formData.location || '').trim()}.`,
        preferredContactMethod: formData.preferredContactMethod || 'Phone',
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
      setErrorMsg(err.message || 'Failed to submit inspection request. Please call our Senior Helpline directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic Contact & Brand Values
  const logoUrl = settings?.logoUrl || '/sln-logo.png';
  const brandNameLine1 = settings?.brandNameLine1 || 'SLN ENGINEERS';
  const brandNameLine2 = settings?.brandNameLine2 || 'PROJECTS PVT. LTD.';
  const logoNameColor = settings?.logoNameColor || '#029746';

  const phone = settings?.phone || content.hotlines?.helpline || '+91 8977668776';
  const whatsapp = settings?.whatsappNumber || content.hotlines?.whatsapp || '+918977668776';
  const email = settings?.email || content.hotlines?.email || 'contact@slnengineers.com';
  const whatsappMsg =
    content.hotlines?.whatsappDefaultMessage ||
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  const hq = content.headquarters || DEFAULT_CONTACT_CONTENT.headquarters;
  const mapsUrl =
    hq.googleMapsUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(`${hq.street}, ${hq.area ? `${hq.area}, ` : ''}${hq.city}, ${hq.state} — ${hq.pincode}`)}`;

  // Filtered FAQs
  const allFaqs = content.faqs || DEFAULT_CONTACT_CONTENT.faqs;
  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return allFaqs;
    const query = faqSearch.toLowerCase();
    return allFaqs.filter(
      (f) => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
    );
  }, [allFaqs, faqSearch]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-24 sm:pb-20 lg:pb-16 relative">
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-indicator"
        style={{ width: `${scrollProgress}%`, backgroundColor: logoNameColor || '#029746' }}
      />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative hero-bg-animated bg-gradient-to-r from-[#031d38] via-[#073155] to-[#0a416d] text-white py-8 sm:py-12 lg:py-16 px-3.5 sm:px-6 lg:px-8 overflow-hidden border-b border-sky-950/40">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: HERO HEADLINE & BADGES */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[10.5px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-xs max-w-full">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{content.hero?.badge || '4 Core Civil Disciplines • Past, Present & Future Lineage'}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
                {content.hero?.title || 'Contact SLN Engineers'}
              </h1>

              {/* Subtitle */}
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-sky-100 mb-3 sm:mb-4 leading-snug">
                {content.hero?.subtitle || 'Consult With Our Senior Engineers & Schedule an On-Site Inspection.'}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-sky-200/85 leading-relaxed mb-4 sm:mb-6 max-w-2xl mx-auto lg:mx-0">
                {content.hero?.description ||
                  'Schedule a comprehensive diagnostic survey, receive an IS-compliant Bill of Quantities (BOQ), and obtain up to 10-year written warranty protection across all 4 specializations.'}
              </p>

              {/* Feature Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-sky-950/70 border border-sky-800 text-[11px] sm:text-xs font-mono text-sky-300 shadow-xs">
                  <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                  <span>IS 1346 &amp; IS 3067 Compliant</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-sky-950/70 border border-sky-800 text-[11px] sm:text-xs font-mono text-sky-300 shadow-xs">
                  <Clock size={13} className="text-amber-400 shrink-0" />
                  <span>{content.hotlines?.inspectionDispatch || '24–48 Hrs'} Dispatch</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-sky-950/70 border border-sky-800 text-[11px] sm:text-xs font-mono text-sky-300 shadow-xs">
                  <MapPin size={13} className="text-rose-400 shrink-0" />
                  <span>{content.hotlines?.inspectionCoverage || 'Hyderabad & Telangana'}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: HERO BANNER PHOTO */}
            <div className="lg:col-span-5 relative w-full mt-2 lg:mt-0">
              {/* Diffused Ambient Glow Aura */}
              <div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-emerald-500/25 via-sky-500/30 to-cyan-500/20 blur-2xl opacity-70 group-hover:opacity-95 transition-opacity duration-700 pointer-events-none"
                aria-hidden="true"
              />

              {/* Clean, Elegant Architectural Frame */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group transition-all duration-300 hover:border-white/35">
                <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] max-h-[220px] sm:max-h-[300px] lg:max-h-none w-full overflow-hidden relative">
                  <img
                    src={content.hero?.imageUrl || '/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png'}
                    alt={content.hero?.imageAlt || 'SLN Engineers Civil Protection'}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.src = '/uploads/pillars-horizontal-banner.jpg';
                    }}
                  />

                  {/* Subtle edge-sheen gloss on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>

              {/* Minimal Clean Caption Strip Beneath Photo */}
              <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10.5px] sm:text-[11px] text-sky-200/80 px-1">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{content.hero?.imageCaption || 'Engineering Structural Defense'}</span>
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {content.hero?.imageBadge || 'All 4 Disciplines'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="container max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-5 sm:mt-6 space-y-5 sm:space-y-6">
        {/* 2. QUICK CONTACT INFORMATION CARDS (2x2 ON MOBILE, 4-COL ON DESKTOP) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Card 1 — Helpline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 hover:shadow-md hover:border-sky-300 transition-all duration-300 group">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#0e7490] group-hover:scale-105 text-white flex items-center justify-center shrink-0 shadow-xs transition-transform">
              <Phone size={17} className="sm:hidden" />
              <Phone size={20} className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-bold text-slate-700">
                <span className="truncate">Senior Helpline</span>
                <span className="hidden xs:inline-block text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-extrabold shrink-0">
                  {content.hotlines?.helplineStatus || 'Available'}
                </span>
              </div>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0891b2] transition-colors block truncate mt-0.5"
              >
                {phone}
              </a>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {content.hotlines?.helplineHours || 'Mon – Sat Available'}
              </div>
            </div>
          </div>

          {/* Card 2 — WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 hover:shadow-md hover:border-emerald-300 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#22c55e] to-emerald-700 group-hover:scale-105 text-white flex items-center justify-center shrink-0 shadow-xs transition-transform">
              <MessageCircle size={18} className="sm:hidden" />
              <MessageCircle size={21} className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-bold text-slate-700">
                <span className="truncate">WhatsApp Desk</span>
                <span className="hidden xs:inline-block text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-extrabold shrink-0">
                  {content.hotlines?.whatsappStatus || 'Online'}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5 truncate">
                Direct Chat Desk
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {content.hotlines?.whatsappNote || 'Instant Photo Review'}
              </div>
            </div>
          </a>

          {/* Card 3 — Inspection Dispatch */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 hover:shadow-md hover:border-sky-300 transition-all duration-300 group">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0284c7] to-sky-700 group-hover:scale-105 text-white flex items-center justify-center shrink-0 shadow-xs transition-transform">
              <Clock size={17} className="sm:hidden" />
              <Clock size={20} className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-bold text-slate-700">
                <span className="truncate">Site Inspection</span>
                <span className="hidden xs:inline-block text-sky-700 bg-sky-50 border border-sky-200/80 px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-extrabold shrink-0">
                  Prompt
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0284c7] transition-colors mt-0.5 truncate">
                {content.hotlines?.inspectionDispatch || '24–48 Hrs'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {content.hotlines?.inspectionCoverage || 'Hyderabad & Telangana'}
              </div>
            </div>
          </div>

          {/* Card 4 — Hyderabad Headquarters */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 hover:shadow-md hover:border-slate-400 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0f172a] to-slate-800 group-hover:scale-105 text-white flex items-center justify-center shrink-0 shadow-xs transition-transform">
              <MapPin size={17} className="sm:hidden" />
              <MapPin size={20} className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                {hq.city || 'Hyderabad'}
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-900 transition-colors mt-0.5 truncate">
                {hq.name ? 'Engineering HQ' : 'Headquarters'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {hq.street ? `${hq.street}` : 'Operational HQ'}
              </div>
            </div>
          </a>
        </div>

        {/* 3. TWO-COLUMN MAIN CONTENT (LEFT: 55%, RIGHT: 45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: SAME INSPECTION FORM PRESENT ON HERO BANNER */}
          <div
            id="inspection-form"
            ref={formCardRef}
            className={`lg:col-span-7 xl:col-span-7 w-full relative scroll-mt-28 sm:scroll-mt-32 transition-all duration-300 ${
              formHighlighted ? 'ring-4 ring-emerald-400/40 rounded-2xl' : ''
            }`}
          >
            {/* Dynamic Animated Ambient Glow Aura Behind the Form Card */}
            <div
              className="inspection-form-aura"
              style={{
                background: `radial-gradient(ellipse at center, ${logoNameColor || '#029746'}40 0%, #0284c725 45%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            <div className="inspection-form-card group">
              {/* Fluid Diagonal Waves Flowing Corner to Corner */}
              <div className="inspection-form-waves" aria-hidden="true">
                <div className="form-diagonal-gradient-wave" />

                {/* Wave 1: Primary Emerald/Sky Fluid Wave */}
                <svg className="form-wave-svg wave-svg-1" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <path
                    d="M0,160 C320,280 640,40 960,200 C1120,280 1200,100 1400,180 L1400,400 L0,400 Z"
                    fill="url(#wave-grad-1-contact)"
                  />
                  <defs>
                    <linearGradient id="wave-grad-1-contact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#029746" stopOpacity="0.08" />
                      <stop offset="50%" stopColor="#0284c7" stopOpacity="0.07" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Wave 2: Secondary Intersecting Azure/Teal Wave */}
                <svg className="form-wave-svg wave-svg-2" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <path
                    d="M0,220 C280,90 580,310 880,140 C1080,40 1200,190 1400,120 L1400,400 L0,400 Z"
                    fill="url(#wave-grad-2-contact)"
                  />
                  <defs>
                    <linearGradient id="wave-grad-2-contact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.07" />
                      <stop offset="60%" stopColor="#059669" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Wave 3: Luminous Wave Crest Ripple Line */}
                <svg className="form-wave-svg wave-svg-3" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <path
                    d="M0,175 C300,290 620,60 940,210 C1100,285 1220,120 1400,190"
                    fill="none"
                    stroke="url(#crest-grad-contact)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="crest-grad-contact" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                      <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.45" />
                      <stop offset="65%" stopColor="#34d399" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Sleek Top Brand Animated Gradient Accent Line */}
              <div className="inspection-form-top-accent" />

              <div className="p-4 sm:p-6 lg:p-7 relative z-10">
                {/* Brand Header Lockup based on Logo & Logo Name */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/90">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      style={{ borderColor: `${logoNameColor}30` }}
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white p-1 border shadow-xs flex items-center justify-center shrink-0"
                    >
                      <img
                        src={logoUrl}
                        alt={brandNameLine1}
                        className="w-full h-full object-contain filter drop-shadow-2xs"
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
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: logoNameColor }} />
                    <span>Inspection</span>
                  </div>
                </div>

                {submitted && submittedDetails ? (
                  /* Success View matching homepage banner */
                  <div className="text-center py-4 space-y-3.5">
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
                    <div className="space-y-1">
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
                      <h4 className="text-xl font-extrabold text-slate-900">Inspection Request Received!</h4>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                        Thank you, <strong className="text-slate-900">{submittedDetails.customerName}</strong>! Our structural engineer from <strong style={{ color: logoNameColor }}>{brandNameLine1}</strong> will call you shortly on <strong className="text-slate-900 font-bold">+91 {submittedDetails.phone}</strong> to schedule the on-site inspection for <strong className="text-slate-900">{submittedDetails.location}</strong>.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setSubmittedDetails(null);
                        }}
                        className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-4 rounded-lg w-full sm:w-auto border border-slate-200"
                      >
                        Submit Another Request
                      </button>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(brandNameLine1)},%20I%20just%20submitted%20an%20inspection%20request%20for%20${encodeURIComponent(submittedDetails.location)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm text-xs font-semibold py-2 px-4 rounded-lg w-full sm:w-auto flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <MessageCircle size={14} /> WhatsApp Us
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                    <div className="mb-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Request Inspection
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Direct on-site engineering assessment &amp; moisture survey.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="flex-1 font-medium">{errorMsg}</span>
                      </div>
                    )}

                    {/* 1. Customer / Company Name */}
                    <div>
                      <label htmlFor="contact-customerName" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Customer / Company Name <span className="text-amber-500">*</span>
                      </label>
                      <div
                        className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 ${
                          formErrors.customerName
                            ? 'border-rose-400 ring-1 ring-rose-400/20'
                            : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                        }`}
                      >
                        <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor || '#029746' }}>
                          <User size={15} />
                        </span>
                        <input
                          id="contact-customerName"
                          ref={nameInputRef}
                          type="text"
                          value={formData.customerName}
                          onChange={(e) => {
                            setFormData({ ...formData, customerName: e.target.value });
                            if (formErrors.customerName) {
                              setFormErrors({ ...formErrors, customerName: '' });
                            }
                          }}
                          placeholder="Enter customer or company name"
                          className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-xs md:text-sm focus:outline-hidden"
                        />
                      </div>
                      {formErrors.customerName && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">
                          {formErrors.customerName}
                        </p>
                      )}
                    </div>

                    {/* 2. Phone Number */}
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
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
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 border-r border-slate-200/90 text-xs font-bold shrink-0 text-slate-700"
                        >
                          <Phone size={13} className="text-emerald-600" />
                          <span>+91</span>
                        </div>
                        <input
                          id="contact-phone"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({ ...formData, phone: digits });
                            if (formErrors.phone) {
                              setFormErrors({ ...formErrors, phone: '' });
                            }
                          }}
                          placeholder="Enter 10-digit mobile number."
                          className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-xs md:text-sm focus:outline-hidden"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* 3. Property Location / Area */}
                    <div>
                      <label htmlFor="contact-location" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Property Location / Area <span className="text-amber-500">*</span>
                      </label>
                      <div
                        className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 ${
                          formErrors.location
                            ? 'border-rose-400 ring-1 ring-rose-400/20'
                            : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                        }`}
                      >
                        <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor || '#029746' }}>
                          <MapPin size={15} />
                        </span>
                        <input
                          id="contact-location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => {
                            setFormData({ ...formData, location: e.target.value });
                            if (formErrors.location) {
                              setFormErrors({ ...formErrors, location: '' });
                            }
                          }}
                          placeholder="Enter property location or area."
                          className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-xs md:text-sm focus:outline-hidden"
                        />
                      </div>
                      {formErrors.location && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">
                          {formErrors.location}
                        </p>
                      )}
                    </div>

                    {/* Polished Dynamic Brand Gradient Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        background: submitting
                          ? `${logoNameColor}cc`
                          : `linear-gradient(135deg, ${logoNameColor} 0%, #03b655 50%, ${logoNameColor} 100%)`,
                        boxShadow: `0 10px 25px -4px ${logoNameColor}45, 0 4px 10px -2px ${logoNameColor}30`,
                      }}
                      className="w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl text-white font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-105 hover:scale-[1.015] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer group"
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

                    {/* Clean Micro Trust Badges */}
                    <div className="pt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100 flex-wrap gap-1 sm:gap-0">
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
                        <span>ISO Practice</span>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 COHESIVE, HIGH-IMPACT ARCHITECTURAL CARDS */}
          <div className="lg:col-span-5 space-y-4">
            {/* CARD 1: DIRECT ENGINEERING COORDINATION DESKS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-3.5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 truncate">
                    Direct Engineering Desks
                  </span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  Zero Obligation
                </span>
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {/* 1. Helpline */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-sky-50/70 border border-slate-100 hover:border-sky-200 transition-all group">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0891b2] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Phone size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="block text-slate-900 font-bold text-xs truncate">
                          Senior Engineering Helpline
                        </strong>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                          {content.hotlines?.helplineStatus || 'Available'}
                        </span>
                      </div>
                      <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-[#0891b2] transition-colors block mt-0.5 truncate"
                      >
                        {phone}
                      </a>
                      <div className="text-[10.5px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                        {content.hotlines?.helplineHours || 'Mon – Sat: 8:00 AM – 8:30 PM'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(phone, 'helpline', e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-white transition-all cursor-pointer shrink-0 mt-0.5 shadow-2xs border border-transparent hover:border-slate-200"
                    title="Copy Phone Number"
                  >
                    {copiedField === 'helpline' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCheck size={13} />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>

                {/* 2. WhatsApp Direct Coordination */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 transition-all group/wa cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover/wa:scale-105 transition-transform">
                      <MessageCircle size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="block text-slate-900 font-bold text-xs group-hover/wa:text-emerald-800 transition-colors truncate">
                          Chat on WhatsApp Direct
                        </strong>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-full shrink-0">
                          Instant Review
                        </span>
                      </div>
                      <div className="text-xs sm:text-[13px] font-black text-slate-900 group-hover/wa:text-emerald-700 transition-colors mt-0.5">
                        Send Photos &amp; Video Clips
                      </div>
                      <div className="text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Direct preliminary moisture and leakage assessment.
                      </div>
                    </div>
                  </div>
                </a>

                {/* 3. Technical Proposal & Drawings Inquiries */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-sky-50/70 border border-slate-100 hover:border-sky-200 transition-all group">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-slate-900 font-bold text-xs truncate">
                        Drawings &amp; Tender Inquiries
                      </strong>
                      <a
                        href={`mailto:${email}`}
                        className="text-xs sm:text-sm font-extrabold text-[#0284c7] hover:underline block mt-0.5 truncate"
                      >
                        {email}
                      </a>
                      <div className="text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                        {content.hotlines?.emailNote || 'Architectural drawings, tenders & corporate BOQs.'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(email, 'email', e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-white transition-all cursor-pointer shrink-0 mt-0.5 shadow-2xs border border-transparent hover:border-slate-200"
                    title="Copy Email Address"
                  >
                    {copiedField === 'email' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCheck size={13} />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-Card Quality Assurance Assurance */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] sm:text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-600" />
                  <span>No consultation fee</span>
                </span>
                <span className="text-slate-400 font-mono text-[9.5px] sm:text-[10px]">
                  ~15 min response time
                </span>
              </div>
            </div>

            {/* CARD 2: OPERATIONAL HEADQUARTERS & VERIFIED ENGINEERING STANDARDS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden hover:shadow-sm transition-shadow">
              {/* HQ Address Section */}
              <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {hq.city || 'Hyderabad'} Operational Headquarters
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {hq.name || 'Civil Engineering Operations Hub'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs shadow-2xs transition-all shrink-0"
                  >
                    <span>Maps</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-slate-800 leading-snug">
                    {hq.street}, {hq.area ? `${hq.area}, ` : ''}{hq.city}, {hq.state} — {hq.pincode}
                  </p>
                  {hq.landmark && (
                    <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-mono">
                      Landmark: {hq.landmark}
                    </p>
                  )}
                </div>

                {/* 4-Column Accreditation Badges Strip */}
                <div className="grid grid-cols-4 divide-x divide-slate-100 border border-slate-100 rounded-xl p-2 sm:p-2.5 bg-slate-50/50 text-center items-center">
                  <div className="px-1 flex flex-col items-center">
                    <span className="text-[10.5px] sm:text-[11px] font-black text-slate-900">IS 1346</span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-400 uppercase tracking-wider">Compliant</span>
                  </div>
                  <div className="px-1 flex flex-col items-center">
                    <span className="text-[10.5px] sm:text-[11px] font-black text-slate-900">IS 3067</span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-400 uppercase tracking-wider">Certified</span>
                  </div>
                  <div className="px-1 flex flex-col items-center">
                    <span className="text-[10.5px] sm:text-[11px] font-black text-emerald-700">ISO 9001</span>
                    <span className="text-[8.5px] sm:text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">Practice</span>
                  </div>
                  <div className="px-1 flex flex-col items-center">
                    <span className="text-[10.5px] sm:text-[11px] font-black text-slate-900">QR Deed</span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-400 uppercase tracking-wider">Handover</span>
                  </div>
                </div>
              </div>

              {/* Integrated Engineering Commitment Footer Ribbon */}
              <div className="bg-[#0b2847] text-white p-3 sm:p-3.5 px-3.5 sm:px-5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 xs:gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0">
                    <Shield size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      Our Engineering Commitment
                    </div>
                    <div className="text-[10px] text-slate-300 truncate">
                      Diagnostic Surveys • Itemized BOQs • Legal Handover
                    </div>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 text-xs font-bold shrink-0">
                  {content.hotlines?.inspectionDispatch || '24–48h'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. OUR 4-STEP DIAGNOSTIC TO HANDOVER PROCESS */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mb-5 sm:mb-7">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
              <span>Transparent Engineering Workflow</span>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0f2847] tracking-tight">
              What Happens When You Request an On-Site Inspection?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 leading-relaxed">
              Every site survey is conducted by qualified civil waterproofing engineers following IS 1346 and IS 3067 standards — ensuring pinpoint accuracy, non-invasive investigation, and long-term warranties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {(content.processSteps || DEFAULT_CONTACT_CONTENT.processSteps).map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-sky-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <span className="text-xl sm:text-2xl font-black text-slate-300 group-hover:text-sky-600 transition-colors font-mono">
                    {step.step || `0${idx + 1}`}
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                    {idx === 0 ? <Search size={15} /> : idx === 1 ? <FileText size={15} /> : idx === 2 ? <Layers size={15} /> : <ShieldCheck size={15} />}
                  </div>
                </div>

                <span className="inline-block text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md mb-1.5 sm:mb-2">
                  {step.badge}
                </span>

                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#0f2847] leading-snug mb-1 sm:mb-1.5">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <HelpCircle size={13} className="text-sky-600" />
                <span>Inspection &amp; Technical Guidance</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0f2847] tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Clear answers regarding on-site surveys, diagnostic instruments, and written warranty documents.
              </p>
            </div>

            {/* FAQ Search Filter */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="form-input text-base sm:text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border-slate-200 focus:bg-white w-full"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 sm:top-2 text-slate-400 pointer-events-none" />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch('')}
                  className="absolute right-2.5 top-2.5 sm:top-2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-sky-300 bg-sky-50/20 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 sm:gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isOpen ? 'bg-[#0284c7] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        Q
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-700 bg-sky-100' : 'bg-slate-50'
                    }`}>
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 text-xs text-slate-600 leading-relaxed border-t border-sky-100/60 mt-1">
                      <p className="pt-2 sm:pl-7">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick FAQ Footer Callout */}
          <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-600 text-center sm:text-left">
              <span className="font-bold text-slate-900 block sm:inline">Have a specific architectural drawing or tender document? </span>
              <span>Our technical team can review structural drawings directly.</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start shrink-0">
              <a
                href={`mailto:${email}`}
                className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-lg border border-slate-300 hover:border-sky-400 bg-white hover:bg-sky-50 text-slate-800 font-bold text-xs transition-colors"
              >
                Email Drawings
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SLN%20Engineers,%20I%20have%20an%20architectural%20drawing%20for%20review.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageCircle size={13} />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 lg:bottom-8 right-4 sm:right-6 z-40 p-3 rounded-full bg-slate-900/90 text-white shadow-xl hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-700/50 backdrop-blur-xs cursor-pointer group"
          aria-label="Back to top"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Mobile Fixed Quick-Bar (Small Screens Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 shadow-2xl">
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-sky-50 text-sky-800 border border-sky-300 font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:bg-sky-100"
        >
          <Phone size={14} className="text-sky-600" />
          <span>Call Helpline</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#22c55e] active:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <MessageCircle size={14} />
          <span>WhatsApp Chat</span>
        </a>
      </div>
    </div>
  );
}
