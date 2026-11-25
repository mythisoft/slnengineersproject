export const DEFAULT_COMPANY_BANNER_SERVICES = [
  {
    id: 'waterproofing',
    name: 'Waterproofing Solutions',
    shortCategory: 'Active Leak Defense & Crystalline Tanking',
    tag: 'IS 1346 Certified',
    icon: 'Droplets',
    accentColor: '#38bdf8',
    targetBannerIndex: 1,
    link: '/services?discipline=waterproofing',
  },
  {
    id: 'painting',
    name: 'Interior & Exterior Painting',
    shortCategory: 'Weather-Shield & Aesthetic Finishes',
    tag: 'UV Weather-Shield',
    icon: 'Paintbrush',
    accentColor: '#f59e0b',
    targetBannerIndex: 1,
    link: '/services?discipline=painting',
  },
  {
    id: 'restoration',
    name: 'Building Repairs & Restoration',
    shortCategory: 'Structural Crack Stitching & Concrete Rehab',
    tag: 'Structural Defense',
    icon: 'Building2',
    accentColor: '#029746',
    targetBannerIndex: 1,
    link: '/services?discipline=repairs',
  },
  {
    id: 'ceiling',
    name: 'False Ceiling & Interior Work',
    shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
    tag: 'Acoustic & Gypsum',
    icon: 'Layers',
    accentColor: '#fbbf24',
    targetBannerIndex: 1,
    link: '/services?discipline=false-ceiling',
  },
];

export const COMPANY_LOGO_PRESET = {
  id: 'company-overview',
  title: 'All Specialized Services & Company Overview',
  imageUrl: '/sln-logo.png',
  isCompanyLogoBanner: true,
  durationSeconds: 3,
  altText: 'SLN Engineers Projects Official Company Logo and Full Civil Services Spectrum',
  eyebrow: 'All 4 Specializations Under One Roof',
  foundedText: '',
  headline: '',
  highlightedHeadline: '',
  description: 'Licensed civil engineering practice delivering specialized leak-proof waterproofing, structural crack restoration, monsoon weather-shield painting, and designer acoustic false ceilings across Telangana.',
  primaryCtaText: 'Request Inspection',
  secondaryCtaText: 'WhatsApp Senior Engineer',
  metrics: [
    { value: '4 Core', label: 'Civil Disciplines' },
    { value: '40+ Yrs', label: 'Continuous Practice' },
    { value: '1,450+', label: 'Projects Completed' },
  ],
  bannerServices: DEFAULT_COMPANY_BANNER_SERVICES,
};

export const PHOTO_BANNER_PRESETS = [
  {
    id: 'villa-waterproofing',
    tag: 'Villa Waterproofing & Deep Tanking',
    title: 'Precision Waterproofing & Structural Defense',
    imageUrl: 'https://res.cloudinary.com/vqifqntv/image/upload/v1795431959/sln_waterproofing/banners/fam7jmcpaoxskw7hside.jpg',
    isCompanyLogoBanner: false,
    durationSeconds: 6,
    altText: 'Modern architectural home protected by SLN Engineers advanced waterproofing',
    eyebrow: 'Precision Structural Waterproofing',
    foundedText: '',
    headline: 'Permanent Leak Defense,',
    highlightedHeadline: 'engineered from the substrate up.',
    description: 'High-pressure polyurethane injection, crystalline tanking, and elastomeric membrane systems that stop active groundwater ingress and structural dampness permanently.',
    primaryCtaText: 'Book Site Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '100%', label: 'Active Leak Defense' },
      { value: '500+ Bar', label: 'Injection Capacity' },
      { value: '10-Year', label: 'Written Warranty' },
    ],
  },
  {
    id: 'terrace-rehab',
    tag: 'Terrace & Roof Structural Rehab',
    title: 'Terrace & Roof Structural Rehabilitation',
    imageUrl: '/uploads/ModernHomeWaterproofinginActio-1792165659327-803206829.png',
    isCompanyLogoBanner: false,
    durationSeconds: 6,
    altText: 'Terrace waterproof membrane application with heavy-duty elastomeric barrier',
    eyebrow: 'Terrace & Roof Garden Defense',
    foundedText: '',
    headline: 'Seamless Polyurethane Membrane,',
    highlightedHeadline: 'zero ponding or seepage.',
    description: 'Heavy-duty elastomeric barrier systems designed for extreme thermal expansion, standing rainwater, and solar UV radiation on exposed terraces and roof decks.',
    primaryCtaText: 'Schedule Terrace Audit',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '350%+', label: 'Elongation at Break' },
      { value: 'UV Proof', label: 'Elastomeric Membrane' },
      { value: '10 Yrs', label: 'Weather Durability' },
    ],
  },
  {
    id: 'facade-armor',
    tag: 'Exterior Façade Monsoon Armor',
    title: 'Exterior Façade Monsoon Weather Armor',
    imageUrl: '/uploads/ModernHomeShieldedfromWater-1794372760092-993538275.png',
    isCompanyLogoBanner: false,
    durationSeconds: 6,
    altText: 'Exterior building façade sealed against wind-driven monsoon rains',
    eyebrow: 'Exterior Façade & Wall Protection',
    foundedText: '',
    headline: 'Breathable Hydrophobic Barrier,',
    highlightedHeadline: 'impervious to heavy monsoon.',
    description: 'Silane-siloxane hydrophobic coatings and elastomeric wall sealants that block wind-driven rain penetration while allowing interior substrate moisture vapor to escape.',
    primaryCtaText: 'Request Façade Inspection',
    secondaryCtaText: 'WhatsApp Senior Engineer',
    metrics: [
      { value: '100%', label: 'Wind-Rain Barrier' },
      { value: 'Micro-Porous', label: 'Vapor Breathable' },
      { value: '10-Year', label: 'Weather Guarantee' },
    ],
  },
];

