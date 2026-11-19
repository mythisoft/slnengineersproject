import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Building2,
  Shield,
  ShieldCheck,
  MessageCircle,
  Phone,
  Check,
  X,
  Search,
  FlaskConical,
  HardHat,
  MapPin,
  ChevronRight,
  Layers,
  Sparkles,
  Droplets,
  Paintbrush,
  Wrench,
  ArrowRight,
  ArrowUp,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import { DEFAULT_ABOUT_CONTENT } from '../../utils/aboutData';

const PRINCIPLE_ICON_MAP = {
  Search,
  FlaskConical,
  ShieldCheck,
  HardHat,
  Shield,
  Layers,
  Building2,
  Sparkles,
};

const resolvePrincipleIcon = (name) => {
  return PRINCIPLE_ICON_MAP[name] || Search;
};

export default function AboutUs() {
  const [settings, setSettings] = useState(null);
  const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_CONTENT);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track viewport scroll progress percentage (0 - 100%) and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
        setScrollProgress(progress);
      }
      setShowBackToTop(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchApi('/settings')
      .then((res) => {
        if (res.success) setSettings(res.data);
      })
      .catch((e) => console.error('Failed to load settings:', e));

    fetchApi('/about')
      .then((res) => {
        if (res.success && res.data) {
          setAboutData({ ...DEFAULT_ABOUT_CONTENT, ...res.data });
        }
      })
      .catch((e) => console.warn('Using default about content:', e.message));
  }, []);

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
  }, []);

  const phone = settings?.phone || '+91 8977668776';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="about-page bg-slate-50/70 text-slate-800 antialiased pb-16 relative">
      {/* Scroll Progress Indicator Bar */}
      <div
        className="scroll-progress-indicator"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />
      {/* 1. CINEMATIC HERO SECTION MATCHING MOCKUP */}
      <section className="relative hero-bg-animated bg-gradient-to-r from-[#04203b] via-[#073256] to-[#0a426e] text-white py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-sky-950/40">
        <div className="container max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 xl:col-span-7 text-left scroll-reveal">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-xs animate-pulse-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse shrink-0" />
              <span>{aboutData?.hero?.badge || '4 Core Discipline Pillars • Past, Present & Future Evolution'}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mb-3 text-reveal">
              {aboutData?.hero?.title || 'Civil Engineering Mastery Across 4 Core Discipline Pillars.'}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-sky-200/90 leading-relaxed max-w-xl mb-4 text-reveal delay-100">
              {aboutData?.hero?.description ||
                'Four decades of specialized civil contracting delivering permanent structural defense across four core execution pillars: Waterproofing Solutions, Building Repairs & Restoration, Interior & Exterior Painting, and False Ceiling & Interior Work.'}
            </p>

            {/* 4 Core Pillars Quick Navigation Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-3.5 sm:pt-4 border-t border-sky-500/20 text-[11px] text-sky-200">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mr-1">
                4 Core Pillars:
              </span>
              <Link
                to="/services?discipline=waterproofing"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-sky-950/70 border border-sky-400/30 hover:border-sky-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] sm:text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>Waterproofing</span>
              </Link>
              <Link
                to="/services?discipline=repairs"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-sky-950/70 border border-orange-400/30 hover:border-orange-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] sm:text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                <span>Building Repairs</span>
              </Link>
              <Link
                to="/services?discipline=painting"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-sky-950/70 border border-blue-400/30 hover:border-blue-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] sm:text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span>Painting</span>
              </Link>
              <Link
                to="/services?discipline=false-ceiling"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-sky-950/70 border border-amber-400/30 hover:border-amber-300 hover:text-white transition-all flex items-center gap-1.5 text-[11px] sm:text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>False Ceiling</span>
              </Link>
            </div>
          </div>

          {/* Right Visual: 4 Core Engineering Pillars Interactive Composite */}
          <div className="lg:col-span-5 xl:col-span-5 relative shrink-0 w-full max-w-lg lg:max-w-none mx-auto scroll-reveal-right delay-200">
            <div className="relative rounded-2xl overflow-hidden border border-sky-400/30 shadow-2xl bg-gradient-to-br from-slate-900/90 via-sky-950/90 to-slate-900/95 backdrop-blur-xs card-3d">
              <svg viewBox="0 0 520 320" className="w-full h-auto object-cover" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Background Blueprint Grid */}
                  <pattern id="cadGridHero" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e3558" strokeWidth="0.6" opacity="0.6" />
                  </pattern>

                  {/* Discipline Gradients */}
                  <linearGradient id="wpGradHero" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>

                  <linearGradient id="repairGradHero" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>

                  <linearGradient id="paintGradHero" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>

                  <linearGradient id="coveGlowHero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="centerHubGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0369a1" />
                    <stop offset="100%" stopColor="#0f2847" />
                  </linearGradient>
                </defs>

                {/* Base Blueprint Background */}
                <rect width="520" height="320" fill="#041527" />
                <rect width="520" height="320" fill="url(#cadGridHero)" />

                {/* Dividing Laser Guidelines Connecting 4 Quadrants */}
                <line x1="260" y1="12" x2="260" y2="125" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <line x1="260" y1="195" x2="260" y2="308" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <line x1="12" y1="160" x2="225" y2="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <line x1="295" y1="160" x2="508" y2="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                {/* ============================================================== */}
                {/* 1. TOP-LEFT QUADRANT: WATERPROOFING SOLUTIONS                 */}
                {/* ============================================================== */}
                <g transform="translate(16, 16)">
                  {/* Quadrant Card Background */}
                  <rect width="232" height="132" rx="10" fill="#07203b" fillOpacity="0.6" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Concrete Slab Base */}
                  <rect x="14" y="86" width="204" height="32" rx="3" fill="#1e293b" />
                  <line x1="14" y1="96" x2="218" y2="96" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />

                  {/* Multi-Layer Elastomeric Waterproof Membrane */}
                  <rect x="14" y="78" width="204" height="8" rx="2" fill="url(#wpGradHero)" />
                  <line x1="14" y1="78" x2="218" y2="78" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Parapet Angle Flashing */}
                  <path d="M 14 50 L 26 50 L 26 86 L 14 86 Z" fill="#334155" />
                  <path d="M 26 50 L 32 50 L 32 82 L 26 82 Z" fill="#0284c7" />

                  {/* Water Droplet Deflection Shield */}
                  <g opacity="0.9">
                    {/* Falling Rain Beams Deflecting */}
                    <path d="M 85 45 L 98 74 M 140 42 L 150 74 M 185 46 L 192 74" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Hydrophobic Bouncing Droplets */}
                    <circle cx="100" cy="71" r="3.5" fill="#38bdf8" />
                    <circle cx="152" cy="71" r="3" fill="#38bdf8" />
                    <circle cx="194" cy="71" r="3" fill="#38bdf8" />
                    {/* Splash Arcs */}
                    <path d="M 95 68 Q 100 62 105 68" stroke="#7dd3fc" strokeWidth="1.2" fill="none" />
                    <path d="M 148 68 Q 152 63 157 68" stroke="#7dd3fc" strokeWidth="1.2" fill="none" />
                  </g>

                  {/* Discipline Badge */}
                  <rect x="14" y="14" width="128" height="22" rx="11" fill="#0284c7" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" />
                  <circle cx="25" cy="25" r="4.5" fill="#0284c7" />
                  <text x="36" y="28" fill="#e0f2fe" fontSize="9" fontWeight="900" letterSpacing="0.5">WATERPROOFING</text>
                  <text x="14" y="126" fill="#7dd3fc" fontSize="8" fontWeight="600">Elastomeric Membrane • Zero-Leak Seal</text>
                </g>

                {/* ============================================================== */}
                {/* 2. TOP-RIGHT QUADRANT: FALSE CEILING & INTERIOR WORK           */}
                {/* ============================================================== */}
                <g transform="translate(272, 16)">
                  {/* Quadrant Card Background */}
                  <rect width="232" height="132" rx="10" fill="#201a09" fillOpacity="0.5" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Structural Ceiling Slab */}
                  <rect x="14" y="44" width="204" height="14" rx="2" fill="#1e293b" />

                  {/* Galvanized Suspension Rods */}
                  <line x1="45" y1="58" x2="45" y2="82" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="116" y1="58" x2="116" y2="82" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="187" y1="58" x2="187" y2="82" stroke="#94a3b8" strokeWidth="1.2" />

                  {/* Suspended T-Runner Metal Grid */}
                  <line x1="14" y1="82" x2="218" y2="82" stroke="#cbd5e1" strokeWidth="2" />

                  {/* Gypsum Acoustic Panels */}
                  <rect x="22" y="82" width="46" height="5" rx="1" fill="#f8fafc" />
                  <rect x="74" y="82" width="46" height="5" rx="1" fill="#f8fafc" />
                  <rect x="126" y="82" width="46" height="5" rx="1" fill="#f8fafc" />

                  {/* Indirect LED Cove Trough & Downward Ambient Glow */}
                  <polygon points="178,82 214,82 222,120 170,120" fill="url(#coveGlowHero)" />
                  <rect x="178" y="77" width="38" height="10" rx="2" fill="#d97706" />
                  {/* Warm Spot LEDs */}
                  <circle cx="45" cy="85" r="2.5" fill="#fef08a" />
                  <circle cx="116" cy="85" r="2.5" fill="#fef08a" />
                  <circle cx="197" cy="83" r="3" fill="#fde047" className="animate-pulse" />

                  {/* Discipline Badge */}
                  <rect x="14" y="14" width="124" height="22" rx="11" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1" />
                  <circle cx="25" cy="25" r="4.5" fill="#f59e0b" />
                  <text x="36" y="28" fill="#fef3c7" fontSize="9" fontWeight="900" letterSpacing="0.5">FALSE CEILING</text>
                  <text x="14" y="126" fill="#fde68a" fontSize="8" fontWeight="600">Acoustic Grid • Indirect LED Coves</text>
                </g>

                {/* ============================================================== */}
                {/* 3. BOTTOM-LEFT QUADRANT: BUILDING REPAIRS & RESTORATION       */}
                {/* ============================================================== */}
                <g transform="translate(16, 172)">
                  {/* Quadrant Card Background */}
                  <rect width="232" height="132" rx="10" fill="#2d1206" fillOpacity="0.5" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Reinforced Concrete Column Cross-Section */}
                  <rect x="14" y="44" width="204" height="66" rx="4" fill="#1e293b" />

                  {/* Micro-Concrete Jacketing & Rebar Steel Cage */}
                  <g stroke="#f97316" strokeWidth="2">
                    {/* Vertical Rebar Rods */}
                    <line x1="36" y1="48" x2="36" y2="106" />
                    <line x1="72" y1="48" x2="72" y2="106" />
                    <line x1="108" y1="48" x2="108" y2="106" />
                    {/* Horizontal Lateral Ties / Stirrups */}
                    <line x1="28" y1="60" x2="116" y2="60" strokeWidth="1.2" stroke="#ea580c" />
                    <line x1="28" y1="78" x2="116" y2="78" strokeWidth="1.2" stroke="#ea580c" />
                    <line x1="28" y1="96" x2="116" y2="96" strokeWidth="1.2" stroke="#ea580c" />
                  </g>

                  {/* Structural Shear Crack with Epoxy Injection Port */}
                  <path d="M 148 48 Q 155 74 172 106" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="3 1" />
                  {/* High-Pressure Injection Port Nipple */}
                  <rect x="147" y="68" width="18" height="12" rx="2" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
                  <circle cx="156" cy="74" r="3" fill="#ffffff" />
                  <line x1="165" y1="74" x2="198" y2="74" stroke="#fed7aa" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="174" y="66" fill="#fdba74" fontSize="7" fontWeight="bold">Epoxy Grout</text>

                  {/* Discipline Badge */}
                  <rect x="14" y="14" width="134" height="22" rx="11" fill="#ea580c" fillOpacity="0.25" stroke="#ea580c" strokeWidth="1" />
                  <circle cx="25" cy="25" r="4.5" fill="#ea580c" />
                  <text x="36" y="28" fill="#ffedd5" fontSize="9" fontWeight="900" letterSpacing="0.5">BUILDING REPAIRS</text>
                  <text x="14" y="124" fill="#fed7aa" fontSize="8" fontWeight="600">Rebar Passivation • Epoxy Crack Stitching</text>
                </g>

                {/* ============================================================== */}
                {/* 4. BOTTOM-RIGHT QUADRANT: INTERIOR & EXTERIOR PAINTING        */}
                {/* ============================================================== */}
                <g transform="translate(272, 172)">
                  {/* Quadrant Card Background */}
                  <rect width="232" height="132" rx="10" fill="#08213b" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Wall Substrate & Layered Coatings */}
                  <rect x="14" y="44" width="204" height="66" rx="4" fill="#0f172a" />

                  {/* Layer 1: Primer Substrate */}
                  <rect x="22" y="52" width="60" height="50" fill="#0369a1" opacity="0.6" />
                  <text x="26" y="66" fill="#93c5fd" fontSize="7" fontWeight="bold">Primer</text>

                  {/* Layer 2: Intermediate Crack-Bridging Coat */}
                  <rect x="74" y="52" width="60" height="50" fill="#0284c7" opacity="0.8" />
                  <text x="78" y="66" fill="#bfdbfe" fontSize="7" fontWeight="bold">Undercoat</text>

                  {/* Layer 3: Monsoon Weather-Shield Topcoat */}
                  <rect x="126" y="52" width="84" height="50" rx="2" fill="url(#paintGradHero)" />
                  <text x="132" y="66" fill="#ffffff" fontSize="7" fontWeight="bold">Weather Armor</text>

                  {/* Professional Paint Roller Graphic */}
                  <g transform="translate(138, 62)">
                    {/* Roller Cylinder */}
                    <rect x="0" y="0" width="46" height="18" rx="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="6" y1="9" x2="40" y2="9" stroke="#0284c7" strokeWidth="1.5" />
                    {/* Roller Arm & Handle */}
                    <path d="M 46 9 L 60 9 L 60 36 L 70 36" stroke="#e2e8f0" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <rect x="68" y="32" width="14" height="8" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                  </g>

                  {/* Discipline Badge */}
                  <rect x="14" y="14" width="138" height="22" rx="11" fill="#2563eb" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="25" cy="25" r="4.5" fill="#38bdf8" />
                  <text x="36" y="28" fill="#e0f2fe" fontSize="9" fontWeight="900" letterSpacing="0.5">PAINTING FINISHES</text>
                  <text x="14" y="124" fill="#bae6fd" fontSize="8" fontWeight="600">Anti-Carbonation • Monsoon Weather Shield</text>
                </g>

                {/* ============================================================== */}
                {/* CENTRAL HUB: TOTAL BUILDING ENGINEERING EMBLEM                */}
                {/* ============================================================== */}
                <g transform="translate(260, 160)">
                  {/* Outer Pulsing Aura Ring */}
                  <circle cx="0" cy="0" r="32" fill="#072340" stroke="#38bdf8" strokeWidth="2" className="drop-shadow-lg" />
                  <circle cx="0" cy="0" r="26" fill="url(#centerHubGrad)" stroke="#0ea5e9" strokeWidth="1" />
                  <circle cx="0" cy="0" r="22" fill="#031d38" />

                  {/* Center Emblem Texts */}
                  <text x="0" y="-4" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="900" letterSpacing="1">
                    SLN
                  </text>
                  <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" letterSpacing="0.5">
                    4 PILLARS
                  </text>
                  <text x="0" y="17" textAnchor="middle" fill="#94a3b8" fontSize="5" fontWeight="semibold">
                    ENGINEERED
                  </text>
                </g>
              </svg>

              {/* Top Banner Tag */}
              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 max-w-[calc(100%-1.25rem)] sm:max-w-[calc(100%-1.5rem)] bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-sky-400/40 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-white shadow-lg truncate">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-sky-200 truncate">4 Core Civil Engineering Pillars Under One Roof</span>
              </div>

              {/* Bottom Interactive Mini-Strip Linking Directly to Each Pillar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-800 bg-slate-950/90 border-t border-slate-800 text-[10px] sm:text-[11px] font-bold">
                <Link
                  to="/services?discipline=waterproofing"
                  className="px-2 sm:px-2.5 py-2 text-center text-sky-400 hover:bg-sky-950/60 hover:text-sky-300 transition-colors flex items-center justify-center gap-1 border-b sm:border-b-0 border-slate-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span className="truncate">Waterproofing</span>
                </Link>
                <Link
                  to="/services?discipline=repairs"
                  className="px-2 sm:px-2.5 py-2 text-center text-orange-400 hover:bg-orange-950/60 hover:text-orange-300 transition-colors flex items-center justify-center gap-1 border-b sm:border-b-0 border-slate-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  <span className="truncate">Repairs</span>
                </Link>
                <Link
                  to="/services?discipline=painting"
                  className="px-2 sm:px-2.5 py-2 text-center text-blue-400 hover:bg-blue-950/60 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="truncate">Painting</span>
                </Link>
                <Link
                  to="/services?discipline=false-ceiling"
                  className="px-2 sm:px-2.5 py-2 text-center text-amber-400 hover:bg-amber-950/60 hover:text-amber-300 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">False Ceiling</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 HERO TRUST METRIC TILES MATCHING MOCKUP */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-7 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-3 sm:p-5 particle-bg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-0 [&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-r-0 [&:nth-child(1)]:border-b [&:nth-child(2)]:border-b sm:[&:nth-child(1)]:border-b-0 sm:[&:nth-child(2)]:border-b-0 border-slate-100 sm:border-0 lg:divide-x lg:divide-slate-200/80 items-center">
            {/* Tile 1 — 40+ Years Continuous Practice */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 px-1.5 sm:px-3 lg:px-2 xl:px-4 trust-metric-card scroll-reveal-pop stagger-1 hover:-translate-y-1.5 hover:shadow-lg rounded-xl p-2 sm:p-2.5 transition-all duration-300 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-xs icon-bounce group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Calendar size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-700 transition-colors tracking-tight leading-none mb-0.5 sm:mb-1">
                  {aboutData?.trustMetrics?.[0]?.value || '40+'}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate sm:whitespace-normal">
                  {aboutData?.trustMetrics?.[0]?.label || 'Years Continuous Practice'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{aboutData?.trustMetrics?.[0]?.sub || 'Founded in 1984'}</div>
              </div>
            </div>

            {/* Tile 2 — 3 Generations of Engineering Evolution */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 px-1.5 sm:px-3 lg:px-2 xl:px-4 trust-metric-card scroll-reveal-pop stagger-2 hover:-translate-y-1.5 hover:shadow-lg rounded-xl p-2 sm:p-2.5 transition-all duration-300 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0891b2] text-white flex items-center justify-center shrink-0 shadow-xs icon-bounce group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Layers size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-cyan-700 transition-colors tracking-tight leading-none mb-0.5 sm:mb-1">
                  {aboutData?.trustMetrics?.[1]?.value || '3'}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate sm:whitespace-normal">
                  {aboutData?.trustMetrics?.[1]?.label || 'Engineering Generations'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{aboutData?.trustMetrics?.[1]?.sub || 'Past • Present • Future'}</div>
              </div>
            </div>

            {/* Tile 3 — 1,450+ Projects Successfully Sealed */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 px-1.5 sm:px-3 lg:px-2 xl:px-4 trust-metric-card scroll-reveal-pop stagger-3 hover:-translate-y-1.5 hover:shadow-lg rounded-xl p-2 sm:p-2.5 transition-all duration-300 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0369a1] text-white flex items-center justify-center shrink-0 shadow-xs icon-bounce group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Building2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-800 transition-colors tracking-tight leading-none mb-0.5 sm:mb-1">
                  {aboutData?.trustMetrics?.[2]?.value || '1,450+'}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate sm:whitespace-normal">
                  {aboutData?.trustMetrics?.[2]?.label || 'Projects Successfully Sealed'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{aboutData?.trustMetrics?.[2]?.sub || 'Zero Hydrostatic Failures'}</div>
              </div>
            </div>

            {/* Tile 4 — 100% In-House Direct Oversight */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 px-1.5 sm:px-3 lg:px-2 xl:px-4 trust-metric-card scroll-reveal-pop stagger-4 hover:-translate-y-1.5 hover:shadow-lg rounded-xl p-2 sm:p-2.5 transition-all duration-300 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0891b2] text-white flex items-center justify-center shrink-0 shadow-xs icon-bounce group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <ShieldCheck size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-cyan-700 transition-colors tracking-tight leading-none mb-0.5 sm:mb-1">
                  {aboutData?.trustMetrics?.[3]?.value || '100%'}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate sm:whitespace-normal">
                  {aboutData?.trustMetrics?.[3]?.label || 'In-House Execution'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{aboutData?.trustMetrics?.[3]?.sub || 'Licensed Civil Engineers'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE THREE-GENERATION ENGINEERING ROADMAP (PAST, PRESENT, FUTURE) */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-14">
        <div className="scroll-reveal">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0891b2] block mb-1">
            Engineering Evolution
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f2847] tracking-tight">
            {aboutData?.generationsRoadmap?.sectionTitle || DEFAULT_ABOUT_CONTENT.generationsRoadmap.sectionTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6 max-w-2xl leading-relaxed">
            {aboutData?.generationsRoadmap?.sectionSubtitle || DEFAULT_ABOUT_CONTENT.generationsRoadmap.sectionSubtitle}
          </p>
        </div>

        {/* Desktop Interactive Timeline Track */}
        <div className="hidden lg:block relative mb-8 px-10 scroll-reveal">
          <div className="absolute top-1/2 left-16 right-16 h-1 -translate-y-1/2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-[#0284c7] via-[#0891b2] to-[#10b981] opacity-75" />
          </div>
          <div className="relative flex justify-between items-center">
            {/* Step 1 Node — Past */}
            <div className="flex flex-col items-center group cursor-default">
              <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-black text-xs shadow-md border-4 border-white transition-transform group-hover:scale-120 duration-300">
                1
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2 bg-white px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200/60">
                {aboutData?.generationsRoadmap?.cards?.[0]?.era || 'Past'} — {aboutData?.generationsRoadmap?.cards?.[0]?.subtitle || 'Classical Craft across 4 Pillars'}
              </span>
            </div>
            {/* Step 2 Node — Present */}
            <div className="flex flex-col items-center group cursor-default">
              <div className="w-9 h-9 rounded-full bg-[#0891b2] text-white flex items-center justify-center font-black text-xs shadow-md border-4 border-white transition-transform group-hover:scale-120 duration-300">
                2
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2 bg-white px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200/60">
                {aboutData?.generationsRoadmap?.cards?.[1]?.era || 'Present'} — {aboutData?.generationsRoadmap?.cards?.[1]?.subtitle || 'Advanced Polymers & Systems'}
              </span>
            </div>
            {/* Step 3 Node — Future */}
            <div className="flex flex-col items-center group cursor-default">
              <div className="w-9 h-9 rounded-full bg-[#10b981] text-white flex items-center justify-center font-black text-xs shadow-md border-4 border-white transition-transform group-hover:scale-120 duration-300">
                3
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2 bg-white px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200/60">
                {aboutData?.generationsRoadmap?.cards?.[2]?.era || 'Future'} — {aboutData?.generationsRoadmap?.cards?.[2]?.subtitle || 'Smart Chemistry & Modular Tech'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Milestone Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
          {/* Card 1 — 1st Generation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 hover:-translate-y-1.5 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative overflow-hidden scroll-reveal-left stagger-1">
            <div>
              {/* Heritage Estate Vector Visual */}
              <div className="h-28 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 relative bg-amber-50">
                <svg viewBox="0 0 240 110" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
                  <rect width="240" height="110" fill="#fef3c7" />
                  <path d="M 0 85 L 240 85" stroke="#d97706" strokeWidth="2" />
                  {/* Heritage Palace / Bungalow facade */}
                  <rect x="30" y="30" width="180" height="60" fill="#d97706" opacity="0.3" rx="2" />
                  <rect x="40" y="20" width="40" height="70" fill="#b45309" opacity="0.5" />
                  <rect x="160" y="20" width="40" height="70" fill="#b45309" opacity="0.5" />
                  <rect x="95" y="15" width="50" height="75" fill="#92400e" opacity="0.6" />
                  {/* Classical Dome */}
                  <path d="M 100 15 C 100 -5, 140 -5, 140 15 Z" fill="#b45309" opacity="0.7" />
                  {/* Arch Windows */}
                  <g fill="#78350f" opacity="0.5">
                    <rect x="48" y="35" width="10" height="15" rx="5" />
                    <rect x="62" y="35" width="10" height="15" rx="5" />
                    <rect x="168" y="35" width="10" height="15" rx="5" />
                    <rect x="182" y="35" width="10" height="15" rx="5" />
                    <rect x="105" y="30" width="12" height="20" rx="6" />
                    <rect x="123" y="30" width="12" height="20" rx="6" />
                  </g>
                </svg>
              </div>

              {/* Period Pill */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0284c7] group-hover:bg-sky-600 text-white inline-block mb-2 shadow-2xs transition-colors duration-200">
                {aboutData?.generationsRoadmap?.cards?.[0]?.pill || 'Past Era • Classical Foundation'}
              </span>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#0891b2] group-hover:bg-[#0284c7] group-hover:scale-110 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs transition-all duration-300">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f2847] leading-tight">
                    {aboutData?.generationsRoadmap?.cards?.[0]?.era || 'Past Generation'}
                  </h3>
                  <div className="text-[11px] font-bold text-[#0891b2]">
                    {aboutData?.generationsRoadmap?.cards?.[0]?.subtitle || 'Foundational Craft across All 4 Pillars'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {aboutData?.generationsRoadmap?.cards?.[0]?.description ||
                  DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards[0].description}
              </p>
            </div>

            {/* Checkpoints — All 4 Pillars */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
              {(aboutData?.generationsRoadmap?.cards?.[0]?.checkpoints || DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards[0].checkpoints).map((cp, idx) => (
                <div key={idx} className="flex items-start gap-2 group/check hover:translate-x-1 transition-transform duration-200">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5 group-hover/check:scale-115 transition-transform" />
                  <span>{cp.pillar ? `${cp.pillar}: ` : ''}{cp.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — Present Generation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 hover:-translate-y-1.5 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative overflow-hidden scroll-reveal-pop stagger-2">
            <div>
              {/* IT Corridor Commercial Towers Visual */}
              <div className="h-28 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 relative bg-sky-50">
                <svg viewBox="0 0 240 110" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
                  <rect width="240" height="110" fill="#e0f2fe" />
                  <path d="M 0 95 L 240 95" stroke="#0284c7" strokeWidth="2" />
                  {/* High-Rise Towers */}
                  <rect x="25" y="15" width="45" height="85" fill="#0369a1" opacity="0.6" rx="2" />
                  <rect x="80" y="8" width="55" height="92" fill="#0284c7" opacity="0.7" rx="2" />
                  <rect x="145" y="25" width="45" height="75" fill="#0ea5e9" opacity="0.5" rx="2" />
                  <rect x="195" y="40" width="30" height="60" fill="#38bdf8" opacity="0.4" rx="2" />
                  {/* Window Grid */}
                  <g fill="#ffffff" opacity="0.6">
                    <rect x="30" y="25" width="8" height="6" />
                    <rect x="42" y="25" width="8" height="6" />
                    <rect x="54" y="25" width="8" height="6" />
                    <rect x="88" y="20" width="9" height="7" />
                    <rect x="103" y="20" width="9" height="7" />
                    <rect x="118" y="20" width="9" height="7" />
                    <rect x="88" y="35" width="9" height="7" />
                    <rect x="103" y="35" width="9" height="7" />
                    <rect x="118" y="35" width="9" height="7" />
                    <rect x="152" y="35" width="8" height="6" />
                    <rect x="165" y="35" width="8" height="6" />
                    <rect x="178" y="35" width="8" height="6" />
                  </g>
                </svg>
              </div>

              {/* Period Pill */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0284c7] group-hover:bg-sky-600 text-white inline-block mb-2 shadow-2xs transition-colors duration-200">
                {aboutData?.generationsRoadmap?.cards?.[1]?.pill || 'Present Era • Industrial Polymers'}
              </span>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#0891b2] group-hover:bg-[#0284c7] group-hover:scale-110 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs transition-all duration-300">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f2847] leading-tight">
                    {aboutData?.generationsRoadmap?.cards?.[1]?.era || 'Present Generation'}
                  </h3>
                  <div className="text-[11px] font-bold text-[#0891b2]">
                    {aboutData?.generationsRoadmap?.cards?.[1]?.subtitle || 'Engineered Precision across All 4 Pillars'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {aboutData?.generationsRoadmap?.cards?.[1]?.description ||
                  DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards[1].description}
              </p>
            </div>

            {/* Checkpoints — All 4 Pillars */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
              {(aboutData?.generationsRoadmap?.cards?.[1]?.checkpoints || DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards[1].checkpoints).map((cp, idx) => (
                <div key={idx} className="flex items-start gap-2 group/check hover:translate-x-1 transition-transform duration-200">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5 group-hover/check:scale-115 transition-transform" />
                  <span>{cp.pillar ? `${cp.pillar}: ` : ''}{cp.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — Future Generation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-sky-300 hover:-translate-y-1.5 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer relative overflow-hidden scroll-reveal-right stagger-3">
            <div>
              {/* Precision Moisture Scanning & Nano Tech Visual */}
              <div className="h-28 w-full rounded-xl overflow-hidden mb-3 border border-slate-200 relative bg-emerald-50">
                <svg viewBox="0 0 240 110" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
                  <rect width="240" height="110" fill="#ecfdf5" />
                  <path d="M 0 95 L 240 95" stroke="#10b981" strokeWidth="2" />
                  {/* Digital HUD Grid */}
                  <g stroke="#34d399" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3">
                    <line x1="20" y1="20" x2="220" y2="20" />
                    <line x1="20" y1="50" x2="220" y2="50" />
                    <line x1="20" y1="80" x2="220" y2="80" />
                    <line x1="60" y1="10" x2="60" y2="95" />
                    <line x1="120" y1="10" x2="120" y2="95" />
                    <line x1="180" y1="10" x2="180" y2="95" />
                  </g>
                  {/* Digital Moisture Scanner Device */}
                  <rect x="75" y="25" width="90" height="55" rx="6" fill="#0f172a" />
                  <rect x="85" y="33" width="70" height="38" rx="3" fill="#064e3b" />
                  <circle cx="120" cy="52" r="14" fill="#ef4444" opacity="0.85" />
                  <circle cx="120" cy="52" r="8" fill="#facc15" opacity="0.9" />
                  <text x="120" y="68" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">MOISTURE SCAN</text>
                </svg>
              </div>

              {/* Period Pill */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0284c7] group-hover:bg-sky-600 text-white inline-block mb-2 shadow-2xs transition-colors duration-200">
                {aboutData?.generationsRoadmap?.cards?.[2]?.pill || 'Future Era • Smart Nano Chemistry'}
              </span>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#0891b2] group-hover:bg-[#0284c7] group-hover:scale-110 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs transition-all duration-300">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f2847] leading-tight">
                    {aboutData?.generationsRoadmap?.cards?.[2]?.era || 'Future Generation'}
                  </h3>
                  <div className="text-[11px] font-bold text-[#0891b2]">
                    {aboutData?.generationsRoadmap?.cards?.[2]?.subtitle || 'Next-Gen Science across All 4 Pillars'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {aboutData?.generationsRoadmap?.cards?.[2]?.description ||
                  DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards[2].description}
              </p>
            </div>

            {/* Checkpoints — All 4 Pillars */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
              {(aboutData?.generationsRoadmap?.cards?.[2]?.checkpoints || DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards[2].checkpoints).map((cp, idx) => (
                <div key={idx} className="flex items-start gap-2 group/check hover:translate-x-1 transition-transform duration-200">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5 group-hover/check:scale-115 transition-transform" />
                  <span>{cp.pillar ? `${cp.pillar}: ` : ''}{cp.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CONVENTIONAL REPAIR FAILS — AND HOW SLN SUCCEEDS ACROSS ALL PILLARS */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-16">
        <div className="scroll-reveal">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0891b2] block mb-1">
            The SLN Difference
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f2847] tracking-tight">
            {aboutData?.slnDifference?.sectionTitle || DEFAULT_ABOUT_CONTENT.slnDifference.sectionTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6 max-w-2xl leading-relaxed">
            {aboutData?.slnDifference?.sectionSubtitle || DEFAULT_ABOUT_CONTENT.slnDifference.sectionSubtitle}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: The Cosmetic Contractor Approach */}
          <div className="bg-white rounded-xl border border-rose-200/90 shadow-2xs hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-300 hover:-translate-y-1.5 transition-all duration-300 group p-5 sm:p-6 flex flex-col justify-between scroll-reveal-left delay-100">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-rose-100">
                <div className="w-6 h-6 rounded-full bg-[#e11d48] group-hover:bg-rose-700 group-hover:scale-110 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-all duration-300">
                  <X size={14} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#e11d48]">
                    {aboutData?.slnDifference?.contractorApproach?.title || DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.title}
                  </h3>
                  <div className="text-[11px] font-bold text-slate-400">
                    {aboutData?.slnDifference?.contractorApproach?.subtitle || DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.subtitle}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-4">
                {/* Failure Points Across Disciplines */}
                <div className="sm:col-span-8 space-y-2 text-xs text-slate-600">
                  {(aboutData?.slnDifference?.contractorApproach?.points || DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.points).map((pt, idx) => (
                    <div key={idx} className="group/point p-1.5 -mx-1.5 rounded-lg hover:bg-rose-50/70 transition-colors duration-200">
                      <strong className="block text-slate-900 font-bold flex items-start gap-1.5">
                        <X size={13} className="text-rose-500 shrink-0 mt-0.5 group-hover/point:scale-125 transition-transform duration-200" />
                        <span>{pt.title}</span>
                      </strong>
                      <p className="text-[11px] text-slate-500 leading-snug pl-5 mt-0.5">
                        {pt.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Multi-Pillar Failure Graphic */}
                <div className="sm:col-span-4 w-full">
                  <div className="rounded-lg overflow-hidden border border-rose-200 aspect-[16/9] sm:aspect-[4/3] max-w-xs sm:max-w-none mx-auto bg-amber-50/80 relative flex items-center justify-center shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                    <svg viewBox="0 0 160 120" className="w-full h-full object-cover">
                      <rect width="160" height="120" fill="#fef2f2" />

                      {/* 1. Cracked Roof Slab with Ponding Water (Waterproofing Failure) */}
                      <rect x="0" y="0" width="160" height="26" fill="#cbd5e1" />
                      <path d="M 0 6 L 160 6" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />
                      <path d="M 40 6 Q 50 14 65 6 Q 80 18 100 6" fill="#7f1d1d" opacity="0.3" />

                      {/* Water Leaking Through Saturated Masonry */}
                      <line x1="65" y1="26" x2="65" y2="65" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                      <line x1="120" y1="26" x2="120" y2="85" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

                      {/* 2. Concrete Column with Corroding Rebar & Spalling (Repairs Failure) */}
                      <rect x="15" y="26" width="35" height="94" fill="#64748b" />
                      {/* Corroded Rebar exposed */}
                      <line x1="24" y1="45" x2="24" y2="90" stroke="#b45309" strokeWidth="3" />
                      <line x1="32" y1="50" x2="32" y2="85" stroke="#b45309" strokeWidth="2.5" />
                      {/* Spalling Concrete Crack Breakage */}
                      <path d="M 15 50 Q 28 65 15 85" stroke="#dc2626" strokeWidth="2" fill="none" />
                      <rect x="10" y="60" width="8" height="12" fill="#ef4444" opacity="0.7" rx="1" />

                      {/* 3. Sagging, Stained False Ceiling (False Ceiling Failure) */}
                      <path d="M 50 48 Q 95 62 145 48" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
                      {/* Water stain ring on ceiling */}
                      <ellipse cx="95" cy="54" rx="20" ry="7" fill="#78350f" opacity="0.4" />
                      {/* Ceiling water drip */}
                      <circle cx="95" cy="65" r="2.5" fill="#0284c7" />

                      {/* 4. Blistering & Peeling Exterior Paint (Painting Failure) */}
                      <rect x="135" y="48" width="25" height="72" fill="#991b1b" opacity="0.3" />
                      <path d="M 135 60 C 145 60 148 70 140 75 C 148 80 145 92 135 90" stroke="#f43f5e" strokeWidth="2" fill="#fecdd3" />
                      <path d="M 145 75 L 155 85" stroke="#e11d48" strokeWidth="1.5" />

                      {/* Bottom Banner */}
                      <rect x="0" y="104" width="160" height="16" fill="#fee2e2" />
                      <text x="80" y="115" textAnchor="middle" fill="#dc2626" fontSize="7" fontWeight="bold">
                        Multi-Pillar Failure &amp; Decay
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome Banner */}
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 group-hover:bg-rose-100/70 flex items-center gap-2 text-xs text-rose-800 transition-colors duration-200">
              <X size={14} className="text-rose-600 shrink-0 font-bold" />
              <span>
                <strong>Outcome:</strong> {aboutData?.slnDifference?.contractorApproach?.outcome || DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.outcome}
              </span>
            </div>
          </div>

          {/* Right Card: SLN 4-Pillar Engineered Standard */}
          <div className="bg-white rounded-xl border border-teal-200/90 shadow-2xs hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-300 hover:-translate-y-1.5 transition-all duration-300 group p-5 sm:p-6 flex flex-col justify-between scroll-reveal-right delay-200">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-teal-100">
                <div className="w-6 h-6 rounded-full bg-[#0891b2] group-hover:bg-[#0e7490] group-hover:scale-110 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-all duration-300">
                  <Check size={14} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0f2847]">
                    {aboutData?.slnDifference?.slnStandard?.title || DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.title}
                  </h3>
                  <div className="text-[11px] font-bold text-teal-600">
                    {aboutData?.slnDifference?.slnStandard?.subtitle || DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.subtitle}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-4">
                {/* Success Points Across Disciplines */}
                <div className="sm:col-span-8 space-y-2 text-xs text-slate-600">
                  {(aboutData?.slnDifference?.slnStandard?.points || DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.points).map((pt, idx) => (
                    <div key={idx} className="group/point p-1.5 -mx-1.5 rounded-lg hover:bg-teal-50/70 transition-colors duration-200">
                      <strong className="block text-slate-900 font-bold flex items-start gap-1.5">
                        <Check size={13} className="text-teal-600 shrink-0 mt-0.5 group-hover/point:scale-125 transition-transform duration-200" />
                        <span>{pt.title}</span>
                      </strong>
                      <p className="text-[11px] text-slate-500 leading-snug pl-5 mt-0.5">
                        {pt.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Multi-Pillar Engineered Protection Graphic */}
                <div className="sm:col-span-4 w-full">
                  <div className="rounded-lg overflow-hidden border border-teal-200 aspect-[16/9] sm:aspect-[4/3] max-w-xs sm:max-w-none mx-auto bg-sky-950 relative flex items-center justify-center shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                    <svg viewBox="0 0 160 120" className="w-full h-full object-cover">
                      <rect width="160" height="120" fill="#031d38" />

                      {/* 1. Monolithic Waterproofing Barrier (Waterproofing Success) */}
                      <rect x="0" y="0" width="160" height="24" fill="#1e293b" />
                      <rect x="0" y="20" width="160" height="5" fill="#0284c7" />
                      <line x1="0" y1="20" x2="160" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
                      {/* Deflected Rain Droplets */}
                      <circle cx="45" cy="14" r="2.5" fill="#38bdf8" />
                      <circle cx="85" cy="14" r="2" fill="#38bdf8" />
                      <circle cx="125" cy="14" r="2.5" fill="#38bdf8" />
                      <path d="M 40 12 Q 45 8 50 12" stroke="#7dd3fc" strokeWidth="1" fill="none" />

                      {/* 2. Reinforced Concrete Column with Passivated Rebar (Repairs Success) */}
                      <rect x="15" y="25" width="35" height="95" fill="#0f172a" />
                      {/* Passivated Rebar Cage */}
                      <line x1="24" y1="30" x2="24" y2="100" stroke="#f97316" strokeWidth="2.5" />
                      <line x1="34" y1="30" x2="34" y2="100" stroke="#f97316" strokeWidth="2.5" />
                      <line x1="18" y1="45" x2="40" y2="45" stroke="#ea580c" strokeWidth="1" />
                      <line x1="18" y1="65" x2="40" y2="65" stroke="#ea580c" strokeWidth="1" />
                      <line x1="18" y1="85" x2="40" y2="85" stroke="#ea580c" strokeWidth="1" />
                      {/* Epoxy sealed crack */}
                      <line x1="28" y1="52" x2="28" y2="78" stroke="#10b981" strokeWidth="1.5" />

                      {/* 3. Level Galvanized Acoustic False Ceiling with LED Glow (False Ceiling Success) */}
                      <line x1="50" y1="50" x2="145" y2="50" stroke="#cbd5e1" strokeWidth="2" />
                      <rect x="60" y="50" width="35" height="4" fill="#f8fafc" />
                      <rect x="100" y="50" width="40" height="4" fill="#f8fafc" />
                      {/* Indirect Cove Glow */}
                      <polygon points="100,54 140,54 145,80 95,80" fill="#fbbf24" fillOpacity="0.25" />
                      <circle cx="120" cy="52" r="2" fill="#fef08a" />

                      {/* 4. Weather-Shield Painted Exterior Wall (Painting Success) */}
                      <rect x="135" y="50" width="25" height="70" fill="#0369a1" />
                      <rect x="137" y="50" width="23" height="70" fill="#0ea5e9" opacity="0.9" />
                      <line x1="137" y1="50" x2="137" y2="120" stroke="#38bdf8" strokeWidth="1.5" />

                      {/* Central Engineering Shield */}
                      <circle cx="85" cy="78" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                      <path d="M 80 78 L 84 82 L 91 74" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Bottom Banner */}
                      <rect x="0" y="104" width="160" height="16" fill="#064e3b" />
                      <text x="80" y="115" textAnchor="middle" fill="#34d399" fontSize="7" fontWeight="bold">
                        Unified 4-Pillar Engineering
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome Banner */}
            <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 group-hover:bg-teal-100/70 flex items-center gap-2 text-xs text-teal-800 transition-colors duration-200">
              <Check size={14} className="text-teal-600 shrink-0 font-bold" />
              <span>
                <strong>Outcome:</strong> {aboutData?.slnDifference?.slnStandard?.outcome || DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.outcome}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE PRINCIPLES GUIDING EVERY PROJECT */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-16">
        <div className="scroll-reveal">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0891b2] block mb-1">
            Our Code of Practice
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f2847] tracking-tight">
            Core Principles Guiding Every Project
          </h2>
        </div>

        {/* 4 Principle Cards in 1 Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {(aboutData?.principles || DEFAULT_ABOUT_CONTENT.principles).map((pr, idx) => {
            const IconComponent = resolvePrincipleIcon(pr.icon || (idx === 0 ? 'Search' : idx === 1 ? 'FlaskConical' : idx === 2 ? 'ShieldCheck' : 'HardHat'));
            return (
              <div
                key={idx}
                className={`relative bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 hover:shadow-xl hover:border-sky-300 hover:-translate-y-2 transition-all duration-300 group overflow-hidden scroll-reveal-blur stagger-${idx + 1}`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div
                  style={{ backgroundColor: pr.color || (idx === 0 ? '#0284c7' : idx === 1 ? '#0891b2' : idx === 2 ? '#0284c7' : '#0f172a') }}
                  className="w-11 h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                >
                  <IconComponent size={19} />
                </div>
                <h3 className="text-sm font-extrabold text-[#0f2847] group-hover:text-[#0284c7] transition-colors duration-200 mb-1.5">
                  {pr.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {pr.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. READY FOR PERMANENT ZERO-LEAK PROTECTION? (BOTTOM BANNER) */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="rounded-2xl overflow-hidden hero-bg-animated bg-gradient-to-r from-[#031d36] via-[#073256] to-[#031d36] text-white border border-slate-800 shadow-xl scroll-reveal-scale delay-100">
          {/* Main Banner Content */}
          <div className="p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative">
            {/* Left Info */}
            <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4 max-w-xl text-center sm:text-left">
              {/* Shield Droplet Emblem */}
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0 mx-auto sm:mx-0 mt-0.5 shadow-inner animate-float">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {aboutData?.ctaBanner?.title || DEFAULT_ABOUT_CONTENT.ctaBanner.title}
                </h3>
                <div className="text-xs font-bold text-sky-300 mt-1">
                  {aboutData?.ctaBanner?.subtitle || DEFAULT_ABOUT_CONTENT.ctaBanner.subtitle}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {aboutData?.ctaBanner?.description || DEFAULT_ABOUT_CONTENT.ctaBanner.description}
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto justify-start lg:justify-end">
              <Link
                to="/contact#inspection-form"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-[#06b6d4] hover:bg-[#0891b2] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25 active:translate-y-0 shadow-sm transition-all duration-200 group btn-ripple w-full sm:w-auto cursor-pointer"
              >
                <Calendar size={13} className="group-hover:rotate-6 transition-transform duration-200 shrink-0" />
                <span>Schedule Site View</span>
              </Link>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-slate-900/60 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500 active:translate-y-0 border border-slate-700 shadow-sm transition-all duration-200 group btn-ripple w-full sm:w-auto"
              >
                <Phone size={13} className="group-hover:scale-115 transition-transform duration-200 shrink-0" />
                <span>Call {phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-[#22c55e] hover:bg-[#16a34a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 active:translate-y-0 shadow-sm transition-all duration-200 group btn-ripple w-full sm:w-auto"
              >
                <MessageCircle size={13} className="group-hover:scale-115 transition-transform duration-200 shrink-0" />
                <span>WhatsApp Senior Engineer</span>
              </a>
            </div>
          </div>

          {/* Bottom Footer Strip inside Banner */}
          <div className="bg-[#021324] py-2.5 px-4 sm:px-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-slate-400 font-medium text-center flex-wrap sm:flex-nowrap">
            <MapPin size={12} className="text-sky-400 animate-pulse shrink-0" />
            <span>Headquartered in Medipally, Hyderabad • Serving Telangana • 40+ Years of Engineering Evolution</span>
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
        } hover:scale-110 active:scale-95`}
        title="Scroll to Top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
