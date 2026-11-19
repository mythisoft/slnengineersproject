import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Droplets,
  Paintbrush,
  Layers,
  Wrench,
  Users,
  Search,
  X,
  MapPin,
  Calendar,
  User,
  FlaskConical,
  ExternalLink,
  MessageCircle,
  FileText,
  Shield,
  ArrowRight,
  Phone,
  Check,
  Star,
  Grid,
  Filter,
  CheckCircle2,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  CORE_DISCIPLINES,
  DEFAULT_DISCIPLINES,
  DEFAULT_SERVICES,
  DEFAULT_PROJECTS_HERO,
  renderDisciplineIcon,
  matchesDiscipline,
} from '../../utils/servicesData';
import {
  DEFAULT_PROJECTS,
  normalizeProject,
  matchesProjectDiscipline,
  matchesProjectService,
} from '../../utils/projectsData';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';

export default function Portfolio() {
  const [settings, setSettings] = useState(null);
  const [disciplines, setDisciplines] = useState(DEFAULT_DISCIPLINES);
  const [services, setServices] = useState(DEFAULT_SERVICES);

  const [heroContent, setHeroContent] = useState(DEFAULT_PROJECTS_HERO);

  // Projects State from MongoDB API
  const [projects, setProjects] = useState(() =>
    DEFAULT_PROJECTS.map((p, idx) => normalizeProject(p, idx))
  );

  // Filters State
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Prevent background scroll when Case Study Modal is open on mobile/desktop
  useEffect(() => {
    if (activeModalProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalProject]);

  // Load Settings, Disciplines, Services, and Projects
  useEffect(() => {
    // 1. Settings & Page Header Content
    fetchApi('/settings')
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
          if (res.data.projectsPageContent && Object.keys(res.data.projectsPageContent).length > 0) {
            setHeroContent((prev) => ({ ...DEFAULT_PROJECTS_HERO, ...prev, ...res.data.projectsPageContent }));
          }
        }
      })
      .catch((e) => console.error('Failed to load settings:', e));

    // 2. Disciplines
    fetchApi('/disciplines')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDisciplines(res.data);
        }
      })
      .catch(() => {});

    // 3. Services
    fetchApi('/services')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch(() => {});

    // 4. Projects Dynamic Load from MongoDB
    const loadProjects = () => {
      fetchApi('/projects?limit=100')
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const apiProjects = res.data.map((p, idx) => normalizeProject(p, idx));
            const finalProjects = [...apiProjects];

            // Ensure default verified projects across all disciplines are present
            DEFAULT_PROJECTS.forEach((def) => {
              const exists = finalProjects.some(
                (p) => p.slug === def.slug || (p.title && p.title.toLowerCase() === def.title.toLowerCase())
              );
              if (!exists) {
                finalProjects.push(normalizeProject(def, finalProjects.length));
              }
            });

            setProjects(finalProjects);
          }
        })
        .catch((e) => console.error('Projects fetch error:', e));
    };

    loadProjects();

    window.addEventListener('sln_projects_updated', loadProjects);
    window.addEventListener('focus', loadProjects);

    return () => {
      window.removeEventListener('sln_projects_updated', loadProjects);
      window.removeEventListener('focus', loadProjects);
    };
  }, []);

  // Sync active filters from URL query parameter (e.g. /projects?discipline=waterproofing or /projects?service=terrace)
  useEffect(() => {
    const disciplineParam = searchParams.get('discipline');
    const serviceParam = searchParams.get('service') || searchParams.get('category');

    if (disciplineParam) {
      setSelectedDiscipline(disciplineParam.toLowerCase().trim());
    }
    if (serviceParam) {
      setSelectedService(serviceParam.trim());
    }
  }, [searchParams]);

  // Only published projects are visible on public portfolio
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.isPublished);
  }, [projects]);

  // Active Disciplines with 'All Specializations'
  const allFilterPillars = useMemo(() => {
    return [
      {
        id: 'all',
        slug: 'all',
        name: 'All Specializations',
        shortCategory: 'All Civil Disciplines',
        icon: 'Grid',
        accentColor: '#0284c7',
      },
      ...disciplines,
    ];
  }, [disciplines]);

  // Available Services for the selected discipline
  const availableServicesForDiscipline = useMemo(() => {
    if (!selectedDiscipline || selectedDiscipline === 'all') {
      return services.length > 0 ? services : DEFAULT_SERVICES;
    }
    const filtered = services.filter((s) => matchesDiscipline(s, selectedDiscipline));
    if (filtered.length > 0) return filtered;

    const defFiltered = DEFAULT_SERVICES.filter((s) => matchesDiscipline(s, selectedDiscipline));
    return defFiltered.length > 0 ? defFiltered : [];
  }, [services, selectedDiscipline]);

  // Filter projects by active discipline, service, and search query
  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      const matchesDisc =
        selectedDiscipline === 'all' || matchesProjectDiscipline(project, selectedDiscipline);

      const matchesServ =
        selectedService === 'all' || matchesProjectService(project, selectedService);

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.clientReference.toLowerCase().includes(q) ||
        (project.problemDescription || '').toLowerCase().includes(q) ||
        (project.materialsUsed || '').toLowerCase().includes(q) ||
        project.formulation.some((mat) => mat.toLowerCase().includes(q));

      return matchesDisc && matchesServ && matchesSearch;
    });
  }, [publishedProjects, selectedDiscipline, selectedService, searchQuery]);

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
  }, [selectedDiscipline, selectedService, searchQuery]);

  const phone = settings?.phone || '+91 8977668776';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="portfolio-page bg-slate-50/70 text-slate-800 antialiased pb-20 relative">
      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress-indicator"
        style={{ transform: `scaleX(${scrollProgress})` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      {/* ===================================================================== */}
      {/* 1. HERO SECTION WITH ARCHITECTURAL SHOWCASE */}
      {/* ===================================================================== */}
      <section className="relative hero-bg-animated bg-gradient-to-r from-[#04203b] via-[#073256] to-[#0a426e] text-white py-8 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-sky-950/40">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="max-w-2xl text-left scroll-reveal w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2.5 sm:mb-4 shadow-xs animate-pulse-glow max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse shrink-0" />
              <span className="line-clamp-1">{heroContent.badge || 'Three Generations Lineage • Field Engineering Excellence'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2.5 sm:mb-3 text-reveal whitespace-normal sm:whitespace-pre-line">
              {heroContent.title || 'Proven Project Portfolio &\nTechnical Case Studies.'}
            </h1>

            <p className="text-xs sm:text-[13px] text-sky-100/90 leading-relaxed max-w-xl text-reveal delay-100 mb-4 sm:mb-5">
              {heroContent.description ||
                'Explore verified case studies of luxury villas, IT parks, commercial complexes, and heritage estates executed by SLN Engineers across Hyderabad and Telangana.'}
            </p>

            {/* Mobile-Friendly CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 text-reveal delay-200 w-full sm:w-auto">
              <a
                href="#projects-grid"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('projects-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 active:translate-y-0 shadow-md transition-all duration-200 w-full sm:w-auto cursor-pointer"
              >
                <Grid size={14} className="shrink-0" />
                <span>Explore Case Studies</span>
              </a>

              <Link
                to="/contact#inspection-form"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/40 active:translate-y-0 border border-white/20 shadow-xs transition-all duration-200 backdrop-blur-xs w-full sm:w-auto cursor-pointer"
              >
                <Calendar size={14} className="shrink-0" />
                <span>Book Site View</span>
              </Link>
            </div>

            {/* Trust Proof Highlights */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 pt-3.5 border-t border-sky-400/20 text-[10.5px] sm:text-[11px] text-sky-200/90">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>Site-Verified Audits</span>
              </span>
              <span className="text-sky-500 hidden xs:inline">•</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={13} className="text-sky-300 shrink-0" />
                <span>Before &amp; After Data</span>
              </span>
              <span className="text-sky-500 hidden xs:inline">•</span>
              <span className="inline-flex items-center gap-1">
                <FlaskConical size={13} className="text-sky-300 shrink-0" />
                <span>Formulation Matrix</span>
              </span>
            </div>
          </div>

          {/* Right Visual: Architectural Villa SVG with 'Built to Last' script */}
          <div className="relative shrink-0 w-full max-w-sm sm:max-w-md lg:max-w-lg scroll-reveal-right delay-300 mt-4 lg:mt-0 mx-auto lg:mx-0">
            <div className="relative rounded-2xl overflow-hidden border border-sky-400/30 shadow-2xl bg-gradient-to-br from-slate-900/80 to-sky-950/90 backdrop-blur-xs group hover:-translate-y-1 hover:shadow-2xl hover:border-sky-400/60 transition-all duration-500">
              <svg viewBox="0 0 520 320" className="w-full h-auto object-cover max-h-[200px] sm:max-h-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="skyGradVilla" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="40%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#f0f9ff" />
                  </linearGradient>
                  <linearGradient id="villaWallGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                <rect width="520" height="320" fill="url(#skyGradVilla)" />
                <path d="M 0 170 L 30 170 L 30 140 L 55 140 L 55 170 L 95 170 L 95 125 L 120 125 L 120 170 L 170 170 L 170 145 L 200 145 L 200 170 L 250 170 L 250 135 L 275 135 L 275 170 L 320 170 L 320 150 L 360 150 L 360 170 L 520 170 L 520 320 L 0 320 Z" fill="#7dd3fc" opacity="0.4" />
                <ellipse cx="60" cy="205" rx="35" ry="45" fill="#15803d" opacity="0.85" />
                <ellipse cx="95" cy="215" rx="30" ry="38" fill="#166534" opacity="0.9" />
                <ellipse cx="230" cy="200" rx="40" ry="50" fill="#15803d" opacity="0.75" />
                <ellipse cx="270" cy="195" rx="45" ry="55" fill="#166534" opacity="0.8" />
                <rect x="260" y="160" width="240" height="150" fill="url(#villaWallGrad)" stroke="#94a3b8" strokeWidth="1" />
                <rect x="270" y="170" width="70" height="130" fill="#b45309" opacity="0.85" />
                <line x1="270" y1="190" x2="340" y2="190" stroke="#78350f" strokeWidth="1" />
                <line x1="270" y1="210" x2="340" y2="210" stroke="#78350f" strokeWidth="1" />
                <line x1="270" y1="230" x2="340" y2="230" stroke="#78350f" strokeWidth="1" />
                <line x1="270" y1="250" x2="340" y2="250" stroke="#78350f" strokeWidth="1" />
                <line x1="270" y1="270" x2="340" y2="270" stroke="#78350f" strokeWidth="1" />
                <rect x="350" y="170" width="75" height="130" fill="url(#glassGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="387" y1="170" x2="387" y2="300" stroke="#38bdf8" strokeWidth="1" />
                <rect x="435" y="170" width="55" height="130" fill="url(#glassGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="295" y="80" width="195" height="85" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                <rect x="310" y="90" width="110" height="65" fill="url(#glassGrad)" stroke="#38bdf8" strokeWidth="1" />
                <line x1="365" y1="90" x2="365" y2="155" stroke="#38bdf8" strokeWidth="1" />
                <rect x="280" y="70" width="225" height="12" rx="2" fill="#334155" />
                <line x1="300" y1="70" x2="300" y2="60" stroke="#334155" strokeWidth="3" />
                <line x1="340" y1="70" x2="340" y2="60" stroke="#334155" strokeWidth="3" />
                <line x1="380" y1="70" x2="380" y2="60" stroke="#334155" strokeWidth="3" />
                <line x1="420" y1="70" x2="420" y2="60" stroke="#334155" strokeWidth="3" />
                <line x1="460" y1="70" x2="460" y2="60" stroke="#334155" strokeWidth="3" />
                <rect x="290" y="58" width="180" height="4" fill="#475569" />
                <rect x="430" y="138" width="60" height="20" rx="3" fill="#047857" />
                <ellipse cx="445" cy="132" rx="12" ry="10" fill="#10b981" />
                <ellipse cx="465" cy="130" rx="14" ry="11" fill="#059669" />
                <ellipse cx="482" cy="133" rx="10" ry="9" fill="#10b981" />
                <rect x="295" y="145" width="130" height="18" fill="#e0f2fe" opacity="0.65" stroke="#38bdf8" strokeWidth="0.8" />
                <polygon points="0,270 520,250 520,320 0,320" fill="#15803d" />
                <polygon points="0,290 520,275 520,320 0,320" fill="#166534" />
                <g transform="translate(425, 175) rotate(-12)">
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="28"
                    fontFamily="cursive, Georgia, serif"
                    fontWeight="bold"
                    letterSpacing="1"
                    filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.6))"
                  >
                    Built to Last
                  </text>
                </g>
              </svg>

              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-sky-400/30 flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-bold text-sky-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Site Audit Complete</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. 4-PILLAR ENGINEERING PRACTICE SHOWCASE (INTERACTIVE NAVIGATOR)     */}
      {/* ===================================================================== */}
      <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-5 sm:-mt-7 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-2.5 sm:p-4 lg:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-stretch">
            {disciplines.map((disc) => {
              const isSelected = selectedDiscipline === (disc.slug || disc.id);

              return (
                <div
                  key={disc.id || disc.slug}
                  onClick={() => {
                    const targetSlug = disc.slug || disc.id;
                    setSelectedDiscipline(isSelected ? 'all' : targetSlug);
                    setSelectedService('all');
                    const el = document.getElementById('projects-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`p-2.5 sm:p-3.5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 group ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md ring-2 ring-sky-400/40'
                      : 'hover:bg-sky-50/60'
                  }`}
                >
                  <div
                    style={{ backgroundColor: isSelected ? '#0284c7' : disc.accentColor || '#0284c7' }}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105"
                  >
                    {renderDisciplineIcon(disc.icon, 16)}
                  </div>
                  <div className="min-w-0 flex-1 w-full">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-sky-500/30 text-sky-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {disc.tag || 'IS Standard'}
                      </span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-black tracking-tight mt-1 truncate ${
                        isSelected ? 'text-white' : 'text-slate-900 group-hover:text-sky-700'
                      }`}
                    >
                      {disc.name}
                    </div>
                    <div
                      className={`text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {disc.shortCategory || 'Engineering Restoration Practice'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. PRIMARY DISCIPLINE FILTER TABS & SERVICE FILTER BAR */}
      {/* ===================================================================== */}
      <div id="projects-grid" className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-6 sm:mb-8 scroll-reveal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {heroContent.catalogTitle || 'Case Studies by Core Discipline'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {heroContent.catalogSubtitle || 'Filter verified project accounts across our 4 civil engineering pillars.'}
            </p>
          </div>

          {/* Primary Discipline Filter Pills */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {allFilterPillars.map((disc) => {
              const targetSlug = disc.slug || disc.id;
              const isSelected = selectedDiscipline === targetSlug;

              return (
                <button
                  key={targetSlug}
                  type="button"
                  onClick={() => {
                    setSelectedDiscipline(targetSlug);
                    setSelectedService('all');
                    if (targetSlug === 'all') {
                      setSearchParams({}, { replace: true });
                    } else {
                      setSearchParams({ discipline: targetSlug }, { replace: true });
                    }
                  }}
                  className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#04203b] text-white shadow-md ring-2 ring-sky-400/40'
                      : 'bg-white hover:bg-slate-100 hover:border-sky-300 text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {targetSlug === 'all' ? (
                    <Grid size={13} className={isSelected ? 'text-sky-300' : 'text-slate-500'} />
                  ) : (
                    renderDisciplineIcon(disc.icon, 13, isSelected ? 'text-sky-300' : '')
                  )}
                  <span>{disc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Specific Service Filter Bar & Search */}
        <div className="mt-3 sm:mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Service Chips */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            <button
              type="button"
              onClick={() => setSelectedService('all')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedService === 'all'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Services
            </button>

            {availableServicesForDiscipline.map((s) => {
              const key = s.category || s.title;
              const isSelected = selectedService === key || selectedService === s.title;

              return (
                <button
                  key={s.id || s._id}
                  type="button"
                  onClick={() => setSelectedService(isSelected ? 'all' : key)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white font-bold shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 lg:w-80 shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search project title, area, materials used..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Active Filter Badge & Reset */}
        {(selectedDiscipline !== 'all' || selectedService !== 'all' || searchQuery) && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] bg-sky-50/90 border border-sky-200/80 rounded-xl px-3 py-1.5 text-sky-800 shadow-2xs">
            <span className="truncate font-medium">
              Filtered: {selectedDiscipline !== 'all' ? selectedDiscipline : 'All'}
              {selectedService !== 'all' ? ` • ${selectedService}` : ''}
              {searchQuery ? ` • "${searchQuery}"` : ''}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedService('all');
                setSearchQuery('');
                setSearchParams({}, { replace: true });
              }}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 underline shrink-0 ml-2 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. PROJECTS SHOWCASE GRID */}
      {/* ===================================================================== */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-md mx-auto shadow-xs scroll-reveal">
            <Building2 size={36} className="mx-auto text-slate-400 mb-2" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Projects Found</h3>
            <p className="text-slate-500 text-xs mb-4">
              No verified case studies match your active filters or search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedService('all');
                setSearchQuery('');
                setSearchParams({}, { replace: true });
              }}
              className="bg-[#0284c7] hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project, idx) => {
              const targetDisc = disciplines.find((d) => matchesProjectDiscipline(project, d));
              const accentColor = targetDisc?.accentColor || '#0284c7';
              const staggerClass = `stagger-${(idx % 3) + 1}`;

              return (
                <div
                  key={project._id || project.id}
                  className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-sky-400/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group scroll-reveal-pop ${staggerClass}`}
                >
                  {/* Top Sliding Gradient Accent Line */}
                  <div
                    style={{ backgroundColor: accentColor }}
                    className="h-1 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />

                  {/* Top Media Area */}
                  <div className="relative h-[190px] sm:h-[220px] w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={project.image || project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Discipline Pill: Top Left */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] sm:text-[9.5px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider border border-white/10 flex items-center gap-1">
                      <span style={{ backgroundColor: accentColor }} className="w-1.5 h-1.5 rounded-full" />
                      <span>{project.disciplineName}</span>
                    </div>

                    {/* Service Badge: Bottom Left */}
                    <div
                      style={{ backgroundColor: accentColor }}
                      className="absolute bottom-2.5 left-2.5 text-white text-[9.5px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1 max-w-[85%]"
                    >
                      <ShieldCheck size={12} className="shrink-0" />
                      <span className="truncate">
                        {project.serviceTitle || project.serviceCategory}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <h3 className="font-black text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
                        {project.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-slate-500 text-[10.5px] sm:text-[11px]">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>

                      <div className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium">
                        <strong className="text-slate-700">Client Ref:</strong> {project.clientReference}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1 border-t border-slate-100">
                        {project.problemDescription || project.problem}
                      </p>
                    </div>

                    {/* Chemical Formulations Pills */}
                    <div className="space-y-1.5 pt-1.5 sm:pt-2">
                      <div className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FlaskConical size={11} />
                        <span>Formulation Matrix:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.formulation.slice(0, 3).map((mat, i) => (
                          <span
                            key={i}
                            className="text-[9.5px] sm:text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 truncate max-w-[180px] sm:max-w-[210px]"
                          >
                            {mat}
                          </span>
                        ))}
                        {project.formulation.length > 3 && (
                          <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 px-1 py-0.5">
                            +{project.formulation.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(project)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 group/btn cursor-pointer py-1.5 transition-colors truncate"
                      >
                        <span className="hidden xs:inline">View Case Study</span>
                        <span className="xs:hidden">Case Study</span>
                        <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                      </button>

                      <Link
                        to={`/contact?service=${encodeURIComponent(project.serviceTitle || project.serviceCategory)}#inspection-form`}
                        className="btn btn-primary btn-sm text-[11px] py-1.5 px-3 shadow-xs shrink-0 text-center font-bold cursor-pointer"
                      >
                        Book Inspection
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 5. ENGINEERING CONSULTATION BANNER */}
      {/* ===================================================================== */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 scroll-reveal">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#031b33] via-[#052b4d] to-[#04203b] border border-sky-500/20 shadow-2xl p-5 sm:p-8 lg:p-10 relative overflow-hidden text-white">
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-start gap-3 sm:gap-4 max-w-2xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                  Require Custom Engineering Specifications?
                </h3>
                <div className="text-[11px] sm:text-xs font-bold text-sky-300 mt-0.5">
                  On-Site Thermal Moisture Survey, Core Diagnosis &amp; Technical BOQ
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-1">
                  Connect directly with our senior civil engineering team. We evaluate building age, previous contractor coating failures, and structural movement to deliver a guaranteed plan across waterproofing, painting, structural rehabilitation, or ceiling works.
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full lg:w-auto justify-start lg:justify-end">
              <Link
                to="/contact#inspection-form"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 active:translate-y-0 shadow-sm transition-all duration-200 group w-full sm:w-auto cursor-pointer"
              >
                <Calendar size={13} className="shrink-0" />
                <span>Schedule Site View</span>
              </Link>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-slate-900/60 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500 active:translate-y-0 border border-slate-700 shadow-sm transition-all duration-200 group w-full sm:w-auto"
              >
                <Phone size={13} className="shrink-0" />
                <span>Call {phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-[#22c55e] hover:bg-[#16a34a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 active:translate-y-0 shadow-sm transition-all duration-200 group w-full sm:w-auto"
              >
                <MessageCircle size={13} className="shrink-0" />
                <span>WhatsApp Senior Engineer</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. INTERACTIVE TECHNICAL CASE STUDY MODAL */}
      {/* ===================================================================== */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto overscroll-none">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 p-4 sm:p-7 lg:p-8 relative animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 space-y-4 sm:space-y-6 overscroll-contain">
            {/* Mobile Sheet Drag Handle */}
            <div
              className="w-10 h-1 bg-slate-300 rounded-full mx-auto sm:hidden mb-2 -mt-1 cursor-grab"
              onClick={() => setActiveModalProject(null)}
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalProject(null)}
              className="absolute top-3 sm:top-5 right-3 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Close modal"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800">
                  {activeModalProject.disciplineName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-600 truncate max-w-[240px]">
                  {activeModalProject.serviceTitle || activeModalProject.serviceCategory}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {activeModalProject.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span>{activeModalProject.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User size={13} className="text-slate-400 shrink-0" />
                  <span>{activeModalProject.clientReference}</span>
                </span>
              </div>
            </div>

            {/* Before / After Comparison Slider */}
            {activeModalProject.beforeMedia?.[0]?.url && activeModalProject.afterMedia?.[0]?.url ? (
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <BeforeAfterSlider
                  beforeImage={activeModalProject.beforeMedia[0].url}
                  afterImage={activeModalProject.afterMedia[0].url}
                  beforeLabel={activeModalProject.beforeMedia[0].caption || 'Before Treatment'}
                  afterLabel={activeModalProject.afterMedia[0].caption || 'After Restoration'}
                  aspectRatio="16/9"
                />
              </div>
            ) : (
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-md h-56 sm:h-72">
                <img
                  src={activeModalProject.image || activeModalProject.coverImage}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Diagnostic Findings & Scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1.5">
                <div className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>Problem &amp; Structural Defect Analysis</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeModalProject.problemDescription || activeModalProject.problem}
                </p>
              </div>

              <div className="bg-sky-50/70 border border-sky-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 space-y-1.5">
                <div className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span>Inspection Findings &amp; Diagnostics</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeModalProject.inspectionFindings}
                </p>
              </div>
            </div>

            {/* Engineering Solution Executed */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Wrench size={15} className="text-sky-600 shrink-0" />
                <span>Engineering Solution &amp; Scope of Work Executed</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeModalProject.workPerformed}
              </p>
            </div>

            {/* Formulation Matrix */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical size={14} className="text-sky-600 shrink-0" />
                <span>Chemical Formulations &amp; Material Systems</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {activeModalProject.formulation.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-800"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer CTAs - Sticky on mobile */}
            <div className="pt-3 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0 py-2 sm:py-0 z-10">
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="btn btn-outline btn-sm text-xs w-full sm:w-auto order-3 sm:order-1"
              >
                Close Case Study
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SLN%20Engineers,%20I%20reviewed%20your%20case%20study:%20${encodeURIComponent(activeModalProject.title)}.%20I%20would%20like%20a%20similar%20inspection.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto py-2.5 sm:py-1.5"
                >
                  <MessageCircle size={14} />
                  <span>Consult Engineer on WhatsApp</span>
                </a>

                <Link
                  to={`/contact?service=${encodeURIComponent(activeModalProject.serviceTitle || activeModalProject.serviceCategory)}#inspection-form`}
                  className="btn btn-primary btn-sm text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto py-2.5 sm:py-1.5 font-bold cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Book Site Inspection</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