export const HOMEPAGE_BANNER_PRESETS = [
  COMPANY_LOGO_PRESET,
  PHOTO_BANNER_PRESETS[0],
];

export const basementBannerCopy = HOMEPAGE_BANNER_PRESETS[1];

const legacyDefaultCopy = {
  eyebrow: 'Restoration for Three Generations',
  foundedText: '',
  headline: 'Waterproofing,',
  highlightedHeadline: 'done right.',
  description: 'Practical diagnosis and proven waterproofing for homes, commercial buildings and industrial spaces — backed by three generations of engineering experience.',
  primaryCtaText: 'Request Site Inspection',
  secondaryCtaText: 'WhatsApp Us',
  metrics: [
    { value: '40+ Yrs', label: '3 Generations Lineage' },
    { value: '1,450+', label: 'Projects Waterproofed' },
    { value: 'Up to 10 Yrs', label: 'Written Warranty Options' },
  ],
};

const isLegacyBasementBanner = (banner) => {
  if (!/basement|tanking/i.test(banner.title || '')) return false;
  const hasLegacyCopy = Object.keys(legacyDefaultCopy)
    .filter((field) => field !== 'metrics')
    .every((field) => banner[field] === legacyDefaultCopy[field]);
  const hasLegacyMetrics = Array.isArray(banner.metrics) &&
    banner.metrics.length === legacyDefaultCopy.metrics.length &&
    banner.metrics.every((metric, index) =>
      metric.value === legacyDefaultCopy.metrics[index].value &&
      metric.label === legacyDefaultCopy.metrics[index].label
    );
  return hasLegacyCopy && hasLegacyMetrics;
};

export const isLogoBanner = (banner) => {
  if (!banner) return false;
  if (typeof banner.isCompanyLogoBanner === 'boolean') {
    return banner.isCompanyLogoBanner;
  }
  if (banner._id === 'default-banner-company-overview') return true;
  if (banner.imageUrl === '/sln-logo.png' || banner.imageUrl?.endsWith('/sln-logo.png')) return true;
  return false;
};

export const getBannerCopy = (banner) => {
  const isLogo = isLogoBanner(banner);
  const defaultPreset = isLogo ? HOMEPAGE_BANNER_PRESETS[0] : HOMEPAGE_BANNER_PRESETS[1];

  if (banner && !isLogo && isLegacyBasementBanner(banner)) return HOMEPAGE_BANNER_PRESETS[1];

  return {
    eyebrow: (banner?.eyebrow && banner.eyebrow.trim()) || defaultPreset.eyebrow,
    foundedText: (banner?.foundedText && banner.foundedText.trim()) || '',
    headline: isLogo ? '' : ((banner?.headline && banner.headline.trim()) || defaultPreset.headline),
    highlightedHeadline: isLogo ? '' : ((banner?.highlightedHeadline && banner.highlightedHeadline.trim()) || defaultPreset.highlightedHeadline),
    description: (banner?.description && banner.description.trim()) || defaultPreset.description,
    primaryCtaText: (banner?.primaryCtaText && banner.primaryCtaText.trim()) || defaultPreset.primaryCtaText,
    secondaryCtaText: (banner?.secondaryCtaText && banner.secondaryCtaText.trim()) || defaultPreset.secondaryCtaText,
    metrics: banner?.metrics && Array.isArray(banner.metrics) && banner.metrics.length === 3
      ? banner.metrics
      : defaultPreset.metrics,
  };
};
