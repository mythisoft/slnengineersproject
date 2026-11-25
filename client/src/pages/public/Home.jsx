import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Droplets,
  Layers,
  Activity,
  ArrowRight,
  Phone,
  MessageCircle,
  Star,
  Award,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  MapPin,
  Building2,
  CheckCircle,
  Check,
  Sliders,
  FileCheck,
  Calendar,
  User,
  Users,
  ShieldCheck,
  QrCode,
  FlaskConical,
  Search,
  HardHat,
  Sparkles,
  Paintbrush,
  MoveHorizontal,
  Clock,
  Wrench,
  Hammer,
  X,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  ArrowUp,
  Maximize2,
} from 'lucide-react';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import { openInspectionModal } from '../../components/common/InspectionModal';
import { fetchApi } from '../../utils/api';
import { basementBannerCopy, getBannerCopy, isLogoBanner } from '../../utils/bannerCopy';
import { DEFAULT_TRUST_METRICS, resolveTrustIcon } from '../../utils/trustMetricsData';
import { DEFAULT_PROJECTS, matchesProjectService } from '../../utils/projectsData';
import { DEFAULT_SERVICES, renderServiceIcon, matchesDiscipline } from '../../utils/servicesData';
import {
  DEFAULT_PILLAR_CARDS,
  DEFAULT_GLIMPSE_SETTINGS,
} from '../../utils/pillarCardData';
import {
  DEFAULT_HOME_CONTENT,
  renderTrustCardIcon,
} from '../../utils/homeData';

const BANNER_ICON_MAP = {
  Droplets,
  Paintbrush,
  Building2,
  Layers,
  ShieldCheck,
  Wrench,
  Hammer,
  Sparkles,
};

const resolveBannerServiceIcon = (icon) => {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) return icon;
  return BANNER_ICON_MAP[icon] || Droplets;
};

// High-Resolution Default Hero Banners for Pristine Clarity (Synced from Database)
const DEFAULT_BANNERS = [
  {
    _id: '6afeb0dda4cf1ce46ae79ffc',
    title: 'All Specialized Services & Company Overview',
    imageUrl: 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431492/sln_waterproofing/banners/nooq3caitvkevrr3sznm.png',
    isCompanyLogoBanner: true,
    durationSeconds: 3,
    altText: 'SLN Engineers Projects Official Company Logo and Full Civil Services Spectrum',
    eyebrow: 'All 4 Specializations Under One Roof',
    foundedText: '',
    headline: '',
    highlightedHeadline: '',
    description: 'Certified ISO civil engineering practice delivering specialized leak defense, weather-shield painting, structural restoration, and acoustic interior ceilings with warranty protection.',
    primaryCtaText: 'Request Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '4 Core', label: 'Civil Disciplines' },
      { value: '40+ Yrs', label: 'Continuous Practice' },
      { value: '100%', label: 'In-House Execution' },
    ],
    isActive: true,
    order: 0,
    bannerServices: [
      {
        name: 'Waterproofing Solutions',
        shortCategory: 'Active Leak Defense & Crystalline Tanking',
        tag: 'IS 1346 Certified',
        icon: 'Droplets',
        accentColor: '#38bdf8',
        targetBannerIndex: 1,
        _id: '6b041c45e462764fc43dc0d9',
      },
      {
        name: 'Interior & Exterior Painting',
        shortCategory: 'Weather-Shield & Aesthetic Finishes',
        tag: 'UV Weather-Shield',
        icon: 'Paintbrush',
        accentColor: '#f59e0b',
        targetBannerIndex: 1,
        _id: '6b041c45e462764fc43dc0da',
      },
      {
        name: 'Building Repairs & Restoration',
        shortCategory: 'Structural Crack Stitching & Concrete Rehab',
        tag: 'Structural Defense',
        icon: 'Building2',
        accentColor: '#029746',
        targetBannerIndex: 1,
        _id: '6b041c45e462764fc43dc0db',
      },
      {
        name: 'False Ceiling & Interior Work',
        shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
        tag: 'Acoustic & Gypsum',
        icon: 'Layers',
        accentColor: '#fbbf24',
        targetBannerIndex: 1,
        _id: '6b041c45e462764fc43dc0dc',
      },
    ],
  },
  {
    _id: '6afeb0dda4cf1ce46ae7a001',
    title: 'Precision Waterproofing & Structural Defense',
    imageUrl: 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431959/sln_waterproofing/banners/fam7jmcpaoxskw7hside.jpg',
    isCompanyLogoBanner: false,
    durationSeconds: 2,
    altText: 'Modern architectural home protected by SLN Engineers advanced waterproofing',
    eyebrow: 'Precision Structural Waterproofing',
    foundedText: '',
    headline: 'Advanced Waterproofing,',
    highlightedHeadline: 'engineered for decades.',
    description: 'High-pressure polyurethane injection, crystalline tanking, and elastomeric membrane systems that stop active groundwater ingress and structural dampness permanently.',
    primaryCtaText: 'Book Free Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '100%', label: 'Active Leak Defense' },
      { value: '500+ Bar', label: 'Injection Capacity' },
      { value: '10-Year', label: 'Written Warranty' },
    ],
    isActive: true,
    order: 1,
    bannerServices: [
      {
        name: 'Waterproofing Solutions',
        shortCategory: 'Active Leak Defense & Crystalline Tanking',
        tag: 'IS 1346 Certified',
        icon: 'Droplets',
        accentColor: '#38bdf8',
        targetBannerIndex: 1,
        _id: '6b041e1ae462764fc43dc3ed',
      },
      {
        name: 'Interior & Exterior Painting',
        shortCategory: 'Weather-Shield & Aesthetic Finishes',
        tag: 'UV Weather-Shield',
        icon: 'Paintbrush',
        accentColor: '#f59e0b',
        targetBannerIndex: 1,
        _id: '6b041e1ae462764fc43dc3ee',
      },
      {
        name: 'Building Repairs & Restoration',
        shortCategory: 'Structural Crack Stitching & Concrete Rehab',
        tag: 'Structural Defense',
        icon: 'Building2',
        accentColor: '#029746',
        targetBannerIndex: 1,
        _id: '6b041e1ae462764fc43dc3ef',
      },
      {
        name: 'False Ceiling & Interior Work',
        shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
        tag: 'Acoustic & Gypsum',
        icon: 'Layers',
        accentColor: '#fbbf24',
        targetBannerIndex: 1,
        _id: '6b041e1ae462764fc43dc3f0',
      },
    ],
  },
  {
    _id: '6afeb108a4cf1ce46ae7a00d',
    title: 'Professional Painting & Decorative Finishes',
    imageUrl: 'https://res.cloudinary.com/vqifqntv/image/upload/v1795432269/sln_waterproofing/banners/emxrzwoqooupt7bmikuv.jpg',
    isCompanyLogoBanner: false,
    durationSeconds: 1,
    altText: 'Professional residential and commercial painting services featuring premium interior wall finishes, exterior building coatings, decorative textures, and long-lasting surface protection',
    eyebrow: 'Premium Painting & Finishing',
    foundedText: '',
    headline: 'Transform Your Spaces',
    highlightedHeadline: 'with beautiful lasting finishes.',
    description: 'Enhance your residential and commercial spaces with premium painting solutions. From elegant interior finishes to durable exterior coatings, we deliver vibrant colours, smooth surfaces, and long-lasting protection with expert craftsmanship.',
    primaryCtaText: 'Book Site Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '100%', label: 'Active Leak Defense' },
      { value: '500+ Bar', label: 'Injection Capacity' },
      { value: '10-Year', label: 'Written Warranty' },
    ],
    isActive: true,
    order: 2,
    bannerServices: [],
  },
  {
    _id: '6afeb19aa4cf1ce46ae7a2b2',
    title: 'Complete Property Repair Solutions',
    imageUrl: 'https://res.cloudinary.com/vqifqntv/image/upload/v1795432554/sln_waterproofing/banners/qtmpcnrvxhr9k4qxjbsd.png',
    isCompanyLogoBanner: false,
    durationSeconds: 3,
    altText: 'Professional building repair and restoration services featuring wall crack repairs, damaged concrete rehabilitation, plaster restoration, and high-quality property maintenance.',
    eyebrow: 'Reliable Repairs & Restoration',
    foundedText: '',
    headline: 'Expert Repairs,',
    highlightedHeadline: 'restoring strength',
    description: 'Bring strength and beauty back to your property with professional repair and restoration services. From wall cracks and surface damage to structural repairs, we deliver reliable solutions, quality workmanship, and long-lasting results',
    primaryCtaText: 'Book Site Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '100%', label: 'Active Leak Defense' },
      { value: '500+ Bar', label: 'Injection Capacity' },
      { value: '10-Year', label: 'Written Warranty' },
    ],
    isActive: true,
    order: 3,
    bannerServices: [],
  },
  {
    _id: '6b042185e462764fc43dc6ec',
    title: 'Modern False Ceiling & Interior Solutions',
    imageUrl: 'https://res.cloudinary.com/vqifqntv/image/upload/v1795433105/sln_waterproofing/banners/cste7pvmfixjcuhdf93o.png',
    isCompanyLogoBanner: false,
    durationSeconds: 3,
    altText: 'Modern false ceiling design and installation featuring premium gypsum and POP ceiling finishes, decorative lighting, elegant architectural details, and contemporary interior some protected by SLN Engineers advanced waterproofing',
    eyebrow: 'Modern Ceiling Design & Installation',
    foundedText: '',
    headline: 'Elevate Your Ceilings,',
    highlightedHeadline: 'with modern false ceiling designs.',
    description: 'Transform your interiors with stylish and expertly crafted false ceiling solutions. From elegant gypsum ceilings to contemporary POP designs and custom lighting integration, we create beautiful, functional spaces with exceptional finishing and lasting quality.',
    primaryCtaText: 'Book Site Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '100%', label: 'Active Leak Defense' },
      { value: '500+ Bar', label: 'Injection Capacity' },
      { value: '10-Year', label: 'Written Warranty' },
    ],
    isActive: true,
    order: 4,
    bannerServices: [],
  },
];

