import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, Shield, ArrowRight, ZoomIn, ExternalLink } from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  DEFAULT_NAVBAR_CONFIG,
  DEFAULT_NAV_LINKS,
  LOCAL_STORAGE_NAVBAR_KEY,
} from '../../utils/navbarData';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [navbarConfig, setNavbarConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_NAVBAR_KEY);
      if (stored) {
        return { ...DEFAULT_NAVBAR_CONFIG, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_NAVBAR_CONFIG;
  });
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const location = useLocation();

  const logoUrl = settings?.logoUrl || '/sln-logo.png';
  const brandNameLine1 = settings?.brandNameLine1 || 'SLN ENGINEERS';
  const brandNameLine2 = settings?.brandNameLine2 || 'PROJECTS PVT. LTD.';
  const logoNameColor = settings?.logoNameColor || '#029746';

  useEffect(() => {
    fetchApi('/settings')
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
          if (res.data.navbarConfig && Object.keys(res.data.navbarConfig).length > 0) {
            const merged = { ...DEFAULT_NAVBAR_CONFIG, ...res.data.navbarConfig };
            setNavbarConfig(merged);
            try {
              localStorage.setItem(LOCAL_STORAGE_NAVBAR_KEY, JSON.stringify(merged));
            } catch {}
          }
        }
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  // Real-time synchronization when admin modifies navbar
  useEffect(() => {
    const handleNavbarSync = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_NAVBAR_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setNavbarConfig((prev) => ({ ...DEFAULT_NAVBAR_CONFIG, ...prev, ...parsed }));
          }
        }
      } catch {}
    };

    const handleSettingsSync = (e) => {
      if (e.detail) setSettings(e.detail);
    };

    window.addEventListener('sln_navbar_updated', handleNavbarSync);
    window.addEventListener('sln_settings_updated', handleSettingsSync);
    window.addEventListener('storage', handleNavbarSync);
    return () => {
      window.removeEventListener('sln_navbar_updated', handleNavbarSync);
      window.removeEventListener('sln_settings_updated', handleSettingsSync);
      window.removeEventListener('storage', handleNavbarSync);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash, location.key]);

  // Track scroll position to enhance elevation shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close logo modal on Escape key press
  useEffect(() => {
    if (!isLogoModalOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLogoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoModalOpen]);

  // Dynamically calculate fixed header height to reserve exact space in document flow
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const topBarEl = headerRef.current.querySelector('.header-top-bar');
        const mainNavEl = headerRef.current.querySelector('.header-main-nav');
        const topH = topBarEl && window.getComputedStyle(topBarEl).display !== 'none' ? topBarEl.offsetHeight : 0;
        const navH = mainNavEl ? mainNavEl.offsetHeight : 68;
        setHeaderHeight(topH + navH);
      }
    };

    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener('resize', updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const navLinks = (navbarConfig.links || DEFAULT_NAV_LINKS).filter((l) => l && l.isActive !== false);
  const announcement = navbarConfig.topAnnouncement || DEFAULT_NAVBAR_CONFIG.topAnnouncement;
  const ctas = navbarConfig.headerCtas || DEFAULT_NAVBAR_CONFIG.headerCtas;
  const primaryCtaText =
    ctas.primaryText && ctas.primaryText !== 'Request Site Survey'
      ? ctas.primaryText
      : 'Book Inspection';

  const phone = settings?.phone || '+91 8977668776';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-300 ${
          scrolled ? 'shadow-md shadow-slate-900/6 bg-white/98' : 'shadow-xs'
        }`}
      >
        {/* Top Announcement & Utility Bar */}
        <div className="header-top-bar bg-gradient-to-r from-slate-950 via-[#071d33] to-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80 hidden md:block">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {announcement.lineageBadge || 'Restoration for Three Generations'}
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Shield size={13} className="text-sky-400 flex-shrink-0" /> {announcement.complianceText || 'ISO & Indian Standard Compliant'}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-slate-200 hover:text-white font-semibold transition-colors group"
              >
                <Phone size={13} className="text-sky-400 group-hover:rotate-12 transition-transform" />
                <span>{phone}</span>
              </a>
              <span className="text-slate-700">•</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle size={13} />
                <span>WhatsApp Direct</span>
              </a>
              <span className="text-slate-700">•</span>
              <Link
                to="/admin/login"
                className="text-slate-400 hover:text-sky-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <span>Staff Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="header-main-nav container py-3 sm:py-3.5 flex items-center justify-between">
          {/* Brand Logo & Unique Name Display */}
          <div className="header-brand flex items-center gap-3 sm:gap-3.5 py-0.5">
            {/* Logo Badge with Subtle Ambient Frame - Click to view full logo */}
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="relative flex-shrink-0 group cursor-zoom-in focus:outline-hidden"
              title="Click to view full logo"
              aria-label={`View ${brandNameLine1} Logo`}
            >
              <div
                style={{ borderColor: `${logoNameColor}33` }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 p-1 border shadow-2xs flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
              >
                <img
                  src={logoUrl}
                  alt={brandNameLine1}
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  onError={(e) => {
                    e.currentTarget.src = '/sln-logo.png';
                  }}
                />
              </div>
            </button>

            {/* Brand Typography Lockup */}
            <Link
              to="/"
              className="flex flex-col justify-center select-none group focus:outline-hidden"
              aria-label={`${brandNameLine1} ${brandNameLine2} Home`}
            >
              {/* Primary Name Row */}
              <div className="leading-none">
                <span
                  style={{ color: logoNameColor }}
                  className="text-lg sm:text-xl font-black tracking-tight font-heading group-hover:opacity-90 transition-opacity"
                >
                  {brandNameLine1}
                </span>
              </div>

              {/* Subline Row */}
              <div className="mt-1 leading-none">
                <span
                  style={{ color: logoNameColor }}
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase font-heading group-hover:opacity-90 transition-opacity"
                >
                  {brandNameLine2}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 font-semibold text-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.id || link.path}
                  to={link.path}
                  className={`relative whitespace-nowrap px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-900 shadow-xs border border-sky-200/90 font-extrabold'
                      : 'text-slate-700 hover:text-sky-700 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 shadow-2xs transition-all hover:scale-102"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>{ctas.whatsappText || 'WhatsApp Us'}</span>
            </a>
            <Link
              to={ctas.primaryLink || '/contact#inspection-form'}
              className="inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0a4b82] via-[#0284c7] to-[#059669] hover:opacity-95 shadow-md shadow-sky-900/20 transition-all hover:scale-102 group"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger / Quick Call */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="p-2.5 text-sky-700 bg-sky-50 rounded-xl hover:bg-sky-100 border border-sky-100 transition-colors"
              title="Call Us"
              aria-label="Call SLN Engineers"
            >
              <Phone size={17} />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 border border-emerald-100 transition-colors"
              title="WhatsApp Us"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={17} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-5 py-5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                ● Restoration for Three Generations
              </span>
            </div>
            <nav className="flex flex-col gap-1.5 font-semibold text-sm mb-5">
              {navLinks.map((link) => (
                <Link
                  key={link.id || link.path}
                  to={link.path}
                  className={`py-2.5 px-4 rounded-xl transition-all flex items-center justify-between ${
                    location.pathname === link.path
                      ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {location.pathname === link.path && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
              <Link
                to={ctas.primaryLink || '/contact#inspection-form'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full text-sm font-bold justify-center"
              >
                <span>{primaryCtaText}</span> <ArrowRight size={15} />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full text-sm font-bold justify-center"
              >
                <MessageCircle size={16} /> {ctas.whatsappText || 'WhatsApp Senior Engineer'}
              </a>
              <div className="text-center pt-2">
                <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-600 font-medium">
                  Staff &amp; Administrator Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Fixed Header Spacer to prevent document flow overlap */}
      <div
        style={{ height: headerHeight ? `${headerHeight}px` : undefined }}
        className="w-full shrink-0 h-[68px] md:h-[106px] transition-all duration-150"
        aria-hidden="true"
      />

      {/* High-Resolution Logo Preview Modal */}
      {isLogoModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsLogoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="SLN Engineers Logo Preview"
        >
          <div
            className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLogoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close logo preview"
            >
              <X size={20} />
            </button>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Official Company Emblem
            </div>

            {/* Logo Image Showcase */}
            <div className="w-full max-w-xs p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-slate-100 shadow-inner flex items-center justify-center my-2">
              <img
                src={logoUrl}
                alt={`${brandNameLine1} Official Logo`}
                className="w-full h-auto max-h-56 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/sln-logo.png';
                }}
              />
            </div>

            {/* Brand Typography */}
            <h3
              style={{ color: logoNameColor }}
              className="text-xl sm:text-2xl font-black tracking-tight font-heading mt-3"
            >
              {brandNameLine1}
            </h3>
            <p
              style={{ color: logoNameColor }}
              className="text-xs sm:text-sm font-bold uppercase tracking-widest mt-1"
            >
              {brandNameLine2}
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Waterproofing &amp; Structural Restoration Engineering Specialist
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 w-full">
              <a
                href={logoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
              >
                <ExternalLink size={14} />
                <span>Open Full Size</span>
              </a>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
