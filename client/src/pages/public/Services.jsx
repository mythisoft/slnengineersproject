import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import {
  Calendar,
  Users,
  Building2,
  Shield,
  ShieldCheck,
  MessageCircle,
  Check,
  ChevronRight,
  Layers,
  Droplets,
  Search,
  Grid,
  Paintbrush,
  Wrench,
  ArrowRight,
  Phone,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Hammer,
  ArrowUp,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  CORE_DISCIPLINES,
  DEFAULT_DISCIPLINES,
  DEFAULT_SERVICES,
  DEFAULT_SERVICES_HERO,
  renderServiceIcon,
  renderDisciplineIcon,
  normalizeService,
  normalizeDiscipline,
  matchesDiscipline,
} from '../../utils/servicesData';

export { CORE_DISCIPLINES, DEFAULT_DISCIPLINES };
export const SERVICES_DATA = [];

// Helper to resolve query parameter (category or discipline) to the correct service
function findMatchingService(categoryParam, idParam, list = []) {
  if (!categoryParam && !idParam) return null;
  const p = (categoryParam || '').toLowerCase().trim();
  const id = (idParam || '').trim();

  return list.find((s) => {
    if (id && (s.id === id || s.id === id.padStart(2, '0') || s._id === id)) return true;
    if (!p) return false;

    const catKey = (s.categoryKey || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    const label = (s.categoryLabel || '').toLowerCase();
    const discId = (s.disciplineId || '').toLowerCase();
    const discName = (s.disciplineName || '').toLowerCase();

    // 1. Exact match
    if (catKey === p || title === p || label === p || discId === p || discName === p) return true;

    // 2. Substring match
    if (p.includes(catKey) || catKey.includes(p)) return true;
    if (p.includes(title) || title.includes(p)) return true;
    if (p.includes(discId) || discId.includes(p)) return true;

    // 3. Normalized slug comparison
    const normalizedParam = p.replace(/[-_&]/g, ' ').replace(/\s+/g, ' ');
    const normalizedCat = catKey.replace(/[-_&]/g, ' ').replace(/\s+/g, ' ');
    const normalizedTitle = title.replace(/[-_&]/g, ' ').replace(/\s+/g, ' ');
    const normalizedDisc = discName.replace(/[-_&]/g, ' ').replace(/\s+/g, ' ');

    if (normalizedCat.includes(normalizedParam) || normalizedParam.includes(normalizedCat)) return true;
    if (normalizedTitle.includes(normalizedParam) || normalizedParam.includes(normalizedTitle)) return true;
    if (normalizedDisc.includes(normalizedParam) || normalizedParam.includes(normalizedDisc)) return true;

    // 4. Keyword heuristics
    if ((p.includes('terrace') || p.includes('roof')) && s.id === '01') return true;
    if ((p.includes('bathroom') || p.includes('wet')) && s.id === '02') return true;
    if (p.includes('basement') && s.id === '03') return true;
    if ((p.includes('damp') || p.includes('leak') || p.includes('efflorescence')) && s.id === '04') return true;
    if ((p.includes('facade') || p.includes('façade') || p.includes('external')) && s.id === '05') return true;
    if ((p.includes('monsoon') || p.includes('exterior paint') || p.includes('weather shield')) && s.id === '06') return true;
    if ((p.includes('interior paint') || p.includes('luxury paint') || p.includes('emulsion')) && s.id === '07') return true;
    if ((p.includes('texture') || p.includes('stucco') || p.includes('designer finish')) && s.id === '08') return true;
    if ((p.includes('crack') || p.includes('stitch') || p.includes('epoxy injection')) && s.id === '09') return true;
    if ((p.includes('spall') || p.includes('carbonation') || p.includes('concrete rehab')) && s.id === '10') return true;
    if ((p.includes('joint') || p.includes('expansion') || p.includes('sealant')) && s.id === '11') return true;
    if ((p.includes('gypsum') || p.includes('false ceiling') || p.includes('gyproc')) && s.id === '12') return true;
    if ((p.includes('acoustic') || p.includes('grid ceiling') || p.includes('mineral fiber')) && s.id === '13') return true;
    if ((p.includes('cove') || p.includes('drywall') || p.includes('partition')) && s.id === '14') return true;

    return false;
  });
}

export default function Services() {
  const [settings, setSettings] = useState(null);
  const [disciplines, setDisciplines] = useState(DEFAULT_DISCIPLINES);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeDiscipline, setActiveDiscipline] = useState('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [heroContent, setHeroContent] = useState(DEFAULT_SERVICES_HERO);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const prevSearchRef = useRef('');

  useEffect(() => {
    const loadAllServicesData = () => {
      fetchApi('/settings')
        .then((res) => {
          if (res.success && res.data) {
            setSettings(res.data);
            if (res.data.servicesPageContent && Object.keys(res.data.servicesPageContent).length > 0) {
              setHeroContent((prev) => ({ ...prev, ...res.data.servicesPageContent }));
            }
          }
        })
        .catch((e) => console.error('Failed to load settings:', e));

      // Dynamic Disciplines Load
      fetchApi('/disciplines')
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setDisciplines(res.data.map((d, idx) => normalizeDiscipline(d, idx)));
          }
        })
        .catch((e) => console.warn('Could not load public disciplines, using defaults:', e));

      // Dynamic Services Load
      fetchApi('/services')
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setServices(res.data.map((s, idx) => normalizeService(s, idx)));
          }
        })
        .catch((e) => console.warn('Public services fetch error:', e))
        .finally(() => setLoadingServices(false));
    };

    loadAllServicesData();

    window.addEventListener('sln_services_updated', loadAllServicesData);
    window.addEventListener('sln_disciplines_updated', loadAllServicesData);
    window.addEventListener('sln_services_hero_updated', loadAllServicesData);

    return () => {
      window.removeEventListener('sln_services_updated', loadAllServicesData);
      window.removeEventListener('sln_disciplines_updated', loadAllServicesData);
      window.removeEventListener('sln_services_hero_updated', loadAllServicesData);
    };
  }, []);

  const publishedServices = useMemo(() => {
    return services.filter((s) => s.publicationStatus);
  }, [services]);

  const activeDisciplines = useMemo(() => {
    return disciplines.filter((d) => d.isActive);
  }, [disciplines]);

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
      ...activeDisciplines,
    ];
  }, [activeDisciplines]);

  // Sync activeDiscipline with query parameter from URL (e.g., /services?category=waterproof or /services?discipline=painting)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const disciplineParam = searchParams.get('discipline');
    const idParam = searchParams.get('id');

    // Case 1: All Specializations explicitly selected or no query params
    if (disciplineParam === 'all' || (!disciplineParam && !categoryParam && !idParam)) {
      setActiveDiscipline('all');
      return;
    }

    // Case 2: Specific discipline parameter in URL
    if (disciplineParam) {
      const discKey = disciplineParam.toLowerCase().trim();
      const foundDisc = disciplines.find(
        (d) =>
          d.id === discKey ||
          d.slug === discKey ||
          (d.id === 'repairs' && (discKey === 'restoration' || discKey.includes('repair') || discKey.includes('restor'))) ||
          (d.id === 'false-ceiling' && (discKey === 'ceiling' || discKey.includes('ceil') || discKey.includes('false')))
      );
      if (foundDisc) {
        setActiveDiscipline(foundDisc.slug || foundDisc.id);
        setTimeout(() => {
          const target =
            document.getElementById(`discipline-section-${foundDisc.slug || foundDisc.id}`) ||
            document.getElementById('services-grid');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
        return;
      }
    }

    // Case 3: Category or ID lookup
    if (categoryParam || idParam) {
      const match = findMatchingService(categoryParam, idParam, publishedServices);
      if (match) {
        setActiveDiscipline(match.disciplineId);
        setTimeout(() => {
          const target = document.getElementById(`service-${match.id}`) || document.getElementById('services-grid');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
        return;
      }
    }
  }, [searchParams, publishedServices, disciplines]);

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
        if (!el.classList.contains('is-revealed')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100) {
            el.classList.add('is-revealed');
          } else {
            observer.observe(el);
          }
        }
      });
    };

    observeNew();
    const frame = window.requestAnimationFrame(observeNew);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeDiscipline, loadingServices, publishedServices]);

  const phone = settings?.phone || '+91 8977668776';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  // Get dynamic filtered disciplines from state (reflects admin changes in real time)
  const activeDisciplinesList = useMemo(() => {
    if (activeDiscipline === 'all') {
      return activeDisciplines;
    }
    return activeDisciplines.filter(
      (d) =>
        (d.slug || d.id) === activeDiscipline ||
        d.id === activeDiscipline ||
        d.slug === activeDiscipline
    );
  }, [activeDisciplines, activeDiscipline]);

  // Find any orphan services that don't match active discipline pillars
  const orphanServices = useMemo(() => {
    return publishedServices.filter((s) => !activeDisciplines.some((d) => matchesDiscipline(s, d)));
  }, [publishedServices, activeDisciplines]);

  return (
    <div className="services-page bg-slate-50/70 text-slate-800 antialiased pb-20 relative">
      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress-indicator"
        style={{ transform: `scaleX(${scrollProgress})` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      {/* 1. HERO SECTION WITH 4 SPECIALIZATIONS OVERVIEW */}
      <section className="relative hero-bg-animated bg-gradient-to-r from-[#04203b] via-[#073256] to-[#0a426e] text-white py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-sky-950/40">
        {/* Subtle Ambient Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="max-w-2xl text-left scroll-reveal w-full">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-xs">
              <Sparkles size={13} className="text-sky-300 shrink-0" />
              <span>{heroContent.badge || '4 Specialized Services • Three Generations Lineage'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 text-reveal whitespace-pre-line">
              {heroContent.title || 'Waterproofing, Painting,\nStructural Repairs & False Ceilings.'}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] text-sky-200/90 leading-relaxed max-w-xl mb-6 text-reveal delay-100">
              {heroContent.description ||
                'Complete civil engineering excellence under one roof. Permanent hydrostatic leak containment, monsoon weather-shield painting, structural concrete rehabilitation, and moisture-proof gypsum false ceilings backed by documented quality handovers.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 text-reveal delay-200 w-full sm:w-auto">
              <Link
                to={heroContent.ctaPrimaryLink || '/contact#inspection-form'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 active:translate-y-0 shadow-md shadow-sky-950/30 transition-all duration-200 group btn-ripple w-full sm:w-auto cursor-pointer"
              >
                <Calendar size={15} className="group-hover:rotate-6 transition-transform duration-200 shrink-0" />
                <span>{heroContent.ctaPrimaryText || 'Book Diagnostic Site Inspection'}</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:border-white/40 active:translate-y-0 border border-white/20 shadow-xs transition-all duration-200 backdrop-blur-xs group btn-ripple w-full sm:w-auto"
              >
                <MessageCircle size={15} className="group-hover:scale-115 transition-transform duration-200 shrink-0" />
                <span>{heroContent.ctaWhatsappText || 'WhatsApp Senior Engineer'}</span>
              </a>
            </div>
          </div>

          {/* Right Visual: Active Disciplines Visual Matrix */}
          <div className="w-full max-w-md lg:max-w-lg scroll-reveal-right delay-300 mt-2 lg:mt-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5 p-2.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-sky-400/30 backdrop-blur-md shadow-2xl">
              {activeDisciplines.map((disc) => {
                const isSelected = activeDiscipline === (disc.slug || disc.id);
                return (
                  <button
                    key={disc.id || disc.slug}
                    type="button"
                    onClick={() => {
                      const targetSlug = disc.slug || disc.id;
                      setActiveDiscipline(targetSlug);
                      setSearchParams({ discipline: targetSlug }, { replace: true });
                    }}
                    className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all duration-300 group cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-sky-950/90 border-sky-400 shadow-md shadow-sky-500/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: disc.accentColor }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-white flex items-center justify-center mb-1.5 sm:mb-2 shadow-xs group-hover:scale-110 transition-transform"
                    >
                      {renderDisciplineIcon(disc.icon, 15)}
                    </div>
                    <div className="text-[11px] sm:text-xs font-bold text-white leading-tight group-hover:text-sky-300 transition-colors">
                      {disc.name}
                    </div>
                    <div className="text-[9.5px] sm:text-[10px] text-sky-200/70 mt-0.5 sm:mt-1 line-clamp-1">{disc.shortCategory}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY DISCIPLINE FILTER TABS */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-12 mb-6 sm:mb-8 scroll-reveal-pop">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {heroContent.catalogTitle || 'Our Core Expertise Pillars'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {heroContent.catalogSubtitle || 'Select a discipline to explore technical specifications and specialized scopes.'}
            </p>
          </div>

          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 py-1.5 flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x scroll-smooth">
            {allFilterPillars.map((disc) => {
              const targetSlug = disc.slug || disc.id;
              const isSelected = activeDiscipline === targetSlug;

              return (
                <button
                  key={targetSlug}
                  onClick={() => {
                    setActiveDiscipline(targetSlug);
                    if (targetSlug === 'all') {
                      setSearchParams({}, { replace: true });
                    } else {
                      setSearchParams({ discipline: targetSlug }, { replace: true });
                    }
                    setTimeout(() => {
                      const target =
                        targetSlug === 'all'
                          ? document.getElementById('services-grid')
                          : document.getElementById(`discipline-section-${targetSlug}`) ||
                            document.getElementById('services-grid');
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 50);
                  }}
                  className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer active:scale-95 ${
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
      </div>

      {/* 4. DISCIPLINE SERVICES SECTIONS */}
      <div id="services-grid" className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {loadingServices ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-9 h-9 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading verified engineering services...</span>
          </div>
        ) : publishedServices.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <Layers size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Services Currently Listed</h3>
            <p className="text-xs text-slate-500 mt-1">Our engineering scopes are being updated. Contact our civil engineers directly for an on-site diagnosis and custom quote.</p>
            <div className="mt-5">
              <Link to="/contact#inspection-form" className="btn btn-primary btn-sm text-xs">
                Schedule On-Site Inspection
              </Link>
            </div>
          </div>
        ) : (
          activeDisciplinesList.map((discipline, discIdx) => {
            const targetSlug = discipline.slug || discipline.id;
            const disciplineServices = publishedServices.filter((s) => matchesDiscipline(s, discipline));
            const bannerAnim = discIdx % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right';

            return (
              <div key={targetSlug} id={`discipline-section-${targetSlug}`} className="space-y-4 sm:space-y-6 scroll-mt-28">
                {/* Discipline Header Banner */}
                <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${bannerAnim}`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      style={{ backgroundColor: discipline.accentColor || '#0284c7' }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 group-hover:scale-110 transition-transform"
                    >
                      {renderDisciplineIcon(discipline.icon, 20)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                          {discipline.eyebrow || 'Specialized Discipline'}
                        </span>
                        {discipline.tag && (
                          <span
                            style={{ color: discipline.accentColor }}
                            className="px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-extrabold bg-slate-100 uppercase"
                          >
                            {discipline.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                        {discipline.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mt-1">
                        {discipline.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex items-center gap-2 self-start md:self-center shrink-0 mt-1 sm:mt-0">
                    <Link
                      to={discipline.ctaLink || `/contact?service=${encodeURIComponent(discipline.name)}#inspection-form`}
                      className="w-full sm:w-auto justify-center btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm py-2 sm:py-1.5 cursor-pointer"
                    >
                      <Calendar size={13} />
                      <span>{discipline.ctaText || 'Book Inspection'}</span>
                    </Link>
                  </div>
                </div>

                {/* Service Cards Grid for this Discipline */}
                {disciplineServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                    {disciplineServices.map((service, cardIdx) => (
                      <div key={service.id || service._id} id={`service-${service.id}`} className="scroll-mt-32">
                        <ServiceCard service={service} whatsapp={whatsapp} index={cardIdx} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 sm:p-8 text-center text-xs text-slate-500">
                    Specialized engineering packages for {discipline.name} are currently being updated. Contact our civil engineering team for customized inspection and quote.
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Additional Specializations (if any services exist outside active discipline slugs) */}
        {orphanServices.length > 0 && activeDiscipline === 'all' && (
          <div id="discipline-section-other" className="space-y-4 sm:space-y-6 scroll-mt-28">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 scroll-reveal-scale">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Layers size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                      Additional Practices
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase">
                      Custom Solutions
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                    Custom Civil Engineering Specifications
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mt-1">
                    Specialized contractor projects and customized client architectural requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {orphanServices.map((service, cardIdx) => (
                <div key={service.id || service._id} id={`service-${service.id}`} className="scroll-mt-32">
                  <ServiceCard service={service} whatsapp={whatsapp} index={cardIdx} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. BOTTOM CONSULTATION BANNER */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="rounded-2xl overflow-hidden hero-bg-animated bg-gradient-to-r from-[#031d36] via-[#073256] to-[#031d36] text-white border border-slate-800 shadow-xl scroll-reveal-scale delay-100">
          <div className="p-5 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative">
            {/* Left Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4 max-w-xl">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0 mt-0.5 shadow-inner animate-float mx-auto sm:mx-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Require Custom Engineering Specifications?
                </h3>
                <div className="text-xs font-bold text-sky-300 mt-1">
                  On-Site Thermal Moisture Survey, Core Diagnosis &amp; Technical BOQ
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Connect directly with our senior civil engineering team. We evaluate building age, previous contractor coating failures, and structural movement to deliver a guaranteed plan across waterproofing, painting, repairs, or false ceilings.
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto justify-start lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 active:translate-y-0 shadow-sm transition-all duration-200 group btn-ripple w-full sm:w-auto"
              >
                <Calendar size={13} className="group-hover:rotate-6 transition-transform duration-200 shrink-0" />
                <span>Schedule Site Audit</span>
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

// ==========================================
// INDIVIDUAL 3D FLIP SERVICE CARD COMPONENT
// ==========================================
function ServiceCard({ service, whatsapp, index = 0 }) {
  const [imgError, setImgError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'advantages' | 'specs'

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SLN%20Engineers,%20I%20would%20like%20to%20consult%20regarding%20${encodeURIComponent(service.title)}.`;

  const handleFlipToBack = (e) => {
    e?.stopPropagation?.();
    setIsFlipped(true);
  };

  const handleFlipToFront = (e) => {
    e?.stopPropagation?.();
    setIsFlipped(false);
  };

  const accentColor = service.accentColor || '#0284c7';
  const staggerClass = `stagger-${(index % 3) + 1}`;

  return (
    <div className={`perspective-1000 w-full h-[450px] sm:h-[430px] scroll-reveal-pop ${staggerClass}`}>
      <div className={`card-flip-transition transform-style-3d w-full h-full relative ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* ================= 1. FRONT FACE (PHOTO & SUMMARY) ================= */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isFlipped}
          aria-label={`View engineering details for ${service.title}`}
          onClick={handleFlipToBack}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFlipToBack(e);
            }
          }}
          className="backface-hidden absolute inset-0 w-full h-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-sky-400/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer active:scale-[0.99]"
        >
          {/* Top Sliding Gradient Accent Line */}
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute top-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20"
          />

          {/* Card Top Media Container */}
          <div className="relative h-[200px] sm:h-[210px] w-full overflow-hidden bg-slate-100 shrink-0">
            {!imgError ? (
              <img
                src={service.image}
                alt={service.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <div
                style={{ backgroundColor: accentColor }}
                className="w-full h-full flex items-center justify-center text-white"
              >
                {renderServiceIcon(service.iconType, 40, 'text-white')}
              </div>
            )}

            {/* Discipline Tag: Top Left */}
            <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider border border-white/10">
              {service.disciplineName}
            </div>

            {/* View Details Hover Indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold text-slate-900 border border-slate-200/60 transform group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <span>View Details</span>
                <ArrowRight size={14} style={{ color: accentColor }} />
              </div>
            </div>
          </div>

          {/* Card Body Container */}
          <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
            <div>
              {/* Header Row: Circle Icon & Title */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 group-hover:scale-110"
                >
                  {renderServiceIcon(service.iconType, 16)}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors duration-200 line-clamp-2">
                  {service.title}
                </h3>
              </div>

              {/* Short Preview / Description Snippet */}
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mt-2 sm:mt-2.5">
                {service.description}
              </p>

              {/* Badges: Standard Protocol */}
              {service.protocol && (
                <div className="mt-2 sm:mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-[10px] text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    <Check size={11} className="text-emerald-600" />
                    {service.protocol}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom "View Details" Clickable Button */}
            <button
              type="button"
              onClick={handleFlipToBack}
              className="w-full mt-2.5 sm:mt-3 py-2 px-3 rounded-lg bg-slate-50 hover:bg-[#0284c7] text-[#0284c7] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 hover:border-[#0284c7] transition-all duration-200 shadow-2xs group/btn cursor-pointer active:scale-[0.98]"
            >
              <span>View Specifications</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* ================= 2. BACK FACE (DETAILS DIRECTLY ON CARD) ================= */}
        <div
          className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full bg-gradient-to-b from-white via-slate-50 to-sky-50/40 rounded-2xl border-2 border-sky-400 shadow-xl shadow-sky-500/10 p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar: Icon, Title & Close Button */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                >
                  {renderServiceIcon(service.iconType, 15)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                    {service.title}
                  </h4>
                  <div className="text-[9.5px] sm:text-[10px] text-slate-400 font-mono">
                    {service.disciplineName}
                  </div>
                </div>
              </div>

              {/* Close Button to flip back */}
              <button
                type="button"
                onClick={handleFlipToFront}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 hover:rotate-90 text-slate-600 hover:text-slate-900 transition-all duration-200 shrink-0 cursor-pointer"
                title="Back to photo"
                aria-label="Back to photo"
              >
                <X size={15} />
              </button>
            </div>

            {/* Segmented Tab Bar: Overview | Advantages | Specs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-0.5 rounded-lg mt-2.5 sm:mt-3 text-[10px] sm:text-[10.5px] font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-1 rounded-md transition-all duration-150 text-center cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-sky-900 shadow-xs scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('advantages')}
                className={`py-1 rounded-md transition-all duration-150 text-center cursor-pointer ${
                  activeTab === 'advantages'
                    ? 'bg-white text-sky-900 shadow-xs scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Advantages
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`py-1 rounded-md transition-all duration-150 text-center cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-white text-sky-900 shadow-xs scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Specs
              </button>
            </div>
          </div>

          {/* Middle Body Area: Sized so NO SCROLLING is needed! With fallback overflow-y-auto */}
          <div className="my-auto py-2 overflow-y-auto max-h-[190px] scrollbar-none">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-2">
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed line-clamp-5">
                  {service.description}
                </p>
                {service.protocol && (
                  <div className="bg-sky-50/80 border border-sky-100 rounded-lg p-2 text-[10px] flex items-center text-sky-950 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-sky-600 shrink-0" />
                      {service.protocol}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADVANTAGES */}
            {activeTab === 'advantages' && (
              <ul className="space-y-1.5 text-xs text-slate-700">
                {service.advantages.slice(0, 4).map((adv, idx) => (
                  <li key={idx} className="group/row flex items-start gap-1.5 leading-tight hover:bg-white/80 p-1 -mx-1 rounded-md transition-all duration-150 cursor-default">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[10.5px] sm:text-[11px] text-slate-700 font-medium">{adv}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* TAB 3: SPECIFICATIONS */}
            {activeTab === 'specs' && (
              <ul className="space-y-1.5 text-xs text-slate-700">
                {service.specifications.slice(0, 4).map((spec, idx) => (
                  <li key={idx} className="group/row flex items-start gap-1.5 leading-tight hover:bg-white/80 p-1 -mx-1 rounded-md transition-all duration-150 cursor-default">
                    <ShieldCheck size={13} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[10.5px] sm:text-[11px] text-slate-700 font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Actions Row: CTAs & Flip-Back */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}#inspection-form`}
                className="flex-1 py-2 sm:py-1.5 px-2 bg-[#0284c7] hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-md text-white text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1 shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Calendar size={12} />
                <span>Site Inspection</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 sm:py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md text-white text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1 shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleFlipToFront}
              className="w-full py-1 text-slate-500 hover:text-sky-700 hover:bg-slate-100/80 rounded-md text-[11px] font-semibold text-center flex items-center justify-center gap-1 transition-colors duration-150 cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