const getCachedBanners = () => {
  try {
    const cached = localStorage.getItem('sln_cached_banners');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_BANNERS;
};

// Core 4 Civil Engineering Services
const CORE_FOUR_SERVICES = [
  {
    id: 'waterproofing',
    name: 'Waterproofing Solutions',
    shortCategory: 'Active Leak Defense & Crystalline Tanking',
    tag: 'IS 1346 Certified',
    icon: Droplets,
    accentColor: '#38bdf8', // Sky Blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    targetBannerIndex: 1,
    link: '/services?discipline=waterproofing',
  },
  {
    id: 'painting',
    name: 'Interior & Exterior Painting',
    shortCategory: 'Weather-Shield & Aesthetic Finishes',
    tag: 'UV Weather-Shield',
    icon: Paintbrush,
    accentColor: '#f59e0b', // Amber / Yellow
    glowColor: 'rgba(245, 158, 11, 0.4)',
    targetBannerIndex: 1,
    link: '/services?discipline=painting',
  },
  {
    id: 'restoration',
    name: 'Building Repairs & Restoration',
    shortCategory: 'Structural Crack Stitching & Concrete Rehab',
    tag: 'Structural Defense',
    icon: Building2,
    accentColor: '#029746', // SLN Green
    glowColor: 'rgba(2, 151, 70, 0.4)',
    targetBannerIndex: 1,
    link: '/services?discipline=repairs',
  },
  {
    id: 'ceiling',
    name: 'False Ceiling & Interior Work',
    shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
    tag: 'Acoustic & Gypsum',
    icon: Layers,
    accentColor: '#fbbf24', // Warm Yellow
    glowColor: 'rgba(251, 191, 36, 0.4)',
    targetBannerIndex: 1,
    link: '/services?discipline=false-ceiling',
  },
];

// Helper to resolve service navigation link from banner card
const getServiceNavigationPath = (service) => {
  if (service?.link) return service.link;
  const name = (service?.name || service?.title || '').toLowerCase();
  const id = (service?.id || service?.slug || service?.disciplineId || '').toLowerCase();

  if (id === 'waterproofing' || name.includes('waterproof')) {
    return '/services?discipline=waterproofing';
  }
  if (id === 'painting' || name.includes('paint')) {
    return '/services?discipline=painting';
  }
  if (id === 'restoration' || id === 'repairs' || name.includes('repair') || name.includes('restor')) {
    return '/services?discipline=repairs';
  }
  if (id === 'ceiling' || id === 'false-ceiling' || name.includes('ceiling')) {
    return '/services?discipline=false-ceiling';
  }
  if (service?.slug) {
    return `/services/${service.slug}`;
  }
  return `/services?category=${encodeURIComponent(service?.name || '')}`;
};

const BANNER_TOPLINE_SERVICES = CORE_FOUR_SERVICES;

// 4 Horizontal Discipline Pillar Showcase Cards (Displayed directly above Proven Transformation)
const DISCIPLINE_SHOWCASE_CARDS = [
  {
    pillarId: 'painting',
    title: 'Interior & Exterior Painting',
    shortCategory: 'Weather-Shield & Aesthetic Finishes',
    tag: 'UV Weather-Shield',
    image: '/uploads/pillar-painting.jpg',
    accentColor: '#0077c8',
  },
  {
    pillarId: 'waterproofing',
    title: 'Waterproofing Solutions',
    shortCategory: 'Active Leak Defense & Crystalline Tanking',
    tag: 'IS 1346 Certified',
    image: '/uploads/pillar-waterproofing.jpg',
    accentColor: '#0284c7',
  },
  {
    pillarId: 'repairs',
    title: 'Building Repairs & Restoration',
    shortCategory: 'Structural Crack Stitching & Concrete Rehab',
    tag: 'Structural Defense',
    image: '/uploads/pillar-restoration.jpg',
    accentColor: '#ea580c',
  },
  {
    pillarId: 'false-ceiling',
    title: 'False Ceiling & Interior Work',
    shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
    tag: 'Acoustic & Gypsum',
    image: '/uploads/pillar-false-ceiling.jpg',
    accentColor: '#eab308',
  },
];

// Featured Transformation Showcase Data
const DEFAULT_TRANSFORMATIONS = [
  {
    _id: 'trans-01',
    number: '01',
    title: 'Underground Basement Tanking & PU Chemical Injection',
    subtitle: 'Underground Basement Tanking',
    location: 'Hitec City / Madhapur, Hyderabad',
    description:
      'High-pressure chemical polyurethane injection grouting and negative-side crystalline slurry tanking halting active groundwater ingress through cold joints in 45 seconds.',
    beforeImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment (Active Seepage)',
    afterLabel: 'After Restoration (Monolithic Barrier)',
    caseStudySlug: 'negative-side-basement-tanking-pu-chemical-injection-tech-park',
  },
];

const DEFAULT_HOME_REVIEWS = [
  {
    _id: 'default-home-rev-1',
    customerName: 'Mr. K. Srinivas Rao',
    projectTitle: 'Medipally, Hyderabad • Terrace Restoration',
    rating: 5,
    feedbackText:
      'SLN Engineers solved our chronic terrace leakage after two previous contractors had failed. Their civil engineering team identified the hidden crack paths with moisture meters, applied a monolithic PU membrane, and our ceiling has remained completely dry through heavy monsoon rains.',
  },
  {
    _id: 'default-home-rev-2',
    customerName: 'Mr. Ramesh Sundaram',
    projectTitle: 'Madhapur, Hyderabad • Basement Tanking',
    rating: 5,
    feedbackText:
      'We had severe groundwater seepage in our basement parking. SLN Engineers executed negative-side crystalline waterproofing and polyurethane injection grouting with zero disruption to residents. Outstanding professionalism, clean site handover, and solid engineering quality.',
  },
  {
    _id: 'default-home-rev-3',
    customerName: 'Mrs. Radhika Varma',
    projectTitle: 'Jubilee Hills, Hyderabad • Façade Coating',
    rating: 5,
    feedbackText:
      'Three generations of craftsmanship truly shows in their work ethic. They repaired structural hairline cracks across our entire 4-storey exterior and applied an elastomeric weather-shield coating that looks pristine. Honest pricing and genuine engineering expertise.',
  },
];

export default function Home() {
  const location = useLocation();
  const [settings, setSettings] = useState(null);
  const [homeContent, setHomeContent] = useState(DEFAULT_HOME_CONTENT);
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [banners, setBanners] = useState(getCachedBanners);
  const [trustMetrics, setTrustMetrics] = useState(DEFAULT_TRUST_METRICS);
  const [adminTransformations, setAdminTransformations] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [prevBannerIndex, setPrevBannerIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [cardMediaTab, setCardMediaTab] = useState({});

  // Prevent background scroll when modal or lightbox is active
  useEffect(() => {
    if (activeModalProject || lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModalProject, lightboxImage]);

  // Escape key to close modal or lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        else if (activeModalProject) setActiveModalProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, activeModalProject]);

  // Dynamic Horizontal Discipline Pillar Cards (Managed via Admin > Pillar Cards)
  const [pillarCards, setPillarCards] = useState(DEFAULT_PILLAR_CARDS);

  const activePillarCards = useMemo(() => {
    const list = Array.isArray(pillarCards) ? [...pillarCards] : [];
    const active = list.filter((c) => c && c.isActive !== false);
    active.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return active.length > 0 ? active : DEFAULT_PILLAR_CARDS;
  }, [pillarCards]);

  // 3-Second Glimpse Intro Video State for Core Discipline Pillars
  const [glimpseSettings, setGlimpseSettings] = useState(DEFAULT_GLIMPSE_SETTINGS);

  const [glimpseStartedOnScroll, setGlimpseStartedOnScroll] = useState(false);
  const [isGlimpseActive, setIsGlimpseActive] = useState(() => {
    return glimpseSettings.isEnabled !== false && Boolean(glimpseSettings.videoUrl);
  });
  const [glimpseCountdown, setGlimpseCountdown] = useState(() => {
    return Math.ceil(glimpseSettings.durationSeconds || 3);
  });
  const glimpseVideoRef = useRef(null);
  const glimpseSectionRef = useRef(null);

  // Trigger video playback and countdown ONLY when user scrolls to the pillar cards section
  useEffect(() => {
    if (glimpseStartedOnScroll) return;
    if (!glimpseSettings.isEnabled || !glimpseSettings.videoUrl) return;

    const el = glimpseSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !glimpseStartedOnScroll) {
          setGlimpseStartedOnScroll(true);
          setIsGlimpseActive(true);
          setGlimpseCountdown(Math.ceil(glimpseSettings.durationSeconds || 3));

          if (glimpseVideoRef.current) {
            glimpseVideoRef.current.muted = true;
            glimpseVideoRef.current.defaultMuted = true;
            glimpseVideoRef.current.currentTime = 0;
            const p = glimpseVideoRef.current.play();
            if (p !== undefined) {
              p.catch((err) => console.warn('Glimpse autoplay error on scroll:', err));
            }
          }

          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.15, // Starts as soon as 15% of the card is visible on screen
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [glimpseStartedOnScroll, glimpseSettings.isEnabled, glimpseSettings.videoUrl]);

  // Imperative autoplay & audio mute
  useEffect(() => {
    if (isGlimpseActive && glimpseStartedOnScroll && glimpseSettings.videoUrl && glimpseVideoRef.current) {
      glimpseVideoRef.current.muted = true;
      glimpseVideoRef.current.defaultMuted = true;
      const playPromise = glimpseVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Glimpse video autoplay prevented or video error:', err);
        });
      }
    }
  }, [isGlimpseActive, glimpseStartedOnScroll, glimpseSettings.videoUrl]);

  // Smooth scroll to hero inspection enquiry form when requested via hash
  useEffect(() => {
    if (location.hash === '#inspection-enquiry' || location.hash === '#inspection-form') {
      setTimeout(() => {
        const targetEl = document.getElementById('inspection-enquiry');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const inputEl = document.getElementById('hero-customerName');
          if (inputEl) {
            setTimeout(() => inputEl.focus(), 450);
          }
          targetEl.classList.add('ring-4', 'ring-emerald-400', 'shadow-2xl');
          setTimeout(() => targetEl.classList.remove('ring-4', 'ring-emerald-400', 'shadow-2xl'), 3000);
        }
      }, 250);
    }
  }, [location.hash]);

  // 3-Second Countdown Effect (Starts only AFTER the section is reached on scroll!)
  useEffect(() => {
    if (!glimpseStartedOnScroll || !isGlimpseActive || !glimpseSettings.isEnabled || !glimpseSettings.videoUrl) return;

    const timer = setInterval(() => {
      setGlimpseCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGlimpseActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [glimpseStartedOnScroll, isGlimpseActive, glimpseSettings.isEnabled, glimpseSettings.videoUrl]);

  // Preload Pillar Card Service Images immediately so they render with zero delay after glimpse video
  useEffect(() => {
    if (activePillarCards.length > 0) {
      activePillarCards.forEach((card) => {
        if (card.imageUrl) {
          const img = new Image();
          img.src = card.imageUrl;
        }
      });
    }
  }, [activePillarCards]);

  // Photo Banner: Letter-by-Letter Animated Services Rotator from Company Banner
  const [activePhotoServiceIndex, setActivePhotoServiceIndex] = useState(0);
  const [isPhotoServicePaused, setIsPhotoServicePaused] = useState(false);

  // Inspection Enquiry Form State (Right side of Hero Banner)
  const [enquiryForm, setEnquiryForm] = useState({
    customerName: '',
    phone: '',
    location: '',
  });
  const [enquiryErrors, setEnquiryErrors] = useState({});
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquirySubmitError, setEnquirySubmitError] = useState('');
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingEnquiry) return;

    setEnquirySubmitError('');
    const errors = {};

    if (!enquiryForm.customerName.trim()) {
      errors.customerName = 'Customer or company name is required.';
    } else if (enquiryForm.customerName.trim().length < 2) {
      errors.customerName = 'Please enter at least 2 characters.';
    }

    if (!enquiryForm.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(enquiryForm.phone.trim())) {
      errors.phone = 'Accept exactly 10 digits for Indian mobile numbers.';
    }

    if (!enquiryForm.location.trim()) {
      errors.location = 'Property location or area is required.';
    } else if (enquiryForm.location.trim().length < 2) {
      errors.location = 'Please enter property location or area.';
    }

    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      return;
    }

    setEnquiryErrors({});
    setIsSubmittingEnquiry(true);

    try {
      const activeBannerTitle = displayBanners[activeBannerIndex % displayBanners.length]?.title;
      const res = await fetchApi('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          customerName: enquiryForm.customerName.trim(),
          phone: enquiryForm.phone.trim(),
          location: enquiryForm.location.trim(),
          serviceRequired: activeBannerTitle || 'Waterproofing Solutions',
          problemDescription: `Inspection requested from homepage banner form for property at ${enquiryForm.location.trim()}.`,
          consentGiven: true,
          preferredContactMethod: 'Phone',
        }),
      });

      if (res.success) {
        setSubmittedEnquiry({
          customerName: enquiryForm.customerName.trim(),
          phone: enquiryForm.phone.trim(),
          location: enquiryForm.location.trim(),
        });
        setEnquirySuccess(true);
        setEnquiryForm({ customerName: '', phone: '', location: '' });
      } else {
        setEnquirySubmitError(res.message || 'Unable to submit inspection request. Please try again or reach us via WhatsApp.');
      }
    } catch (err) {
      console.error('Inspection form submit error:', err);
      setEnquirySubmitError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  // Track viewport scroll progress percentage (0 - 100%) and back-to-top trigger
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
        setScrollProgress(progress);
      }
      setShowBackToTop(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    Promise.all([
      fetchApi('/settings'),
      fetchApi('/services'),
      fetchApi('/projects?limit=50'),
      fetchApi('/reviews'),
    ])
      .then(([settingsRes, servicesRes, projectsRes, reviewsRes]) => {
        if (settingsRes.success && settingsRes.data) {
          setSettings(settingsRes.data);
          if (settingsRes.data.homePageContent && Object.keys(settingsRes.data.homePageContent).length > 0) {
            const merged = { ...DEFAULT_HOME_CONTENT, ...settingsRes.data.homePageContent };
            setHomeContent(merged);
          }
        }
        if (servicesRes.success && Array.isArray(servicesRes.data)) {
          setServices(servicesRes.data);
        }
        if (projectsRes.success && Array.isArray(projectsRes.data)) {
          const sorted = [...projectsRes.data].sort((a, b) => {
            const orderA = typeof a.order === 'number' && a.order > 0 ? a.order : 999999;
            const orderB = typeof b.order === 'number' && b.order > 0 ? b.order : 999999;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.completionDate || b.createdAt || 0) - new Date(a.completionDate || a.createdAt || 0);
          });
          setFeaturedProjects(sorted);
          setAllProjects(sorted);
        }
        if (reviewsRes.success && reviewsRes.data?.reviews) {
          setReviews(reviewsRes.data.reviews.slice(0, 3));
        }
      })
      .catch((err) => console.error('Error loading homepage data:', err))
      .finally(() => setContentReady(true));

    // Fetch admin-managed transformations for Proven Transformation section
    fetchApi('/transformations')
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setAdminTransformations(res.data.filter((t) => t.isActive !== false));
        }
      })
      .catch(() => {});

    // Fetch dynamic pillar cards configured in Admin
    fetchApi('/pillar-cards')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPillarCards(res.data);
        }
      })
      .catch(() => {});

    // Fetch glimpse video settings configured in Admin
    fetchApi('/pillar-cards/glimpse-settings')
      .then((res) => {
        if (res.success && res.data) {
          setGlimpseSettings((prev) => {
            const effectiveVideoUrl = res.data.videoUrl?.trim() ? res.data.videoUrl : prev.videoUrl;
            return { ...prev, ...res.data, videoUrl: effectiveVideoUrl };
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadBanners = () => {
      fetchApi('/banners')
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setBanners(res.data);
            try {
              localStorage.setItem('sln_cached_banners', JSON.stringify(res.data));
            } catch {}
          }
        })
        .catch((err) => console.error('Error loading homepage banners:', err));
    };

    loadBanners();
    window.addEventListener('sln_banners_updated', loadBanners);
    return () => window.removeEventListener('sln_banners_updated', loadBanners);
  }, []);

  // Real-time synchronization for projects, services, and transformations from Admin API
  useEffect(() => {
    const syncData = () => {
      // 1. Projects
      fetchApi('/projects?limit=50')
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            const sorted = [...res.data].sort((a, b) => {
              const orderA = typeof a.order === 'number' && a.order > 0 ? a.order : 999999;
              const orderB = typeof b.order === 'number' && b.order > 0 ? b.order : 999999;
              if (orderA !== orderB) return orderA - orderB;
              return new Date(b.completionDate || b.createdAt || 0) - new Date(a.completionDate || a.createdAt || 0);
            });
            setFeaturedProjects(sorted);
            setAllProjects(sorted);
          }
        })
        .catch(() => {});

      // 2. Services
      fetchApi('/services')
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setServices(res.data);
          }
        })
        .catch(() => {});

      // 3. Admin Transformations
      fetchApi('/transformations')
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setAdminTransformations(res.data.filter((t) => t.isActive !== false));
          }
        })
        .catch(() => {});

      // 4. Pillar Cards
      fetchApi('/pillar-cards')
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setPillarCards(res.data);
          }
        })
        .catch(() => {});

      // 5. Glimpse Video Settings
      fetchApi('/pillar-cards/glimpse-settings')
        .then((res) => {
          if (res.success && res.data) {
            setGlimpseSettings((prev) => ({ ...prev, ...res.data }));
            if (res.data.isEnabled !== false && res.data.videoUrl) {
              setIsGlimpseActive(true);
              setGlimpseCountdown(Math.ceil(res.data.durationSeconds || 3));
            }
          }
        })
        .catch(() => {});

      // 6. Refresh Company Settings & Home Content
      fetchApi('/settings')
        .then((res) => {
          if (res.success && res.data) {
            setSettings(res.data);
            if (res.data.homePageContent) {
              setHomeContent((prev) => ({ ...DEFAULT_HOME_CONTENT, ...prev, ...res.data.homePageContent }));
            }
          }
        })
        .catch(() => {});

      // 7. Trust Metrics
      fetchApi('/trust-metrics')
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setTrustMetrics(res.data);
          }
        })
        .catch(() => {});
    };

    const handleSettingsUpdate = (e) => {
      if (e.detail) setSettings(e.detail);
    };

    const handleStorage = (e) => {
      if (e.key === 'sln_projects_sync' || e.key === 'sln_services_sync') {
        syncData();
      }
    };

    window.addEventListener('sln_projects_updated', syncData);
    window.addEventListener('sln_services_updated', syncData);
    window.addEventListener('sln_transformations_updated', syncData);
    window.addEventListener('sln_pillar_cards_updated', syncData);
    window.addEventListener('sln_glimpse_video_updated', syncData);
    window.addEventListener('sln_home_content_updated', syncData);
    window.addEventListener('sln_settings_updated', handleSettingsUpdate);
    window.addEventListener('focus', syncData);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('sln_projects_updated', syncData);
      window.removeEventListener('sln_services_updated', syncData);
      window.removeEventListener('sln_transformations_updated', syncData);
      window.removeEventListener('sln_pillar_cards_updated', syncData);
      window.removeEventListener('sln_glimpse_video_updated', syncData);
      window.removeEventListener('sln_home_content_updated', syncData);
      window.removeEventListener('sln_settings_updated', handleSettingsUpdate);
      window.removeEventListener('focus', syncData);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    fetchApi('/trust-metrics')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTrustMetrics(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const activeBannersList = Array.isArray(banners) ? banners.filter((b) => b.isActive !== false) : [];
  const displayBanners = activeBannersList.length > 0 ? activeBannersList : DEFAULT_BANNERS;

  // Centralized Banner Switcher with Outgoing/Incoming State Tracking for Left-to-Right Paper Animation
  const handleBannerSelect = useCallback((nextIdxOrUpdater) => {
    if (!displayBanners || displayBanners.length === 0) return;
    setActiveBannerIndex((currentIndex) => {
      const total = displayBanners.length;
      const currentResolved = ((currentIndex % total) + total) % total;
      const targetIndex = typeof nextIdxOrUpdater === 'function' ? nextIdxOrUpdater(currentIndex) : nextIdxOrUpdater;
      const targetResolved = ((targetIndex % total) + total) % total;
      if (currentResolved !== targetResolved) {
        setPrevBannerIndex(currentResolved);
      }
      return targetResolved;
    });
  }, [displayBanners]);

  useEffect(() => {
    if (displayBanners.length < 2 || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const currentBanner = displayBanners[activeBannerIndex % displayBanners.length];
    const isLogo = isLogoBanner(currentBanner);
    const duration = currentBanner?.durationSeconds
      ? currentBanner.durationSeconds * 1000
      : isLogo
      ? 5500
      : 7500;

    const timer = window.setTimeout(() => {
      handleBannerSelect((index) => index + 1);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeBannerIndex, displayBanners, isPaused, handleBannerSelect]);

  useEffect(() => {
    setPrevBannerIndex(null);
    setActiveBannerIndex(0);
  }, [banners]);

  // Cleanly clear outgoing banner underlay and paper curl transition after 2300ms
  useEffect(() => {
    if (prevBannerIndex !== null) {
      const timer = setTimeout(() => {
        setPrevBannerIndex(null);
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [prevBannerIndex, activeBannerIndex]);

  // High-performance IntersectionObserver for scroll animations
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const revealSelectors =
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-blur, .scroll-reveal-pop, .scroll-reveal-fade-up, .scroll-reveal-card';

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
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      },
    );

    const observeNew = () => {
      document.querySelectorAll(revealSelectors).forEach((el) => {
        if (!el.classList.contains('is-revealed')) observer.observe(el);
      });
    };

    observeNew();
    const frame = window.requestAnimationFrame(observeNew);
    const timer = setTimeout(observeNew, 400);

    return () => {
      window.cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [services.length, featuredProjects.length, reviews.length, allProjects.length, banners.length, contentReady]);

  const phone = settings?.phone || '+91 8977668776';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;
  const googleReviewUrl =
    settings?.googleReviewUrl && !settings.googleReviewUrl.includes('sln-engineers-review') && !settings.googleReviewUrl.includes('slnengineers/review')
      ? settings.googleReviewUrl
      : 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';
  const logoUrl = settings?.logoUrl || '/sln-logo.png';
  const brandNameLine1 = settings?.brandNameLine1 || 'SLN ENGINEERS';
  const brandNameLine2 = settings?.brandNameLine2 || 'PROJECTS PVT. LTD.';
  const logoNameColor = settings?.logoNameColor || '#029746';
  const activeBanner = displayBanners[activeBannerIndex % displayBanners.length];
  const activeBannerIsLogo = isLogoBanner(activeBanner);

  // Active Discipline Pillar selected by user for Proven Transformation (Section 3)
  // Options: 'waterproofing', 'painting', 'repairs', 'false-ceiling'
  const [selectedDisciplinePillar, setSelectedDisciplinePillar] = useState('waterproofing');

  // Align active discipline pillar with the admin's Featured Spotlight showcase on load
  useEffect(() => {
    if (allProjects.length > 0) {
      const feat = allProjects.find((p) => p.isFeatured && p.isPublished !== false);
      if (feat?.disciplineId) {
        setSelectedDisciplinePillar(feat.disciplineId);
      }
    }
  }, [allProjects]);

  // Helper to retrieve Before & After transformation media for ANY service
  const getServiceTransformation = useCallback(
    (service) => {
      if (!service) return DEFAULT_TRANSFORMATIONS[0];

      // 1. Direct before/after defined on the service
      if (service.beforeMediaUrl && service.afterMediaUrl) {
        return {
          beforeImage: service.beforeMediaUrl,
          afterImage: service.afterMediaUrl,
          beforeLabel: service.beforeMediaCaption || 'Before Treatment',
          afterLabel: service.afterMediaCaption || 'After Restoration',
        };
      }
      if (
        Array.isArray(service.beforeMedia) &&
        service.beforeMedia[0]?.url &&
        Array.isArray(service.afterMedia) &&
        service.afterMedia[0]?.url
      ) {
        return {
          beforeImage: service.beforeMedia[0].url,
          afterImage: service.afterMedia[0].url,
          beforeLabel: service.beforeMedia[0].caption || 'Before Treatment',
          afterLabel: service.afterMedia[0].caption || 'After Restoration',
        };
      }

      // 2. Matching project from portfolio
      const matchedProject = allProjects.find(
        (p) =>
          p.isPublished !== false &&
          (matchesProjectService(p, service.title) ||
            matchesProjectService(p, service.category) ||
            matchesProjectService(p, service.categoryKey)) &&
          (p.beforeMedia?.[0]?.url || p.beforeMediaUrl) &&
          (p.afterMedia?.[0]?.url || p.afterMediaUrl)
      );

      if (matchedProject) {
        return {
          beforeImage: matchedProject.beforeMedia?.[0]?.url || matchedProject.beforeMediaUrl,
          afterImage: matchedProject.afterMedia?.[0]?.url || matchedProject.afterMediaUrl,
          beforeLabel:
            matchedProject.beforeMedia?.[0]?.caption ||
            matchedProject.beforeMediaCaption ||
            'Before Treatment',
          afterLabel:
            matchedProject.afterMedia?.[0]?.caption ||
            matchedProject.afterMediaCaption ||
            'After Restoration',
        };
      }

      // 3. Fallback to DEFAULT_SERVICES
      const def = DEFAULT_SERVICES.find(
        (d) =>
          d.id === service.id ||
          d._id === service._id ||
          (d.title && service.title && d.title.toLowerCase() === service.title.toLowerCase())
      );
      if (def?.beforeMediaUrl && def?.afterMediaUrl) {
        return {
          beforeImage: def.beforeMediaUrl,
          afterImage: def.afterMediaUrl,
          beforeLabel: def.beforeMediaCaption || 'Before Treatment',
          afterLabel: def.afterMediaCaption || 'After Restoration',
        };
      }

      return {
        beforeImage:
          service.beforeMediaUrl ||
          service.image ||
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        afterImage:
          service.afterMediaUrl ||
          service.coverImage ||
          service.image ||
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        beforeLabel: service.beforeMediaCaption || 'Before Treatment',
        afterLabel: service.afterMediaCaption || 'After Restoration',
      };
    },
    [allProjects]
  );

  // Dynamic Before & After Showcase pulled directly from Projects Portfolio
  const showcaseProject = useMemo(() => {
    if (!allProjects || allProjects.length === 0) return null;

    // 1. Prioritize projects with isFeatured: true, sorted by most recently starred/updated first
    const featuredList = allProjects
      .filter((p) => p.isFeatured && p.isPublished !== false)
      .sort((a, b) => (b.featuredUpdatedAt || 0) - (a.featuredUpdatedAt || 0));

    if (featuredList.length > 0) return featuredList[0];

    // 2. Fallback to any published project with before & after media
    const anyWithMedia = allProjects.find(
      (p) =>
        p.isPublished !== false &&
        (p.beforeMedia?.[0]?.url || p.beforeMediaUrl) &&
        (p.afterMedia?.[0]?.url || p.afterMediaUrl)
    );
    if (anyWithMedia) return anyWithMedia;

    return allProjects.find((p) => p.isPublished !== false) || null;
  }, [allProjects]);

  // 4 Core Discipline Pillars that drive the Proven Transformation showcase
  const displayDisciplinePillars = useMemo(() => [
    {
      id: 'waterproofing',
      name: 'Waterproofing Solutions',
      shortName: 'Waterproofing',
      tag: 'Leak Defense',
      icon: Droplets,
      accentColor: '#0284c7',
      activeGradient: 'from-sky-600 to-sky-700',
      activeBorder: 'border-sky-500 ring-2 ring-sky-300',
    },
    {
      id: 'painting',
      name: 'Interior & Exterior Painting',
      shortName: 'Painting',
      tag: 'Weather-Shield',
      icon: Paintbrush,
      accentColor: '#d97706',
      activeGradient: 'from-amber-600 to-amber-700',
      activeBorder: 'border-amber-500 ring-2 ring-amber-300',
    },
    {
      id: 'repairs',
      name: 'Building Repairs & Restoration',
      shortName: 'Building Repairs',
      tag: 'Structural Rehab',
      icon: Building2,
      accentColor: '#059669',
      activeGradient: 'from-emerald-600 to-emerald-700',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-300',
    },
    {
      id: 'false-ceiling',
      name: 'False Ceiling & Interior Work',
      shortName: 'False Ceiling',
      tag: 'Acoustic & Gypsum',
      icon: Layers,
      accentColor: '#7c3aed',
      activeGradient: 'from-purple-600 to-purple-700',
      activeBorder: 'border-purple-500 ring-2 ring-purple-300',
    },
  ], []);

  // currentTransformation: driven by admin Transformations Manager, classified by Discipline Pillar
  // Exactly ONE transformation is featured on the homepage per Discipline Pillar (selected by admin)
  const currentTransformation = useMemo(() => {
    const activePillarId = selectedDisciplinePillar || 'waterproofing';
    const activePillarObj =
      displayDisciplinePillars.find((d) => d.id === activePillarId) || displayDisciplinePillars[0];

    // ── 1. Projects Manager (primary source from /admin/projects) ──
    if (Array.isArray(allProjects) && allProjects.length > 0) {
      // Find all published projects matching this discipline pillar
      const matches = allProjects.filter((p) => {
        if (p.isPublished === false) return false;
        if (p.disciplineId && p.disciplineId.toLowerCase() === activePillarId.toLowerCase()) return true;
        if (p.disciplineName && p.disciplineName.toLowerCase().includes(activePillarObj.shortName.toLowerCase())) return true;
        if (matchesDiscipline(p, activePillarId)) return true;
        return false;
      });

      // Priority 1: Project explicitly selected as Homepage Showcase via Radio button (showOnHome === true)
      let chosen = matches.find((m) => m.showOnHome === true);

      // Priority 2: Project marked as isFeatured in this discipline pillar
      if (!chosen) {
        chosen = matches.find((m) => m.isFeatured === true);
      }

      // Priority 3: First matching project that has both before & after media
      if (!chosen) {
        chosen = matches.find(
          (m) =>
            (m.beforeMedia?.[0]?.url || m.beforeMediaUrl) &&
            (m.afterMedia?.[0]?.url || m.afterMediaUrl)
        );
      }

      // Priority 4: First matching project
      if (!chosen && matches.length > 0) {
        chosen = matches[0];
      }

      if (chosen) {
        const beforeUrl =
          chosen.beforeMedia?.[0]?.url ||
          chosen.beforeMediaUrl ||
          chosen.image ||
          DEFAULT_TRANSFORMATIONS[0].beforeImage;
        const afterUrl =
          chosen.afterMedia?.[0]?.url ||
          chosen.afterMediaUrl ||
          chosen.coverImage ||
          chosen.image ||
          DEFAULT_TRANSFORMATIONS[0].afterImage;

        return {
          _id: chosen._id || chosen.id,
          title: chosen.title,
          subtitle: chosen.disciplineName || activePillarObj.name,
          location: chosen.location || 'Medipally, Hyderabad',
          description: chosen.problemDescription || chosen.workPerformed || chosen.description || '',
          beforeImage: beforeUrl,
          afterImage: afterUrl,
          beforeLabel: chosen.beforeMedia?.[0]?.caption || chosen.beforeMediaCaption || 'Before Treatment',
          afterLabel: chosen.afterMedia?.[0]?.caption || chosen.afterMediaCaption || 'After Restoration',
          caseStudySlug: chosen.slug || '',
          isFeatured: Boolean(chosen.isFeatured),
        };
      }
    }

    // ── 2. Fallback: Admin Transformations Manager ──
    if (adminTransformations.length > 0) {
      const matches = adminTransformations.filter((t) => {
        if (t.isActive === false) return false;
        if (t.disciplineId && t.disciplineId.toLowerCase() === activePillarId.toLowerCase()) return true;
        if (t.disciplineName && t.disciplineName.toLowerCase().includes(activePillarObj.shortName.toLowerCase())) return true;
        if (matchesDiscipline(t, activePillarId)) return true;
        return false;
      });

      let chosen = matches.find((m) => m.showOnHome === true) || matches.find((m) => m.isFeatured === true) || matches[0];
      if (chosen) {
        return {
          _id: chosen._id || chosen.id,
          title: chosen.title,
          subtitle: chosen.disciplineName || activePillarObj.name,
          location: chosen.location || 'Medipally, Hyderabad',
          description: chosen.description || '',
          beforeImage: chosen.beforeImage,
          afterImage: chosen.afterImage,
          beforeLabel: chosen.beforeLabel || 'Before Treatment',
          afterLabel: chosen.afterLabel || 'After Restoration',
          caseStudySlug: chosen.caseStudySlug || '',
          isFeatured: Boolean(chosen.isFeatured),
        };
      }
    }

    // ── 2. Fallback: match from active services by discipline ──
    const list = Array.isArray(services) ? services : [];
    const match = list.find(
      (s) => matchesDiscipline(s, activePillarId) && s.publicationStatus !== false && s.isActive !== false
    );
    if (match) {
      const trans = getServiceTransformation(match);
      return {
        _id: match._id || match.id,
        title: match.title,
        subtitle: activePillarObj.name,
        location: match.location || 'Medipally, Hyderabad',
        description: match.description || match.shortDescription || '',
        beforeImage: trans.beforeImage,
        afterImage: trans.afterImage,
        beforeLabel: trans.beforeLabel,
        afterLabel: trans.afterLabel,
        caseStudySlug: match.slug,
      };
    }

    // ── 3. Fallback: showcase project ──
    if (showcaseProject) {
      const beforeUrl =
        showcaseProject.beforeMedia?.[0]?.url ||
        showcaseProject.beforeMediaUrl ||
        showcaseProject.image ||
        DEFAULT_TRANSFORMATIONS[0].beforeImage;
      const afterUrl =
        showcaseProject.afterMedia?.[0]?.url ||
        showcaseProject.afterMediaUrl ||
        showcaseProject.coverImage ||
        showcaseProject.image ||
        DEFAULT_TRANSFORMATIONS[0].afterImage;
      return {
        _id: showcaseProject._id || showcaseProject.id,
        title: showcaseProject.title,
        subtitle: activePillarObj.name,
        location: showcaseProject.location || 'Medipally, Hyderabad',
        description: showcaseProject.problemDescription || showcaseProject.workPerformed || '',
        beforeImage: beforeUrl,
        afterImage: afterUrl,
        beforeLabel: showcaseProject.beforeMediaCaption || 'Before Treatment',
        afterLabel: showcaseProject.afterMediaCaption || 'After Restoration',
        caseStudySlug: showcaseProject.slug,
      };
    }

    return DEFAULT_TRANSFORMATIONS[0];
  }, [selectedDisciplinePillar, displayDisciplinePillars, allProjects, adminTransformations, services, showcaseProject, getServiceTransformation]);

  // Dynamic Services list (all active/published)
  const displayServices = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    const featured = list
      .filter((s) => s.isFeatured && s.publicationStatus !== false && s.isActive !== false)
      .sort((a, b) => (b.featuredUpdatedAt || 0) - (a.featuredUpdatedAt || 0));

    if (featured.length >= 3) return featured.slice(0, 3);

    const waterproofing = list.filter(
      (s) =>
        matchesDiscipline(s, 'waterproofing') &&
        s.publicationStatus !== false &&
        s.isActive !== false &&
        !featured.some((f) => (f._id || f.id) === (s._id || s.id))
    );
    const combined = [...featured, ...waterproofing];
    if (combined.length >= 3) return combined.slice(0, 3);

    const remaining = list.filter(
      (s) =>
        s.publicationStatus !== false &&
        s.isActive !== false &&
        !combined.some((c) => (c._id || c.id) === (s._id || s.id))
    );
    return [...combined, ...remaining].slice(0, 3);
  }, [services]);

  // Dynamic Featured Projects for Section 7 (Up to 3 cards on homepage, 1 per Discipline Pillar)
  const displayFeaturedProjects = useMemo(() => {
    const list = Array.isArray(allProjects) ? allProjects : [];

    const pillarKeys = ['waterproofing', 'painting', 'repairs', 'false-ceiling'];

    const getDisciplineKey = (project) => {
      const disc = String(
        project.disciplineId || project.disciplineName || project.serviceCategory || ''
      ).toLowerCase();
      if (disc.includes('paint')) return 'painting';
      if (disc.includes('repair') || disc.includes('restor')) return 'repairs';
      if (disc.includes('ceil') || disc.includes('interior')) return 'false-ceiling';
      return 'waterproofing';
    };

    // 1. Published projects marked as Featured (isFeatured: true), sorted by most recently featured
    const featuredProjects = list
      .filter((p) => p.isFeatured && p.isPublished !== false)
      .sort((a, b) => (b.featuredUpdatedAt || 0) - (a.featuredUpdatedAt || 0));

    const selectedProjects = [];
    const usedDisciplineKeys = new Set();

    // First pass: add featured projects (ensuring at most 1 per discipline pillar)
    for (const proj of featuredProjects) {
      if (selectedProjects.length >= 3) break;
      const key = getDisciplineKey(proj);
      if (!usedDisciplineKeys.has(key)) {
        usedDisciplineKeys.add(key);
        selectedProjects.push(proj);
      }
    }

    // Second pass: if fewer than 3, fill from unrepresented discipline pillars using published projects
    if (selectedProjects.length < 3) {
      const publishedProjects = list.filter(
        (p) => p.isPublished !== false && !selectedProjects.some((s) => (s._id || s.id) === (p._id || p.id))
      );

      for (const pillar of pillarKeys) {
        if (selectedProjects.length >= 3) break;
        if (!usedDisciplineKeys.has(pillar)) {
          const match = publishedProjects.find((p) => getDisciplineKey(p) === pillar);
          if (match) {
            usedDisciplineKeys.add(pillar);
            selectedProjects.push(match);
          }
        }
      }

      // If still under 3, fill with remaining published projects
      for (const proj of publishedProjects) {
        if (selectedProjects.length >= 3) break;
        if (!selectedProjects.some((s) => (s._id || s.id) === (proj._id || proj.id))) {
          selectedProjects.push(proj);
        }
      }
    }

    return selectedProjects.slice(0, 3);
  }, [allProjects]);

  const combinedHomeReviews = useMemo(() => {
    // 1. Prioritize reviews explicitly marked with showOnHome: true (up to 3)
    const homeSelected = (reviews || []).filter((r) => r.showOnHome);
    const list = [...homeSelected];

    // 2. If fewer than 3 reviews are marked for home, fill with default reviews to keep the 3-column grid complete
    if (list.length < 3) {
      DEFAULT_HOME_REVIEWS.forEach((def) => {
        if (list.length < 3 && !list.some((r) => r.customerName === def.customerName)) {
          list.push(def);
        }
      });
    }

    return list.slice(0, 3);
  }, [reviews]);
  const heroCopy = activeBanner ? getBannerCopy(activeBanner) : basementBannerCopy;

  const companyLogoBanner = displayBanners.find((b) => isLogoBanner(b)) || displayBanners[0];

  const companyServices = (companyLogoBanner?.bannerServices && companyLogoBanner.bannerServices.length > 0)
    ? companyLogoBanner.bannerServices
    : CORE_FOUR_SERVICES;

  const currentPhotoService = companyServices[activePhotoServiceIndex % companyServices.length] || companyServices[0];
  const CurrentPhotoServiceIcon = resolveBannerServiceIcon(currentPhotoService?.icon);

  // Auto-transition services letter-by-letter one after another on photo banner
  useEffect(() => {
    if (isPhotoServicePaused || !companyServices.length || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      return undefined;
    }
    const currentName = companyServices[activePhotoServiceIndex % companyServices.length]?.name || '';
    const charCount = currentName.length || 15;
    const holdDuration = Math.max(2800, charCount * 45 + 2400);

    const timer = setTimeout(() => {
      setActivePhotoServiceIndex((prev) => (prev + 1) % companyServices.length);
    }, holdDuration);

    return () => clearTimeout(timer);
  }, [activePhotoServiceIndex, isPhotoServicePaused, companyServices.length]);

  const pillarsContent = homeContent?.pillarsSection || DEFAULT_HOME_CONTENT.pillarsSection;
  const transformationsContent = homeContent?.transformationsSection || DEFAULT_HOME_CONTENT.transformationsSection;
  const caseStudiesContent = homeContent?.caseStudiesSection || DEFAULT_HOME_CONTENT.caseStudiesSection;
  const lineageContent = homeContent?.lineageSection || DEFAULT_HOME_CONTENT.lineageSection;
  const reviewsContent = homeContent?.reviewsSection || DEFAULT_HOME_CONTENT.reviewsSection;
  const bottomCtaContent = homeContent?.bottomCtaSection || DEFAULT_HOME_CONTENT.bottomCtaSection;

  return (
    <div className="home-page bg-white relative">
      {/* Scroll Progress Indicator Bar */}
      <div
        className="scroll-progress-indicator"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      {/* 1. HERO SECTION */}
      <section className="home-hero hero-bg-animated relative bg-[#04152b] text-white overflow-hidden pt-10 sm:pt-12 pb-0 home-hero-has-banner">
        {displayBanners.map((banner, index) => {
          const isActive = index === (activeBannerIndex % displayBanners.length);
          const isPrev = !isActive && prevBannerIndex !== null && index === (prevBannerIndex % displayBanners.length);
          const isLogo = isLogoBanner(banner);

          if (isLogo) {
            const watermarkLogoSrc = banner.imageUrl || logoUrl;
            return (
              <div
                key={banner._id || index}
                className={`home-hero-logo-banner-bg ${isActive ? 'is-active' : ''} ${isPrev ? 'is-prev' : ''} ${
                  isActive && prevBannerIndex !== null ? 'paper-turning' : ''
                }`}
                aria-hidden={!isActive}
              >
                <div className="home-logo-banner-grid-overlay" />
                <div className="home-logo-banner-ambient-glow bg-emerald-500/10" />
                <div className="home-logo-banner-ambient-glow !left-[65%] !top-[50%] bg-sky-500/10" />
                <div className="home-logo-banner-watermark-center">
                  <img
                    src={watermarkLogoSrc}
                    alt={brandNameLine1}
                    onError={(e) => {
                      e.currentTarget.src = '/sln-logo.png';
                    }}
                  />
                </div>
              </div>
            );
          }
          return (
            <div
              key={banner._id || index}
              className={`home-hero-photo-banner-wrapper ${isActive ? 'is-active' : ''} ${isPrev ? 'is-prev' : ''} ${
                isActive && prevBannerIndex !== null ? 'paper-turning' : ''
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={banner.imageUrl || 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431959/sln_waterproofing/banners/fam7jmcpaoxskw7hside.jpg'}
                alt={banner.altText || banner.title || 'Waterproofing Project'}
                decoding="async"
                fetchPriority="high"
                loading="eager"
                className="home-hero-banner-image"
                onError={(e) => {
                  e.currentTarget.src = 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431959/sln_waterproofing/banners/fam7jmcpaoxskw7hside.jpg';
                }}
              />
              <div className="home-hero-banner-overlay" aria-hidden="true" />
            </div>
          );
        })}

        {/* Dynamic Paper Curl & Crease Edge: Sweeps from Left to Right during slide transformation */}
        {prevBannerIndex !== null && (
          <div
            key={`paper-curl-${activeBannerIndex}`}
            className="home-paper-curl-edge"
            aria-hidden="true"
          />
        )}

        <div className="container relative z-10 pb-8 sm:pb-12 lg:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT COLUMN: Service Banner Content */}
            <div className="lg:col-span-6 xl:col-span-6 home-hero-copy-banner flex flex-col justify-center">
              <div key={`hero-slide-${activeBannerIndex}`} className="home-hero-slide-enter">
                {activeBannerIsLogo ? (
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Brand Logo & Corporate Practice Hero Showcase */}
                    <div className="home-logo-anim-brand-hero flex items-center gap-2.5 sm:gap-5 flex-nowrap min-w-0">
                      {/* High-Impact Logo Emblem Card */}
                      <div className="relative group shrink-0">
                        <div className="absolute -inset-1 sm:-inset-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-sky-500/20 to-emerald-500/30 blur-md opacity-80 group-hover:opacity-100 transition duration-500" />
                        <div className="relative w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-white p-1 sm:p-2.5 border border-slate-200/90 shadow-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={activeBanner?.imageUrl || logoUrl}
                            alt={brandNameLine1}
                            className="w-full h-full object-contain filter drop-shadow-xs"
                            onError={(e) => {
                              e.currentTarget.src = '/sln-logo.png';
                            }}
                          />
                        </div>
                      </div>

                      {/* Brand Identity & Distinction Lockup */}
                      <div className="flex flex-col justify-center min-w-0 flex-1">
                        {/* Eyebrow & Credential Badges */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5 sm:mb-1">
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] sm:text-[11px] font-bold text-white shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="tracking-wide uppercase">Official Corporate Practice</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-800 shadow-2xs">
                            <ShieldCheck size={11} className="text-emerald-600 sm:w-3 sm:h-3" />
                            <span>ISO 9001:2015 Practice</span>
                          </span>
                        </div>

                        {/* Primary Brand Name Display */}
                        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap leading-tight">
                          <span
                            style={{ color: logoNameColor }}
                            className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight font-heading"
                          >
                            {brandNameLine1}
                          </span>
                          <span className="text-[11px] sm:text-sm font-extrabold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-slate-700 font-heading">
                            {brandNameLine2}
                          </span>
                        </div>

                        {/* Tagline / Subtitle */}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] sm:text-[13px] font-semibold text-emerald-700 truncate">
                            {heroCopy.eyebrow || 'All 4 Specializations Under One Roof'}
                          </span>
                          <span className="text-slate-300 hidden sm:inline">•</span>
                          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                            Restoration for Three Generations
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="home-logo-anim-desc text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
                      {heroCopy.description}
                    </p>

                    {/* All 4 Services Capability Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
                      {(activeBanner?.bannerServices && activeBanner.bannerServices.length > 0
                        ? activeBanner.bannerServices
                        : CORE_FOUR_SERVICES
                      ).map((service, sIdx) => {
                        const SIcon = resolveBannerServiceIcon(service.icon);
                        const accent = service.accentColor || '#38bdf8';
                        const navPath = getServiceNavigationPath(service);
                        return (
                          <Link
                            key={service._id || service.id || sIdx}
                            to={navPath}
                            className="home-all-service-card-light group cursor-pointer block no-underline transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                              borderColor: `${accent}35`,
                            }}
                            title={`Explore ${service.name}`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3 relative z-10">
                              <div
                                className="service-icon-box w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                style={{
                                  backgroundColor: `${accent}16`,
                                  color: accent,
                                  border: `1px solid ${accent}40`,
                                }}
                              >
                                <SIcon size={16} className="sm:w-[17px] sm:h-[17px]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate">
                                    {service.name}
                                  </h3>
                                  <ChevronRight size={13} className="service-chevron text-slate-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </div>
                                <p className="text-[10.5px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                                  {service.shortCategory}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="home-photo-hero-card space-y-2.5 sm:space-y-3">
                    {/* Concise Discipline & Standards Micro-Badge */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/35 text-sky-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="truncate max-w-[200px] sm:max-w-none">{activeBanner?.tag || heroCopy?.eyebrow || 'Precision Engineering'}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                        <ShieldCheck size={11} className="text-emerald-400" />
                        <span>IS Compliant</span>
                      </span>
                    </div>

                    {/* Impactful Headline — Balanced & Crisp (Does Not Dominate Photo) */}
                    <h1 className="home-hero-title font-black tracking-tight text-white leading-snug text-xl sm:text-2xl lg:text-3xl">
                      <span>{heroCopy.headline}</span>{' '}
                      <span className="home-hero-gradient">{heroCopy.highlightedHeadline}</span>
                    </h1>

                    {/* Dedicated Responsive Banner Photo Showcase for Mobile & Tablet (< 1024px) */}
                    <div className="home-mobile-banner-img-container lg:hidden relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/80 my-2 aspect-[16/10] sm:aspect-[16/9]">
                      <img
                        src={activeBanner?.imageUrl || 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431959/sln_waterproofing/banners/fam7jmcpaoxskw7hside.jpg'}
                        alt={activeBanner?.altText || activeBanner?.title || 'Waterproofing Project'}
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431959/sln_waterproofing/banners/fam7jmcpaoxskw7hside.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />

                      {/* Floating Micro-Badge on Mobile Image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="truncate max-w-[220px] sm:max-w-none">{activeBanner?.tag || heroCopy?.eyebrow || 'Precision Engineering'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Concise Engineering Description */}
                    <p className="font-normal text-slate-200/90 leading-relaxed text-xs sm:text-sm">
                      {heroCopy.description}
                    </p>
                  </div>
                )}
              </div>

              {/* UNIFIED BOTTOM BANNER CONTROLS (BUTTON + LABEL IN SAME PILL, NO OVERLAP) */}
              <div
                className={`home-banner-controls mt-3.5 sm:mt-5 select-none ${activeBannerIsLogo ? 'is-logo-active' : ''}`}
                aria-label="Homepage banners"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
              >
                {/* 1. Slide Counter Badge: 01 / 03 */}
                <div
                  className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full font-mono font-black text-[10px] sm:text-[11px] tracking-wider shrink-0 border ${
                    activeBannerIsLogo
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-sky-500/20 border-sky-400/30 text-sky-300'
                  }`}
                >
                  <span>{String((activeBannerIndex % displayBanners.length) + 1).padStart(2, '0')}</span>
                  <span className="opacity-40">/</span>
                  <span className="opacity-70">{String(displayBanners.length).padStart(2, '0')}</span>
                </div>

                {/* Vertical Divider (shown on desktop & tablet) */}
                <span className="home-banner-divider hidden sm:inline-block shrink-0" />

                {/* Glowing Status Dot (shown on desktop & tablet) */}
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 hidden sm:inline-block ${
                    activeBannerIsLogo ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400 animate-pulse'
                  }`}
                />

                {/* 2. Slide Title Label (desktop & tablet only - hidden on mobile to prevent ugly truncation) */}
                <span className="home-banner-caption font-bold text-xs sm:text-[13px] tracking-wide text-slate-100 truncate hidden sm:inline-block max-w-[160px] sm:max-w-xs md:max-w-sm">
                  {displayBanners[activeBannerIndex % displayBanners.length]?.title ||
                    (activeBannerIsLogo ? 'All Specialized Services & Company Overview' : 'Precision Waterproofing & Structural Defense')}
                </span>

                {displayBanners.length > 1 && (
                  <>
                    {/* Vertical Divider */}
                    <span className="home-banner-divider shrink-0 opacity-40 sm:opacity-100" />

                    {/* 3. Slide Pagination Dots */}
                    <div className="flex items-center gap-1 sm:gap-1.5 px-0.5 shrink-0" aria-label="Choose banner">
                      {displayBanners.map((banner, index) => (
                        <button
                          key={banner._id || index}
                          type="button"
                          onClick={() => handleBannerSelect(index)}
                          aria-label={`Show banner ${index + 1}: ${banner.title}`}
                          aria-current={index === (activeBannerIndex % displayBanners.length) ? 'true' : undefined}
                          className={`home-banner-dot ${
                            index === (activeBannerIndex % displayBanners.length) ? 'is-active' : ''
                          }`}
                        />
                      ))}
                    </div>

                    {/* 4. Arrow Prev/Next Side Buttons */}
                    <div className="flex items-center gap-1 shrink-0 ml-0.5 sm:ml-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleBannerSelect((idx) => idx - 1)
                        }
                        aria-label="Previous banner"
                        className="home-banner-side-btn w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border border-white/15 bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-105 active:scale-95"
                        title="Previous Slide"
                      >
                        <ChevronLeft size={13} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBannerSelect((idx) => idx + 1)}
                        aria-label="Next banner"
                        className="home-banner-side-btn w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border border-white/15 bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-105 active:scale-95"
                        title="Next Slide"
                      >
                        <ChevronRight size={13} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Polished Inspection Enquiry Form */}
            <div id="inspection-enquiry" className="lg:col-span-6 xl:col-span-5 xl:col-start-8 w-full relative scroll-mt-28 sm:scroll-mt-32 transition-all duration-300 rounded-2xl">
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
                      fill="url(#wave-grad-1)"
                    />
                    <defs>
                      <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
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
                      fill="url(#wave-grad-2)"
                    />
                    <defs>
                      <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
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
                      stroke="url(#crest-grad)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="crest-grad" x1="0%" y1="0%" x2="100%" y2="0%">
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

                <div className="p-4 sm:p-6 lg:p-6 xl:p-7 relative z-10">
                  {/* Brand Header Lockup based on Logo & Logo Name */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/90">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ borderColor: `${logoNameColor}30` }}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 border shadow-xs flex items-center justify-center shrink-0"
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
                        <span className="text-[10px] text-slate-500 font-bold tracking-wider">
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider"
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: logoNameColor }} />
                      <span>Inspection</span>
                    </div>
                  </div>

                  {enquirySuccess && submittedEnquiry ? (
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
                          Thank you, <strong className="text-slate-900">{submittedEnquiry.customerName}</strong>! Our structural engineer from <strong style={{ color: logoNameColor }}>{brandNameLine1}</strong> will call you shortly on <strong className="text-slate-900 font-bold">+91 {submittedEnquiry.phone}</strong> to schedule the on-site inspection for <strong className="text-slate-900">{submittedEnquiry.location}</strong>.
                        </p>
                      </div>
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEnquirySuccess(false);
                            setSubmittedEnquiry(null);
                          }}
                          className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-4 rounded-lg w-full sm:w-auto border border-slate-200"
                        >
                          Submit Another Request
                        </button>
                        <a
                          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(brandNameLine1)},%20I%20just%20submitted%20an%20inspection%20request%20for%20${encodeURIComponent(submittedEnquiry.location)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-whatsapp text-xs font-semibold py-2 px-4 rounded-lg w-full sm:w-auto flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle size={14} /> WhatsApp Us
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} noValidate className="space-y-3.5">
                      <div className="mb-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Request Inspection
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Direct on-site engineering assessment &amp; moisture survey.
                        </p>
                      </div>

                      {enquirySubmitError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="flex-1 font-medium">{enquirySubmitError}</span>
                        </div>
                      )}

                      {/* 1. Customer / Company Name */}
                      <div>
                        <label htmlFor="hero-customerName" className="block text-xs font-bold text-slate-700 mb-1.5">
                          Customer / Company Name <span className="text-amber-500">*</span>
                        </label>
                        <div
                          className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 ${
                            enquiryErrors.customerName
                              ? 'border-rose-400 ring-1 ring-rose-400/20'
                              : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                          }`}
                        >
                          <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor || '#029746' }}>
                            <User size={15} />
                          </span>
                          <input
                            id="hero-customerName"
                            type="text"
                            value={enquiryForm.customerName}
                            onChange={(e) => {
                              setEnquiryForm({ ...enquiryForm, customerName: e.target.value });
                              if (enquiryErrors.customerName) {
                                setEnquiryErrors({ ...enquiryErrors, customerName: '' });
                              }
                            }}
                            placeholder="Customer or company name"
                            className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none"
                          />
                        </div>
                        {enquiryErrors.customerName && (
                          <p className="text-[11px] text-rose-600 mt-1 font-medium">
                            {enquiryErrors.customerName}
                          </p>
                        )}
                      </div>

                      {/* 2. Phone Number */}
                      <div>
                        <label htmlFor="hero-phone" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span>Phone Number <span className="text-amber-500">*</span></span>
                          <span className="text-[10px] text-slate-400 font-normal">10-digit Indian Mobile</span>
                        </label>
                        <div
                          className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 overflow-hidden ${
                            enquiryErrors.phone
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
                            id="hero-phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={enquiryForm.phone}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setEnquiryForm({ ...enquiryForm, phone: digits });
                              if (enquiryErrors.phone) {
                                setEnquiryErrors({ ...enquiryErrors, phone: '' });
                              }
                            }}
                            placeholder="10-digit mobile number"
                            className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none"
                          />
                        </div>
                        {enquiryErrors.phone && (
                          <p className="text-[11px] text-rose-600 mt-1 font-medium">
                            {enquiryErrors.phone}
                          </p>
                        )}
                      </div>

                      {/* 3. Property Location / Area */}
                      <div>
                        <label htmlFor="hero-location" className="block text-xs font-bold text-slate-700 mb-1.5">
                          Property Location / Area <span className="text-amber-500">*</span>
                        </label>
                        <div
                          className={`relative flex items-center rounded-xl bg-slate-50/90 hover:bg-white border transition-all duration-200 ${
                            enquiryErrors.location
                              ? 'border-rose-400 ring-1 ring-rose-400/20'
                              : 'border-slate-200/90 hover:border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15 shadow-2xs'
                          }`}
                        >
                          <span className="pl-3.5 pr-1.5 flex items-center pointer-events-none shrink-0" style={{ color: logoNameColor || '#029746' }}>
                            <MapPin size={15} />
                          </span>
                          <input
                            id="hero-location"
                            type="text"
                            value={enquiryForm.location}
                            onChange={(e) => {
                              setEnquiryForm({ ...enquiryForm, location: e.target.value });
                              if (enquiryErrors.location) {
                                setEnquiryErrors({ ...enquiryErrors, location: '' });
                              }
                            }}
                            placeholder="Property location or area"
                            className="w-full pr-3.5 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none"
                          />
                        </div>
                        {enquiryErrors.location && (
                          <p className="text-[11px] text-rose-600 mt-1 font-medium">
                            {enquiryErrors.location}
                          </p>
                        )}
                      </div>

                      {/* Polished Dynamic Brand Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmittingEnquiry}
                        style={{
                          background: isSubmittingEnquiry
                            ? `${logoNameColor}cc`
                            : `linear-gradient(135deg, ${logoNameColor} 0%, #03b655 50%, ${logoNameColor} 100%)`,
                          boxShadow: `0 10px 25px -4px ${logoNameColor}45, 0 4px 10px -2px ${logoNameColor}30`,
                        }}
                        className="w-full py-3.5 px-5 rounded-xl text-white font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-105 hover:scale-[1.015] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer group"
                      >
                        {isSubmittingEnquiry ? (
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
                      <div className="pt-2.5 flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-semibold text-slate-600 truncate">
                          <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                          <span>24hr Visit</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-600 truncate">
                          <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                          <span>Zero Obligation</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-600 truncate">
                          <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                          <span>ISO Practice</span>
                        </span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EIGHT HERO TRUST METRICS TILES (DYNAMIC ADMIN CONFIGURABLE) */}
      {(() => {
        const activeItems = (Array.isArray(trustMetrics) && trustMetrics.length > 0 ? trustMetrics : DEFAULT_TRUST_METRICS)
          .filter((m) => m.isActive !== false);

        if (activeItems.length === 0) return null;

        const row1 = activeItems.slice(0, 4);
        const row2 = activeItems.slice(4);

        return (
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-3.5 sm:p-5 lg:p-6 particle-bg">
              {/* Row 1 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-center">
                {row1.map((item, idx) => {
                  const IconComp = resolveTrustIcon(item.icon);
                  return (
                    <div
                      key={item._id || idx}
                      className="flex items-center gap-2 sm:gap-3.5 px-1 sm:px-2 lg:px-4 xl:px-6 trust-metric-card transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div
                        style={{ backgroundColor: item.color || '#0284c7' }}
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                      >
                        <IconComp size={18} className="sm:hidden" />
                        <IconComp size={20} className="hidden sm:inline" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-none truncate">
                          {item.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5 sm:mt-1 line-clamp-2">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2 */}
              {row2.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-center border-t border-slate-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
                  {row2.map((item, idx) => {
                    const IconComp = resolveTrustIcon(item.icon);
                    return (
                      <div
                        key={item._id || idx + 4}
                        className="flex items-center gap-2 sm:gap-3.5 px-1 sm:px-2 lg:px-4 xl:px-6 trust-metric-card transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <div
                          style={{ backgroundColor: item.color || '#0284c7' }}
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                        >
                          <IconComp size={18} className="sm:hidden" />
                          <IconComp size={20} className="hidden sm:inline" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm sm:text-base lg:text-lg font-black text-slate-900 tracking-tight leading-tight truncate">
                            {item.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5 line-clamp-2">{item.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 2.5 CORE DISCIPLINE PILLARS: ONE HORIZONTAL BACKGROUND CARD WITH 4 CARDS */}
      <section className="py-10 sm:py-14 bg-slate-50/70 border-b border-slate-200/80 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="space-y-2 mb-6 sm:mb-8 text-center max-w-3xl mx-auto scroll-reveal">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
              <Sparkles size={13} className="text-sky-600 shrink-0" />
              <span>{pillarsContent.eyebrow || 'Specialized Civil Engineering'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {pillarsContent.title || 'Four Disciplines. One Trusted Civil Engineering Standard.'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              {pillarsContent.description ||
                'Backed by over 40 years of continuous practice across four specialized pillars. Explore our proven methodologies, authorized chemical formulations, and verified field transformations.'}
            </p>
          </div>

          {/* ONE UNIFIED HORIZONTAL BACKGROUND CARD (Scroll target for Glimpse autoplay) */}
          <div
            ref={glimpseSectionRef}
            className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-500 p-4 sm:p-6 lg:p-8 scroll-reveal-scale delay-150"
          >
            {/* Top Bar inside Background Card — Only shown when cards are visible */}
            {(!isGlimpseActive || !glimpseSettings.isEnabled) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 transition-opacity duration-500">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {pillarsContent.cardHeaderTitle || 'Execution Discipline Pillars'}
                  </span>
                  <span className="text-slate-300 hidden md:inline">•</span>
                  <span className="text-xs text-slate-500 font-medium hidden md:inline">
                    {pillarsContent.cardHeaderSubtitle || 'Click any image or pillar name to view its specialized civil engineering services'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  {glimpseSettings.isEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setGlimpseStartedOnScroll(true);
                        setIsGlimpseActive(true);
                        setGlimpseCountdown(Math.ceil(glimpseSettings.durationSeconds || 3));
                        if (glimpseVideoRef.current) {
                          glimpseVideoRef.current.currentTime = 0;
                          glimpseVideoRef.current.play().catch(() => {});
                        }
                      }}
                      className="text-[11px] font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-sky-200 transition-colors cursor-pointer shadow-2xs"
                      title="Replay civil engineering glimpse video"
                    >
                      <RotateCcw size={12} />
                      <span>Replay Glimpse Video</span>
                    </button>
                  )}
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <span>Click Card to View Services</span>
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Container: Pure Glimpse Video Layer + 4 Pillar Cards */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xs min-h-[300px] sm:min-h-[380px]">
              {/* LAYER 1: Pure Auto-Playing Glimpse Video (No text, no bar names, no time) */}
              {glimpseSettings.isEnabled && Boolean(glimpseSettings.videoUrl) && (
                <div
                  onClick={() => setIsGlimpseActive(false)}
                  className={`absolute inset-0 z-20 transition-all duration-200 ease-out flex items-center justify-center bg-slate-900 cursor-pointer ${
                    isGlimpseActive
                      ? 'opacity-100 pointer-events-auto scale-100'
                      : 'opacity-0 pointer-events-none scale-100'
                  }`}
                  title="Click to view cards"
                >
                  <video
                    ref={glimpseVideoRef}
                    key={glimpseSettings.videoUrl}
                    src={glimpseSettings.videoUrl}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={() => {
                      if (glimpseVideoRef.current) {
                        glimpseVideoRef.current.play().catch(() => {});
                      }
                    }}
                    onEnded={() => setIsGlimpseActive(false)}
                    onError={() => setIsGlimpseActive(false)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* LAYER 2: 4 Discipline Cards inside the Background Card — Side by Side Without Gap */}
              <div
                className={`transition-all duration-200 ease-out ${
                  isGlimpseActive && glimpseSettings.isEnabled && Boolean(glimpseSettings.videoUrl)
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100 pointer-events-auto'
                }`}
              >
                <div
                  className={`grid gap-0 sm:divide-x divide-slate-200/80 ${
                    activePillarCards.length === 4
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                  }`}
                >
                  {activePillarCards.map((card, idx) => {
                    const rawPillarId = (card.pillarId || card.slug || 'waterproofing').toLowerCase().trim();
                    const targetDiscipline =
                      rawPillarId === 'restoration' || rawPillarId === 'repair'
                        ? 'repairs'
                        : rawPillarId === 'ceiling' || rawPillarId === 'interiors'
                        ? 'false-ceiling'
                        : rawPillarId;

                    const isSelected = (selectedDisciplinePillar || 'waterproofing').toLowerCase() === rawPillarId;

                    return (
                      <Link
                        key={card._id || card.pillarId}
                        to={`/services?discipline=${encodeURIComponent(targetDiscipline)}&category=${encodeURIComponent(card.pillarName)}`}
                        className={`group pillar-interactive-card card-glow-hover cursor-pointer flex flex-col relative no-underline border-slate-200/80 [&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-r-0 [&:nth-child(1)]:border-b [&:nth-child(2)]:border-b sm:[&:nth-child(1)]:border-b-0 sm:[&:nth-child(2)]:border-b-0 ${
                          isSelected
                            ? 'bg-sky-50/50'
                            : 'bg-white hover:bg-slate-50/70'
                        }`}
                        title={`View ${card.pillarName} Specialized Civil Engineering Services`}
                      >
                        {/* Active Color Stripe Indicator at Top */}
                        <div
                          className={`h-1.5 w-full transition-all duration-300 ${
                            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                          }`}
                          style={{ backgroundColor: card.accentColor || '#0284c7' }}
                        />

                        {/* Photo with curved wave from mockup — Flush Edge to Edge with 0 gap */}
                        <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-slate-100 overflow-hidden">
                          <img
                            src={card.imageUrl}
                            alt={card.pillarName}
                            loading="eager"
                            fetchPriority="high"
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                        </div>

                        {/* Curved Colored Swoosh at Bottom of Photo */}
                        <svg
                          viewBox="0 0 100 16"
                          preserveAspectRatio="none"
                          className="w-full h-3 sm:h-4.5 block -mt-1 relative z-10 transition-transform duration-300 group-hover:scale-y-110"
                        >
                          <path
                            d="M0,0 Q50,16 100,0 L100,16 L0,16 Z"
                            fill={card.accentColor || '#0284c7'}
                          />
                        </svg>

                        {/* Only Discipline Pillar Name */}
                        <div className="p-3.5 sm:p-4 text-center flex items-center justify-center min-h-[58px] sm:min-h-[68px] bg-inherit">
                          <h3
                            className={`text-xs sm:text-sm lg:text-base font-extrabold transition-colors leading-snug ${
                              isSelected ? 'text-sky-700' : 'text-slate-900 group-hover:text-sky-600'
                            }`}
                          >
                            {card.pillarName}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROVEN TRANSFORMATION: SINGLE INTERACTIVE BEFORE & AFTER SHOWCASE */}
      <section id="proven-transformation-section" className="py-14 sm:py-18 bg-white relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Clean, High-Impact Summary */}
            <div className="lg:col-span-5 space-y-4 scroll-reveal-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-700 border border-sky-200/90 shadow-2xs">
                <Sparkles size={13} className="text-sky-600 shrink-0" />
                <span>{transformationsContent.eyebrow || 'Proven Transformation'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {transformationsContent.title || 'Documented Proof: Real Field Transformations'}
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {transformationsContent.description ||
                  'Every project is engineered, executed, and verified on site. Drag the slider to inspect how hydrostatic seepage, structural cracks, and weathered surfaces are permanently restored.'}
              </p>

              {/* Minimalist Project Context Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs space-y-2 card-interactive-3d hover:border-sky-300">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase bg-sky-100 text-sky-900 border border-sky-200 shadow-2xs">
                      {currentTransformation.subtitle || 'Waterproofing Solutions'}
                    </span>
                    {currentTransformation.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        <Star size={10} className="fill-amber-500 text-amber-600" /> Featured Showcase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                    <MapPin size={12} className="text-sky-600 shrink-0" />
                    <span className="truncate max-w-[160px]">{currentTransformation.location || 'Medipally, Hyderabad'}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-1">
                  {currentTransformation.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {currentTransformation.description}
                </p>
              </div>

              {/* View Transformation by Discipline Pillar — Effective & Good-Looking 2x2 Grid Below */}
              {displayDisciplinePillars.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders size={13} className="text-sky-600" />
                      <span>{transformationsContent.pillSelectorLabel || 'View Transformation by Discipline Pillar:'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tap Pillar
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {displayDisciplinePillars.map((pillar) => {
                      const isSelected = (selectedDisciplinePillar || 'waterproofing') === pillar.id;
                      const Icon = pillar.icon;
                      return (
                        <button
                          key={pillar.id}
                          type="button"
                          onClick={() => setSelectedDisciplinePillar(pillar.id)}
                          className={`p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-2.5 sm:gap-3 border duration-200 shadow-xs ${
                            isSelected
                              ? `bg-gradient-to-r ${pillar.activeGradient} text-white ${pillar.activeBorder} shadow-md scale-[1.02]`
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-white/20 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className={`block text-xs sm:text-[12.5px] font-extrabold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {pillar.shortName || pillar.name}
                            </span>
                            <span className={`text-[10px] font-semibold block mt-0.5 ${isSelected ? 'text-white/85' : 'text-slate-500'}`}>
                              {isSelected ? '● Active Showcase' : pillar.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Single High-Impact Interactive Before / After Slider */}
            <div className="lg:col-span-7 scroll-reveal-right delay-100">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950 slider-glow-frame card-3d">
                {/* Drag hint overlay at bottom left */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-slate-200 border border-white/15 shadow-lg pointer-events-none">
                  <MoveHorizontal size={12} className="text-sky-400 shrink-0" />
                  <span>Drag slider to compare</span>
                </div>

                {/* Status Badge: Bottom Right (Non-overlapping with BEFORE/AFTER badges) */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-emerald-300 border border-emerald-400/30 shadow-lg pointer-events-none">
                  <Check size={12} className="text-emerald-400 shrink-0" />
                  <span>Restored &amp; Protected</span>
                </div>

                <BeforeAfterSlider
                  beforeImage={currentTransformation.beforeImage}
                  afterImage={currentTransformation.afterImage}
                  beforeLabel={currentTransformation.beforeLabel || 'Before Treatment'}
                  afterLabel={currentTransformation.afterLabel || 'After Restoration'}
                  aspectRatio="16/10"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 4. CASE STUDIES: FEATURED COMPLETED PROJECTS (DIRECTLY BELOW PROVEN TRANSFORMATION) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 scroll-reveal">
            <div>
              <span className="text-sky-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 mb-1">
                <Sparkles size={13} /> {caseStudiesContent.eyebrow || 'Case Studies'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {caseStudiesContent.title || 'Featured Civil Engineering Case Studies'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {caseStudiesContent.description ||
                  'Real restoration projects documented with root-cause diagnostics, authorized chemical formulations, and verified results.'}
              </p>
            </div>
            <Link
              to={caseStudiesContent.ctaLink || '/projects'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#04203b] hover:bg-slate-800 shadow-xs shrink-0 self-start sm:self-auto transition-colors"
            >
              <span>{caseStudiesContent.ctaText || 'View Entire Portfolio'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayFeaturedProjects.map((project, idx) => {
              const projectId = project._id || project.id || idx;
              const activeTab = cardMediaTab[projectId] || 'cover';
              const beforeUrl = project.beforeMedia?.[0]?.url;
              const afterUrl = project.afterMedia?.[0]?.url;
              const coverUrl = project.image || project.coverImage;

              const activeImgUrl =
                activeTab === 'before' && beforeUrl
                  ? beforeUrl
                  : activeTab === 'after' && afterUrl
                  ? afterUrl
                  : (coverUrl || afterUrl || beforeUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80');

              const activeCaption =
                activeTab === 'before'
                  ? (project.beforeMedia?.[0]?.caption || 'Before Restoration Treatment')
                  : activeTab === 'after'
                  ? (project.afterMedia?.[0]?.caption || 'After Engineering Restoration')
                  : (project.materialsUsed || project.title);

              const activeBadge =
                activeTab === 'before' ? 'BEFORE' : activeTab === 'after' ? 'AFTER' : 'COVER PHOTO';

              return (
                <div
                  key={projectId}
                  className={`bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden card-interactive-3d scroll-reveal-card stagger-${(idx % 3) + 1}`}
                >
                  <div
                    onClick={() => {
                      setLightboxImage({
                        url: activeImgUrl,
                        title: project.title,
                        caption: activeCaption,
                        badge: activeBadge,
                      });
                    }}
                    className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer group/img select-none"
                    title="Click to view clean full-size photo"
                  >
                    <img
                      src={activeImgUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      loading="lazy"
                    />

                    {/* Top-Right: Quick Enlarge HD Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage({
                          url: activeImgUrl,
                          title: project.title,
                          caption: activeCaption,
                          badge: activeBadge,
                        });
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 hover:bg-sky-600 text-white border border-white/20 shadow-md backdrop-blur-xs transition-colors z-20 cursor-pointer"
                      title="View clean uncropped HD photo"
                    >
                      <Maximize2 size={12} />
                    </button>

                    {/* Discipline Pill: Top Left */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-xs border border-white/20 rounded px-2 py-0.5 text-[9.5px] font-bold text-white shadow-xs uppercase tracking-wider z-10 pointer-events-none">
                      {project.disciplineName || project.disciplineId || 'Waterproofing Solutions'}
                    </div>

                    {/* Clean View Center Indicator on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-10 pointer-events-none bg-black/30 backdrop-blur-[1px]">
                      <span className="bg-slate-950/95 text-white border border-sky-400/60 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5">
                        <Maximize2 size={12} className="text-sky-400" />
                        <span>View Clean HD Photo</span>
                      </span>
                    </div>

                    {/* Bottom Media Switcher if Before / After exists */}
                    {(beforeUrl || afterUrl) && (
                      <div
                        className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-950/85 border border-white/15 backdrop-blur-xs z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardMediaTab((prev) => ({ ...prev, [projectId]: 'cover' }));
                          }}
                          className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase transition-colors cursor-pointer ${
                            activeTab === 'cover' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                          title="View Cover Photo"
                        >
                          Cover
                        </button>
                        {beforeUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardMediaTab((prev) => ({ ...prev, [projectId]: 'before' }));
                            }}
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase transition-colors cursor-pointer ${
                              activeTab === 'before' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                            }`}
                            title="View Before Photo"
                          >
                            Before
                          </button>
                        )}
                        {afterUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardMediaTab((prev) => ({ ...prev, [projectId]: 'after' }));
                            }}
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase transition-colors cursor-pointer ${
                              activeTab === 'after' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                            }`}
                            title="View After Photo"
                          >
                            After
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div onClick={() => setActiveModalProject(project)} className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 icon-bounce">
                          <Layers size={13} />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-sky-700 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-slate-500 mb-2">
                        <p className="flex items-center gap-1">
                          <MapPin size={11} className="text-sky-600 shrink-0" />
                          <span className="truncate">{project.location || 'Medipally, Hyderabad'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(project)}
                        className="bg-[#04203b] hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-md w-full block text-center btn-ripple cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>View Technical Case Study</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. OUR LINEAGE: WHY PROPERTY OWNERS TRUST SLN ENGINEERS */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-4 space-y-3 scroll-reveal-left">
              <span className="text-sky-600 font-bold text-xs uppercase tracking-wider block">
                {lineageContent.eyebrow || 'Our Lineage'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {lineageContent.title || 'Why Property Owners Trust SLN Engineers'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lineageContent.description ||
                  'Carrying forward three generations of civil engineering integrity. Where conventional contractors apply temporary surface patches, our licensed engineers diagnose root-cause moisture paths to deliver permanent structural protection.'}
              </p>
              <div className="pt-2">
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-600 shadow-xs transition-colors"
                >
                  <span>{lineageContent.ctaText || 'View Google Reviews'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Right 4 Trust Cards in One Row */}
            <div className={`lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 ${(lineageContent.trustCards || []).length <= 4 ? 'lg:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3'} gap-3.5 sm:gap-4`}>
              {(lineageContent.trustCards || DEFAULT_HOME_CONTENT.lineageSection.trustCards).map((card, idx) => (
                <div key={idx} className={`bg-slate-50 rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 card-interactive-3d scroll-reveal-pop stagger-${(idx % 4) + 1}`}>
                  <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 icon-bounce">
                    {renderTrustCardIcon(card.icon, 18)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{card.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. AUTHENTIC CLIENT VOICES: CUSTOMER FEEDBACK VIA HANDOVER QR CODES */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            {/* Left Header */}
            <div className="lg:col-span-3 space-y-3 scroll-reveal-left">
              <span className="text-sky-600 font-bold text-xs uppercase tracking-wider block">
                {reviewsContent.eyebrow || 'Authentic Client Voices'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {reviewsContent.title || 'Verified Client Reviews & Handover Ratings'}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {reviewsContent.description ||
                  'Direct feedback from residential homeowners, apartment associations, and commercial facility managers across Hyderabad and Telangana.'}
              </p>
              <div className="pt-2">
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#04203b] hover:bg-slate-800 shadow-xs transition-colors"
                >
                  <span>{reviewsContent.ctaText || 'Write a Google Review'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Dynamic Feedback Cards */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
              {combinedHomeReviews.map((rev, idx) => (
                <div
                  key={rev._id || `home-rev-${idx}`}
                  className={`bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all duration-300 flex flex-col justify-between space-y-3 card-interactive-3d scroll-reveal-pop stagger-${(idx % 3) + 1}`}
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < (rev.rating || 5) ? 'currentColor' : 'none'}
                          className={`animate-float ${i < (rev.rating || 5) ? 'text-amber-400' : 'text-slate-300'}`}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 italic leading-relaxed line-clamp-4">
                      {rev.feedbackText?.startsWith('“') ? rev.feedbackText : `“${rev.feedbackText}”`}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="min-w-0 pr-2">
                      <strong className="text-slate-900 block font-bold text-xs truncate">
                        {rev.customerName || 'Verified Client'}
                      </strong>
                      <span className="text-slate-500 text-[10px] block truncate">
                        {rev.projectTitle || 'Waterproofing & Civil Restoration'}
                      </span>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 animate-pulse-glow">
                      ✔ Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Contrast Google Review Invitation Strip matching mockup */}
          <div className="bg-gradient-to-r from-[#071b30] via-[#0b294a] to-[#041629] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-sky-900/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden scroll-reveal-scale delay-150 animated-gradient">
            <div className="flex items-center gap-4 sm:gap-6 z-10">
              {/* Phone Mockup Graphic */}
              <div className="w-12 h-20 rounded-xl bg-slate-900 border-2 border-slate-600 shadow-lg flex flex-col items-center justify-center p-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-900 font-black text-xs">
                  G
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[8px]">★</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-white mb-1">
                  {reviewsContent.googleBanner?.headline || 'Have You Used SLN Engineers Services?'}
                </h4>
                <p className="text-slate-300 text-xs sm:text-[13px] max-w-xl leading-relaxed">
                  {reviewsContent.googleBanner?.description ||
                    'We believe in 100% transparent client feedback. Share your candid review on our official Google Business listing.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0284c7] hover:bg-sky-500 shadow-md transition-all whitespace-nowrap w-full sm:w-auto text-center"
              >
                <span>{reviewsContent.googleBanner?.ctaText || 'Write a Google Review'}</span>
                <ArrowRight size={14} />
              </a>

              <div className="flex flex-col items-center sm:items-end">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[11px] text-sky-200 font-serif italic tracking-wide mt-0.5">
                  {reviewsContent.googleBanner?.tagline || 'Trusted by Generations'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CONTACT CTA */}
      <section className="home-section home-cta-band py-14 sm:py-20 lg:py-24 border-t border-slate-800 hero-bg-animated">
        <div className="container text-center max-w-3xl mx-auto space-y-4 px-4 sm:px-6 lg:px-8 scroll-reveal">
          <span className="badge badge-blue animate-pulse-glow">
            {bottomCtaContent.eyebrow || 'Ready for Zero-Leak Protection?'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {bottomCtaContent.title || 'Protect Your Structure with Licensed Civil Engineers'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed pb-2 sm:pb-4 max-w-2xl mx-auto">
            {bottomCtaContent.description ||
              'Schedule an on-site technical inspection today. Our senior engineers will survey your property with non-destructive thermal moisture meters and provide an itemized technical diagnostic proposal.'}
          </p>
          <div className="home-cta-actions flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openInspectionModal();
              }}
              className="btn btn-primary btn-lg font-bold shadow-lg btn-ripple w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>{bottomCtaContent.primaryCtaText || 'Book Site Visit'}</span> <ArrowRight size={17} />
            </button>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-outline-light btn-lg font-semibold btn-ripple w-full sm:w-auto justify-center">
              <Phone size={17} /> {(bottomCtaContent.phoneCtaText || 'Call {phone}').replace('{phone}', phone)}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg font-semibold btn-ripple w-full sm:w-auto justify-center"
            >
              <MessageCircle size={17} /> {bottomCtaContent.whatsappCtaText || 'WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* INTERACTIVE TECHNICAL CASE STUDY MODAL */}
      {/* ===================================================================== */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 relative animate-in fade-in zoom-in-95 duration-200 space-y-5 sm:space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Close case study"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800">
                  {activeModalProject.disciplineName || activeModalProject.disciplineId || 'Waterproofing Solutions'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-600">
                  {activeModalProject.serviceTitle || activeModalProject.serviceCategory || 'Civil Restoration'}
                </span>
                {activeModalProject.warrantyDetails && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {activeModalProject.warrantyDetails}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {activeModalProject.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                {activeModalProject.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    {activeModalProject.location}
                  </span>
                )}
                {activeModalProject.clientReference && (
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-slate-400" />
                    {activeModalProject.clientReference}
                  </span>
                )}
                {activeModalProject.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    {activeModalProject.date}
                  </span>
                )}
              </div>
            </div>

            {/* Before / After Comparison Slider */}
            {((activeModalProject.beforeMedia?.[0]?.url || activeModalProject.beforeImage) &&
              (activeModalProject.afterMedia?.[0]?.url || activeModalProject.afterImage)) ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <BeforeAfterSlider
                  beforeImage={activeModalProject.beforeMedia?.[0]?.url || activeModalProject.beforeImage}
                  afterImage={activeModalProject.afterMedia?.[0]?.url || activeModalProject.afterImage}
                  beforeLabel={activeModalProject.beforeMedia?.[0]?.caption || activeModalProject.beforeLabel || 'Before Treatment'}
                  afterLabel={activeModalProject.afterMedia?.[0]?.caption || activeModalProject.afterLabel || 'After Restoration'}
                  aspectRatio="16/9"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-72">
                <img
                  src={
                    activeModalProject.image ||
                    activeModalProject.coverImage ||
                    activeModalProject.afterImage ||
                    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Diagnostic Findings & Scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Problem &amp; Structural Defect Analysis</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeModalProject.problemDescription || activeModalProject.problem || activeModalProject.description || 'Active moisture penetration, seepage through structural joints, and progressive deterioration identified.'}
                </p>
              </div>

              <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Inspection Findings &amp; Diagnostics</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeModalProject.inspectionFindings || 'Substrate inspection completed with moisture mapping and ultrasonic concrete velocity scanning.'}
                </p>
              </div>
            </div>

            {/* Engineering Solution Executed */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Wrench size={15} className="text-sky-600" />
                <span>Engineering Solution &amp; Scope of Work Executed</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {activeModalProject.workPerformed || activeModalProject.solution || activeModalProject.fullDescription || 'Pressure injection grouting, substrate crack sealing, and monolithic elastomeric barrier treatment.'}
              </p>
            </div>

            {/* Chemical Formulations & Material Systems */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical size={14} className="text-sky-600" />
                <span>Chemical Formulations &amp; Material Systems</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(activeModalProject.formulation) && activeModalProject.formulation.length > 0
                  ? activeModalProject.formulation
                  : String(activeModalProject.materialsUsed || 'Hydrophobic Polyurethane Resin, High-Build Elastomeric Coating, Crystalline Slurry')
                      .split(/[,•\n]+/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                ).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                  >
                    <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="btn btn-outline btn-sm text-xs cursor-pointer w-full sm:w-auto justify-center order-last sm:order-first"
              >
                Close Case Study
              </button>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
                {activeModalProject.slug && (
                  <Link
                    to={`/projects/${activeModalProject.slug}`}
                    className="btn btn-outline btn-sm text-xs flex items-center justify-center gap-1 w-full sm:w-auto"
                    title="Open dedicated case study page"
                  >
                    <span>Full Case Study Page</span>
                    <ExternalLink size={13} />
                  </Link>
                )}

                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SLN%20Engineers,%20I%20reviewed%20your%20case%20study:%20${encodeURIComponent(activeModalProject.title)}.%20I%20would%20like%20a%20similar%20inspection.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <MessageCircle size={14} />
                  <span>Consult Engineer on WhatsApp</span>
                </a>

                <Link
                  to={`/contact?service=${encodeURIComponent(activeModalProject.serviceTitle || activeModalProject.serviceCategory || '')}#inspection-form`}
                  className="btn btn-primary btn-sm text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Book Site Inspection</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PRISTINE CLEAN LIGHTBOX */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white max-w-7xl mx-auto w-full z-10 shrink-0 mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 truncate pr-4">
              {lightboxImage.badge && (
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    lightboxImage.badge === 'BEFORE'
                      ? 'bg-rose-600 text-white'
                      : lightboxImage.badge === 'AFTER'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  {lightboxImage.badge}
                </span>
              )}
              <span className="font-bold text-sm sm:text-base text-slate-100 truncate">
                {lightboxImage.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={lightboxImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open raw image in new tab"
              >
                <ExternalLink size={15} />
                <span className="hidden sm:inline">Open Original</span>
              </a>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Clean Uncropped Image Center */}
          <div
            className="flex-1 flex items-center justify-center min-h-0 w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption || lightboxImage.title}
              className="max-h-[82vh] max-w-[96vw] object-contain rounded-xl shadow-2xl select-none"
            />
          </div>

          {/* Bottom Caption Bar */}
          {lightboxImage.caption && (
            <div
              className="max-w-2xl mx-auto w-full text-center text-xs sm:text-sm text-slate-300 bg-slate-900/80 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm z-10 shrink-0 mt-2 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxImage.caption}
            </div>
          )}
        </div>
      )}

      {/* Floating Smooth Scroll to Top Button with Dynamic Progress Ring */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll back to top"
        className={`fixed bottom-24 right-6 z-40 p-2.5 rounded-full bg-slate-900/90 hover:bg-[#0284c7] text-white border border-white/20 shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer group ${
          showBackToTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        } hover:scale-110 active:scale-95`}
        title="Scroll to Top"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className="text-white/20"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className="text-sky-400 group-hover:text-white transition-colors"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={94.25}
              strokeDashoffset={94.25 - (94.25 * scrollProgress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp size={15} className="absolute text-white group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </button>
    </div>
  );
}
