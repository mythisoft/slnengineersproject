import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  ExternalLink,
  QrCode,
  ArrowRight,
  Shield,
  User,
  Calendar,
  FileCheck,
  MessageSquare,
  Phone,
  MessageCircle,
  Users,
  Check,
  ArrowUp,
  RotateCw,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import { DEFAULT_REVIEWS_HERO } from '../../utils/reviewsData';

export default function CustomerReviews() {
  const [reviewsData, setReviewsData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [customerQr, setCustomerQr] = useState(null);
  const [isQrFlipped, setIsQrFlipped] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll progress and back-to-top tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
      setShowBackToTop(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchApi('/reviews')
      .then((res) => {
        if (res.success && res.data) setReviewsData(res.data);
      })
      .catch((e) => console.error('Failed to load reviews:', e));

    fetchApi('/settings')
      .then((res) => {
        if (res.success && res.data) setSettings(res.data);
      })
      .catch((e) => console.error('Failed to load settings:', e));

    fetchApi('/reviews/universal-qr')
      .then((res) => {
        if (res.success && res.data) setCustomerQr(res.data);
      })
      .catch((e) => console.error('Failed to load universal QR:', e));

    const handleReviewsUpdated = () => {
      fetchApi('/reviews')
        .then((res) => {
          if (res.success && res.data) setReviewsData(res.data);
        })
        .catch((e) => console.error('Failed to reload reviews:', e));
    };

    try {
      localStorage.removeItem('sln_cached_reviews');
      localStorage.removeItem('sln_reviews');
    } catch {}

    window.addEventListener('sln_reviews_updated', handleReviewsUpdated);
    return () => window.removeEventListener('sln_reviews_updated', handleReviewsUpdated);
  }, []);

  const displayedReviews = useMemo(() => {
    if (!reviewsData?.reviews || reviewsData.reviews.length === 0) {
      return [];
    }

    return reviewsData.reviews.map((r, i) => ({
      id: r._id || `rev-${i}`,
      customerName: r.customerName || 'Verified Client',
      rating: r.rating || 5,
      quote: r.feedbackText?.startsWith('“')
        ? r.feedbackText
        : `“${r.feedbackText}”`,
      isDbReview: true,
    }));
  }, [reviewsData]);

  // High-performance IntersectionObserver for scroll animations
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const revealSelectors = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-blur, .scroll-reveal-pop';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      document.querySelectorAll(revealSelectors).forEach((el) => {
        el.classList.add('is-revealed');
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    const observeNew = () => {
      document.querySelectorAll(revealSelectors).forEach((el) => {
        if (!el.classList.contains('is-revealed')) observer.observe(el);
      });
    };

    observeNew();
    const frame = window.requestAnimationFrame(observeNew);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [displayedReviews.length]);

  const phone = settings?.phone || '+91 89776 68777';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  const googleReviewUrl =
    customerQr?.googleReviewUrl ||
    settings?.googleReviewUrl ||
    'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';

  const googleQrImage =
    customerQr?.googleQrCodeDataUrl ||
    customerQr?.googleQrDataUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=1a73e8&data=${encodeURIComponent(googleReviewUrl)}`;

  const customerReviewUrl =
    customerQr?.reviewUrl ||
    (typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}/review`
      : 'https://slnengineersproject.vercel.app/review');

  const customerQrImage =
    customerQr?.qrCodeDataUrl ||
    customerQr?.qrDataUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=0f4c81&data=${encodeURIComponent(customerReviewUrl)}`;

  const pageContent = { ...DEFAULT_REVIEWS_HERO, ...(settings?.reviewsPageContent || {}) };

  return (
    <div className="reviews-page bg-slate-50/70 text-slate-800 antialiased pb-20 relative">
      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress-indicator"
        style={{ transform: `scaleX(${scrollProgress})` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      {/* 1. HERO SECTION WITH GOOGLE REVIEW CALLOUT & VILLA BACKDROP */}
      <section className="relative bg-gradient-to-r from-[#f0f9ff] via-[#e0f2fe]/80 to-[#f8fafc] py-6 sm:py-14 lg:py-20 px-3.5 sm:px-6 lg:px-8 overflow-hidden border-b border-sky-100">
        {/* Subtle Ambient City Grid Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Architectural Villa Illustration / Backdrop on the Right */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-40 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 500 350" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
            <rect width="500" height="350" fill="#bae6fd" opacity="0.3" />
            <path d="M 0 160 L 500 160 L 500 350 L 0 350 Z" fill="#94a3b8" opacity="0.2" />
            <rect x="150" y="70" width="300" height="230" fill="#cbd5e1" opacity="0.4" rx="4" />
            <rect x="170" y="85" width="130" height="90" fill="#0284c7" opacity="0.3" rx="2" />
            <rect x="320" y="85" width="110" height="90" fill="#0284c7" opacity="0.3" rx="2" />
            <rect x="170" y="195" width="260" height="95" fill="#0284c7" opacity="0.35" rx="2" />
            <ellipse cx="100" cy="220" rx="45" ry="60" fill="#16a34a" opacity="0.4" />
            <ellipse cx="460" cy="210" rx="35" ry="50" fill="#15803d" opacity="0.4" />
          </svg>
        </div>

        <div className="container max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column: Headline, Narrative & Rating Bar */}
          <div className="max-w-xl text-left scroll-reveal w-full">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-300/80 text-[#0284c7] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2.5 sm:mb-4 shadow-2xs animate-pulse-glow max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-pulse shrink-0" />
              <span className="truncate">{pageContent.badge || '40 Years of Field Engineering • Three Generations'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2.5 sm:mb-3 text-reveal">
              {pageContent.title || 'Customer Reviews'}{' '}
              {pageContent.titleAccent && (
                <span className="text-[#0284c7] font-extrabold">{pageContent.titleAccent}</span>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mb-4 sm:mb-6 text-reveal delay-100">
              {pageContent.description || 'Genuine experiences submitted by property owners, luxury villa residents, facility managers, and civil architects through our tamper-proof handover QR-code warranty system.'}
            </p>

            {/* Rating Stars Bar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-reveal delay-200">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="currentColor"
                    className="drop-shadow-[0_0_6px_rgba(251,191,36,0.6)] sm:w-[22px] sm:h-[22px]"
                  />
                ))}
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900 ml-1">
                {reviewsData?.stats?.averageRating || reviewsData?.stats?.avgRating || '5.0'}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium ml-1">
                {reviewsData?.stats?.totalReviews
                  ? `Based on ${reviewsData.stats.totalReviews} verified client reviews`
                  : 'Based on verified client reviews & inspections'}
              </span>
            </div>
          </div>

          {/* Center/Middle Accent Script Typography */}
          <div className="hidden xl:block transform -rotate-12 self-center scroll-reveal delay-200">
            <div className="text-[#0284c7] font-serif italic text-xl leading-tight font-bold drop-shadow-sm animate-float">
              <div>Real People</div>
              <div>Real Experiences</div>
              <div>Real Results</div>
            </div>
          </div>

          {/* Right Column: 3D Rotating Review Scan Card (Google Review Scan -> Customer Review Scan) */}
          <div className="w-full max-w-[340px] sm:max-w-sm shrink-0 scroll-reveal-right delay-300 mt-4 lg:mt-0 mx-auto lg:mx-0">
            <div className="perspective-1000 w-full">
              <div
                onClick={() => setIsQrFlipped((prev) => !prev)}
                className={`relative w-full transform-style-3d card-flip-transition cursor-pointer select-none active:scale-[0.99] touch-manipulation ${
                  isQrFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ minHeight: '390px' }}
                title="Click to rotate between Google Review Scan and Customer Review Scan"
              >
                {/* ---------------------------------------------------- */}
                {/* SIDE 1 (FRONT): GOOGLE REVIEW SCAN (Default View)    */}
                {/* ---------------------------------------------------- */}
                <div className="w-full h-full backface-hidden bg-white rounded-2xl border-2 border-sky-400/90 shadow-2xl p-3.5 sm:p-5 text-center flex flex-col justify-between relative overflow-hidden group hover:border-sky-500 transition-colors">
                  {/* Google Multicolor Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-red-500 via-amber-400 to-green-500" />

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                        <span className="text-sm sm:text-base font-black bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                          G
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight">
                          Google Review Scan
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block leading-tight">
                          Official Google Business Profile
                        </span>
                      </div>
                    </div>

                    {/* Rotation Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQrFlipped(true);
                      }}
                      className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 shadow-2xs transition-all active:scale-95 shrink-0"
                      title="Click to rotate to Customer Review Scan"
                    >
                      <RotateCw size={11} className="text-sky-600 animate-spin-slow shrink-0" />
                      <span>Rotate ↻</span>
                    </button>
                  </div>

                  {/* Google Scannable QR Code Frame */}
                  <div className="my-1 p-1.5 sm:p-2 bg-gradient-to-b from-sky-50/60 to-white rounded-xl border border-sky-100 inline-block mx-auto shadow-inner group-hover:border-sky-300 transition-all">
                    <img
                      src={googleQrImage}
                      alt="Google Review QR Code Scan"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto transition-transform group-hover:scale-105"
                    />
                  </div>

                  <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-700 leading-tight px-1">
                    Point your mobile camera at the QR code to review on Google
                  </p>

                  {/* Click to Rotate Interactive Hint Banner */}
                  <div className="mt-2 p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold hover:from-amber-100 hover:to-orange-100 transition-all shadow-2xs">
                    <RotateCw size={12} className="text-amber-600 animate-spin-slow shrink-0" />
                    <span>Click anywhere to rotate to Customer Review Scan ↻</span>
                  </div>

                  {/* Direct Google Review Button */}
                  <div className="mt-2 sm:mt-2.5 pt-2 border-t border-slate-100">
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-[#1a73e8] hover:bg-blue-600 shadow-md transition-all active:scale-98"
                    >
                      <span className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-[9px] shrink-0">
                        G
                      </span>
                      <span className="truncate">Write a Google Review Directly</span>
                      <ExternalLink size={12} className="text-white/80 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* SIDE 2 (BACK): CUSTOMER REVIEW SCAN (Rotated View)   */}
                {/* ---------------------------------------------------- */}
                <div className="w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl border-2 border-emerald-400/90 shadow-2xl p-3.5 sm:p-5 text-center flex flex-col justify-between absolute inset-0 overflow-hidden group hover:border-emerald-500 transition-colors">
                  {/* Emerald / Brand Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-600" />

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs flex items-center justify-center shrink-0 text-emerald-700">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="text-left">
                        <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight">
                          Customer Review Scan
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold block leading-tight">
                          SLN Engineers Projects
                        </span>
                      </div>
                    </div>

                    {/* Rotation Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQrFlipped(false);
                      }}
                      className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 shadow-2xs transition-all active:scale-95 shrink-0"
                      title="Click to rotate back to Google Review Scan"
                    >
                      <RotateCw size={11} className="text-emerald-700 animate-spin-slow shrink-0" />
                      <span>Rotate ↻</span>
                    </button>
                  </div>

                  {/* Customer Scannable QR Code Frame */}
                  <div className="my-1 p-1.5 sm:p-2 bg-gradient-to-b from-emerald-50/60 to-white rounded-xl border border-emerald-100 inline-block mx-auto shadow-inner group-hover:border-emerald-300 transition-all">
                    <img
                      src={customerQrImage}
                      alt="Customer Review QR Code Scan"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto transition-transform group-hover:scale-105"
                    />
                  </div>

                  <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-700 leading-tight px-1">
                    Point your mobile camera at the QR code to submit feedback
                  </p>

                  {/* Click to Rotate Interactive Hint Banner */}
                  <div className="mt-2 p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 text-sky-900 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold hover:from-sky-100 hover:to-indigo-100 transition-all shadow-2xs">
                    <RotateCw size={12} className="text-sky-600 animate-spin-slow shrink-0" />
                    <span>Click anywhere to rotate to Google Review Scan ↻</span>
                  </div>

                  {/* Direct Customer Review Form Button */}
                  <div className="mt-2 sm:mt-2.5 pt-2 border-t border-slate-100">
                    <Link
                      to="/review"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-98"
                    >
                      <Star size={13} className="text-amber-300 fill-amber-300 shrink-0" />
                      <span className="truncate">Open Customer Review Form Directly</span>
                      <ArrowRight size={13} className="shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR TRUST METRIC TILES */}
      <div className="container max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 -mt-5 sm:-mt-7 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-2.5 sm:p-5 particle-bg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-stretch">
            {/* Tile 1 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 p-2 sm:p-3 rounded-xl trust-metric-card scroll-reveal stagger-1 group hover:-translate-y-1 hover:bg-sky-50/60 transition-all duration-300 cursor-default">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-600">
                <Star size={16} fill="currentColor" className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-black text-slate-900 group-hover:text-amber-600 tracking-tight leading-none transition-colors duration-200 truncate">
                  {pageContent.trustTile1Value || (reviewsData?.stats?.avgRating ? `${reviewsData.stats.avgRating} / 5.0` : '5.0 / 5.0')}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1 leading-tight truncate">{pageContent.trustTile1Label || 'Average Star Rating'}</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium leading-tight truncate">
                  {pageContent.trustTile1Sub || (reviewsData?.stats?.totalReviews ? `${reviewsData.stats.totalReviews} Verified Client Reviews` : '100% Verified Clients')}
                </div>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 p-2 sm:p-3 rounded-xl trust-metric-card scroll-reveal stagger-2 group hover:-translate-y-1 hover:bg-sky-50/60 transition-all duration-300 cursor-default">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0284c7] group-hover:bg-sky-600 group-hover:scale-110 text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300">
                <Users size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-black text-slate-900 group-hover:text-[#0284c7] tracking-tight leading-none transition-colors duration-200 truncate">
                  {pageContent.trustTile2Value || '3'}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1 leading-tight truncate">{pageContent.trustTile2Label || 'Generations of Engineers'}</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium leading-tight truncate">{pageContent.trustTile2Sub || 'Family-Led Integrity'}</div>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 p-2 sm:p-3 rounded-xl trust-metric-card scroll-reveal stagger-3 group hover:-translate-y-1 hover:bg-sky-50/60 transition-all duration-300 cursor-default">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0284c7] group-hover:bg-sky-600 group-hover:scale-110 text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300">
                <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-black text-slate-900 group-hover:text-[#0284c7] tracking-tight leading-none transition-colors duration-200 truncate">
                  {pageContent.trustTile3Value || '1,450+'}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1 leading-tight truncate">{pageContent.trustTile3Label || 'Zero-Leak Sites Sealed'}</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium leading-tight truncate">{pageContent.trustTile3Sub || 'Zero Re-leak Failures'}</div>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 p-2 sm:p-3 rounded-xl trust-metric-card scroll-reveal stagger-4 group hover:-translate-y-1 hover:bg-sky-50/60 transition-all duration-300 cursor-default">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-emerald-600 group-hover:bg-emerald-700 group-hover:scale-110 text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300">
                <QrCode size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 tracking-tight leading-none transition-colors duration-200 truncate">
                  {pageContent.trustTile4Value || 'QR Handover'}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1 leading-tight truncate">{pageContent.trustTile4Label || 'Authentic QR Verification'}</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium leading-tight truncate">{pageContent.trustTile4Sub || 'Bonded Warranty Included'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THREE VERIFIED REVIEW CARDS */}
      <section className="py-6 sm:py-16">
        <div className="container max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="text-left mb-5 sm:mb-8 scroll-reveal">
            <span className="text-[#0284c7] font-bold text-[11px] sm:text-xs uppercase tracking-wider block mb-1">
              {pageContent.catalogSubtitle || 'Field Verified Testimonials'}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#061b33] tracking-tight">
              {pageContent.catalogTitle || 'Real Experiences From Property Owners'}
            </h2>
          </div>

          {displayedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {displayedReviews.map((review, idx) => (
                <div
                  key={review.id || idx}
                  className={`relative bg-white rounded-2xl border border-sky-100 shadow-2xs hover:shadow-xl hover:border-sky-300 sm:hover:-translate-y-2 transition-all duration-300 p-4 sm:p-6 flex flex-col justify-between overflow-hidden group scroll-reveal-pop stagger-${(idx % 3) + 1}`}
                >
                  {/* Top Sliding Gradient Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

                  {/* Elegant Background Watermark Quote */}
                  <span className="absolute right-4 top-2 text-7xl font-serif text-sky-100/60 select-none pointer-events-none group-hover:text-sky-200/80 group-hover:scale-105 transition-all duration-300">
                    “
                  </span>

                  <div className="relative z-10">
                    {/* Card Header: Rating Stars & Verified Customer Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < (review.rating || 5) ? 'currentColor' : 'none'}
                            className={`drop-shadow-xs sm:w-[15px] sm:h-[15px] ${
                              i < (review.rating || 5)
                                ? 'text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 text-[10px] sm:text-[11px] font-semibold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                        <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                        <span>Verified Customer</span>
                      </div>
                    </div>

                    {/* Review Quote Body */}
                    <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed mb-4 italic break-words">
                      {review.quote}
                    </p>
                  </div>

                  {/* Metadata Details: Customer Name */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors truncate">
                      <User size={14} className="text-sky-600 shrink-0" />
                      <span className="truncate">{review.customerName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 sm:p-12 text-center max-w-md mx-auto shadow-xs">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No Reviews Yet</h3>
              <p className="text-xs text-slate-500 mb-4">
                Be the first to share your experience with SLN Engineers Projects!
              </p>
              <Link to="/review" className="btn btn-primary btn-sm text-xs inline-flex items-center gap-1.5">
                <Star size={13} className="text-amber-300 fill-amber-300" />
                <span>Submit a Customer Review</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW SLN CUSTOMER REVIEWS ARE COLLECTED INFOGRAPHIC BANNER */}
      <section className="container max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 scroll-reveal">
        <div className="bg-[#f0f9ff]/90 border border-sky-200/80 rounded-2xl p-4 sm:p-8 lg:p-10 relative overflow-hidden shadow-xs hover:border-sky-300 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
            {/* Left Column: Narrative and 4-Step Process Flow */}
            <div className="lg:col-span-8 space-y-3.5 sm:space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-sky-700 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2">
                  <Shield size={13} className="text-sky-600 shrink-0" />
                  <span>HOW SLN CUSTOMER REVIEWS ARE COLLECTED</span>
                </div>
                <h2 className="text-lg sm:text-3xl font-extrabold text-[#061b33] tracking-tight mb-1.5 sm:mb-2">
                  Simple. Transparent. Trusted.
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-xl">
                  Upon project completion, our engineer hands over your warranty certificate containing a personalized QR code. Scanning this code takes you directly to a private feedback page to rate our workmanship, request follow-ups, or submit an independent Google review.
                </p>
              </div>

              {/* 4-Step Chain with Arrows */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1 sm:pt-2">
                {/* Step 1 */}
                <div className="bg-white/90 rounded-xl p-2.5 sm:p-3.5 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-1 hover:bg-white transition-all duration-200 group relative">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#0284c7] group-hover:bg-sky-600 group-hover:scale-110 text-white text-[10px] font-bold flex items-center justify-center transition-all duration-200">
                      1
                    </span>
                    <FileCheck size={16} className="text-sky-600 group-hover:scale-115 transition-transform duration-200 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight mb-0.5 sm:mb-1">Project Complete</h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 leading-tight">
                    You receive your warranty certificate with a QR code.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white/90 rounded-xl p-2.5 sm:p-3.5 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-1 hover:bg-white transition-all duration-200 group relative">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#0284c7] group-hover:bg-sky-600 group-hover:scale-110 text-white text-[10px] font-bold flex items-center justify-center transition-all duration-200">
                      2
                    </span>
                    <QrCode size={16} className="text-sky-600 group-hover:scale-115 transition-transform duration-200 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight mb-0.5 sm:mb-1">Scan QR Code</h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 leading-tight">
                    Open the camera app and scan the code on your certificate.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white/90 rounded-xl p-2.5 sm:p-3.5 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-1 hover:bg-white transition-all duration-200 group relative">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#0284c7] group-hover:bg-sky-600 group-hover:scale-110 text-white text-[10px] font-bold flex items-center justify-center transition-all duration-200">
                      3
                    </span>
                    <MessageSquare size={16} className="text-sky-600 group-hover:scale-115 transition-transform duration-200 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight mb-0.5 sm:mb-1">Share Feedback</h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 leading-tight">
                    Rate our workmanship, request follow-ups or write a review.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white/90 rounded-xl p-2.5 sm:p-3.5 border border-sky-100 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-1 hover:bg-white transition-all duration-200 group relative">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#0284c7] group-hover:bg-sky-600 group-hover:scale-110 text-white text-[10px] font-bold flex items-center justify-center transition-all duration-200">
                      4
                    </span>
                    <span className="text-xs sm:text-sm font-black bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent group-hover:scale-115 transition-transform duration-200">
                      G
                    </span>
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight mb-0.5 sm:mb-1">Help Others</h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 leading-tight">
                    Your genuine feedback helps other property owners decide.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Warranty Certificate Card with QR code */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="transform rotate-0 sm:rotate-2 hover:rotate-0 hover:scale-102 hover:shadow-2xl transition-all duration-300 w-full max-w-[240px] xs:max-w-[260px] sm:max-w-[280px] group mx-auto lg:mx-0">
                <div className="bg-white rounded-xl border border-slate-300 shadow-xl p-3.5 sm:p-5 text-center space-y-2.5 sm:space-y-3 relative group-hover:border-sky-300 transition-colors">
                  {/* Top Seal */}
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Shield size={14} className="text-sky-600 group-hover:scale-110 transition-transform sm:w-4 sm:h-4" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-800">
                      SLN ENGINEERS PROJECTS PVT. LTD.
                    </span>
                  </div>

                  <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-900 border-y border-slate-200 py-1">
                    WARRANTY CERTIFICATE
                  </h3>

                  {/* Scannable Customer Review QR Code Frame */}
                  <Link
                    to="/review"
                    className="p-2 sm:p-3 bg-slate-50 border border-slate-200 rounded-lg inline-block my-1 shadow-inner group-hover:border-emerald-500 hover:shadow-md transition-all block cursor-pointer"
                    title="Click or scan to leave a verified customer review"
                  >
                    {customerQr?.qrCodeDataUrl || customerQr?.qrDataUrl ? (
                      <img
                        src={customerQr.qrCodeDataUrl || customerQr.qrDataUrl}
                        alt="Scan to Add Customer Review"
                        className="w-20 h-20 sm:w-28 sm:h-28 mx-auto object-contain transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <QrCode size={75} className="text-slate-900 mx-auto sm:w-[100px] sm:h-[100px]" />
                    )}
                  </Link>

                  <p className="text-[9.5px] sm:text-[10px] font-bold text-slate-700 leading-tight">
                    Scan with Mobile Camera to Add Customer Review
                  </p>
                  <Link
                    to="/review"
                    className="text-[9.5px] sm:text-[10px] text-emerald-700 font-extrabold hover:underline block"
                  >
                    Or Tap Here to Open Review Form →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CONSULTATION BANNER */}
      <section className="container max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-10 sm:mt-16">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden hero-bg-animated bg-gradient-to-r from-[#031d36] via-[#073256] to-[#031d36] text-white border border-slate-800 shadow-xl scroll-reveal">
          <div className="p-4 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 relative">
            {/* Left Info */}
            <div className="flex items-start gap-3 sm:gap-4 max-w-xl w-full">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0 mt-0.5 shadow-inner animate-float">
                <ShieldCheck size={20} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-black text-white tracking-tight leading-snug">
                  Ready to Experience Permanent Zero-Leak Waterproofing?
                </h3>
                <div className="text-[11px] sm:text-xs font-bold text-sky-300 mt-1">
                  Backed by Three Generations &amp; Written Warranties Up to 10 Years
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1">
                  Schedule a thermal moisture diagnostic inspection with SLN Engineers Projects Pvt. Ltd. We provide transparent technical quotes with no hidden costs.
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full lg:w-auto justify-start lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-500 active:scale-98 shadow-sm transition-all duration-200 group w-full sm:w-auto text-center"
              >
                <Calendar size={13} className="group-hover:rotate-6 transition-transform duration-200 shrink-0" />
                <span>Book Site Inspection</span>
              </Link>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-700 active:scale-98 shadow-sm transition-all duration-200 group w-full sm:w-auto text-center"
              >
                <Phone size={13} className="group-hover:scale-115 transition-transform duration-200 shrink-0" />
                <span>Call {phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#22c55e] hover:bg-[#16a34a] active:scale-98 shadow-sm transition-all duration-200 group w-full sm:w-auto text-center"
              >
                <MessageCircle size={13} className="group-hover:scale-115 transition-transform duration-200 shrink-0" />
                <span>WhatsApp Senior Engineer</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Smooth Scroll to Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-950/85 hover:bg-[#0284c7] text-white border border-white/20 shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer ${
          showBackToTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
      >
        <ArrowUp size={16} />
      </button>
    </div>
  );
}
