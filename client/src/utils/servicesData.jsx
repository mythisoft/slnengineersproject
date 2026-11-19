import React from 'react';
import {
  Droplets,
  Paintbrush,
  Building2,
  Layers,
  Grid,
  Shield,
  ShieldCheck,
  Search,
  Wrench,
  Award,
  Sparkles,
  CheckCircle,
  Home,
  Check,
  Hammer,
  Sun,
  Flame,
  Ruler,
  Maximize2,
  Brush,
} from 'lucide-react';

export const DEFAULT_SERVICES_HERO = {
  badge: '4 Specialized Services • Three Generations Lineage',
  title: 'Waterproofing, Painting,\nStructural Repairs & False Ceilings.',
  description:
    'Complete civil engineering excellence under one roof. Permanent hydrostatic leak containment, monsoon weather-shield painting, structural concrete rehabilitation, and moisture-proof gypsum false ceilings backed by documented quality handovers.',
  ctaPrimaryText: 'Book Diagnostic Site Inspection',
  ctaPrimaryLink: '/contact',
  ctaWhatsappText: 'WhatsApp Senior Engineer',
  catalogTitle: 'Engineering Services Catalog',
  catalogSubtitle: 'Browse our full spectrum of specialized solutions or filter by primary civil discipline pillar.',
};

export const DEFAULT_PROJECTS_HERO = {
  badge: 'Three Generations Lineage • Field Engineering Excellence',
  title: 'Proven Project Portfolio &\nTechnical Case Studies.',
  description:
    'Explore verified case studies of luxury villas, IT parks, commercial complexes, and heritage estates executed by SLN Engineers across Hyderabad and Telangana.',
  catalogTitle: 'Case Studies by Core Discipline',
  catalogSubtitle: 'Filter verified project accounts across our 4 civil engineering pillars.',
};

export const DEFAULT_DISCIPLINES = [
  {
    id: 'waterproofing',
    slug: 'waterproofing',
    name: 'Waterproofing Solutions',
    shortCategory: 'Active Hydrostatic Defense & Crystalline Tanking',
    tag: 'IS 1346 Certified',
    badge: 'Core Practice',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Droplets',
    accentColor: '#0284c7',
    description:
      'Permanent hydrostatic containment, high-pressure polyurethane injection grouting, crystalline deep tanking, and elastomeric membrane systems protecting against active groundwater ingress and structural moisture.',
    order: 1,
    isActive: true,
  },
  {
    id: 'painting',
    slug: 'painting',
    name: 'Interior & Exterior Painting',
    shortCategory: 'Weather-Shield & Aesthetic Finishes',
    tag: 'UV Weather-Shield',
    badge: 'Weather Defense',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Paintbrush',
    accentColor: '#f59e0b',
    description:
      'High-durability 100% acrylic exterior monsoon weather-shield coatings, anti-fungal interior emulsions, washable luxury finishes, and architectural wall textures engineered for high UV resistance.',
    order: 2,
    isActive: true,
  },
  {
    id: 'repairs',
    slug: 'repairs',
    name: 'Building Repairs & Restoration',
    shortCategory: 'Structural Crack Stitching & Concrete Rehab',
    tag: 'Structural Defense',
    badge: '3 Generations Legacy',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Building2',
    accentColor: '#029746',
    description:
      'Precision structural crack stitching, carbon fiber strengthening, concrete spalling rehabilitation, rebar rust passivation, and elastomeric expansion joint sealing to restore load-bearing structural integrity.',
    order: 3,
    isActive: true,
  },
  {
    id: 'false-ceiling',
    slug: 'false-ceiling',
    name: 'False Ceiling & Interior Work',
    shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
    tag: 'Acoustic & Gypsum',
    badge: 'Interior Engineering',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Layers',
    accentColor: '#eab308',
    description:
      'Moisture-resistant gypsum false ceilings, anti-sag Gypsteel framing, mineral fiber acoustic ceiling tiles, ambient LED cove drop ceilings, and fire-resistant drywall partition systems.',
    order: 4,
    isActive: true,
  },
];

export const CORE_DISCIPLINES = [
  {
    id: 'all',
    slug: 'all',
    name: 'All Specializations',
    shortCategory: 'All 4 Civil Disciplines',
    tag: 'Full Civil Spectrum',
    icon: 'Grid',
    accentColor: '#0284c7',
  },
  ...DEFAULT_DISCIPLINES,
];

export const DISCIPLINE_COLOR_PRESETS = [
  { label: 'Deep Blue (Waterproofing)', color: '#0284c7' },
  { label: 'Amber Gold (Painting)', color: '#f59e0b' },
  { label: 'SLN Emerald (Repairs)', color: '#029746' },
  { label: 'Warm Yellow (Ceilings)', color: '#eab308' },
  { label: 'Cyan Teal (Flooring)', color: '#06b6d4' },
  { label: 'Purple Violet (Interiors)', color: '#8b5cf6' },
  { label: 'Rose Red (Fireproof)', color: '#e11d48' },
  { label: 'Orange Amber (Thermal)', color: '#ea580c' },
];

export const DISCIPLINE_ICONS_LIST = [
  { id: 'Droplets', label: 'Droplets (Waterproofing)', icon: Droplets },
  { id: 'Paintbrush', label: 'Paintbrush (Painting / Coatings)', icon: Paintbrush },
  { id: 'Building2', label: 'Building (Civil / Structures)', icon: Building2 },
  { id: 'Layers', label: 'Layers (Ceiling / Membranes)', icon: Layers },
  { id: 'Hammer', label: 'Hammer (Demolition / Masonry)', icon: Hammer },
  { id: 'Wrench', label: 'Wrench (Repairs / Restoration)', icon: Wrench },
  { id: 'ShieldCheck', label: 'ShieldCheck (Warranty / Protection)', icon: ShieldCheck },
  { id: 'Sparkles', label: 'Sparkles (Luxury Finishes)', icon: Sparkles },
  { id: 'Sun', label: 'Sun (Solar / Heat-Shield)', icon: Sun },
  { id: 'Flame', label: 'Flame (Fire-Retardant)', icon: Flame },
  { id: 'Ruler', label: 'Ruler (Architecture / Planning)', icon: Ruler },
  { id: 'Grid', label: 'Grid (Façade / Acoustic Grid)', icon: Grid },
];

export function renderDisciplineIcon(iconName, size = 20, className = '') {
  const name = String(iconName || '').toLowerCase();
  switch (name) {
    case 'droplets':
      return <Droplets size={size} className={className} />;
    case 'paintbrush':
    case 'brush':
      return <Paintbrush size={size} className={className} />;
    case 'building':
    case 'building2':
      return <Building2 size={size} className={className} />;
    case 'layers':
      return <Layers size={size} className={className} />;
    case 'hammer':
      return <Hammer size={size} className={className} />;
    case 'wrench':
      return <Wrench size={size} className={className} />;
    case 'shieldcheck':
    case 'shield-check':
      return <ShieldCheck size={size} className={className} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} />;
    case 'sun':
      return <Sun size={size} className={className} />;
    case 'flame':
      return <Flame size={size} className={className} />;
    case 'ruler':
      return <Ruler size={size} className={className} />;
    case 'grid':
      return <Grid size={size} className={className} />;
    default:
      return <Shield size={size} className={className} />;
  }
}

export function normalizeDiscipline(raw = {}, index = 0) {
  const name = raw.name || 'Untitled Discipline';
  const slug = raw.slug || raw.id || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  return {
    ...raw,
    id: slug,
    slug,
    name,
    shortCategory: raw.shortCategory || '',
    tag: raw.tag || 'IS Certified',
    badge: raw.badge || 'Core Discipline',
    eyebrow: raw.eyebrow || 'Specialized Discipline',
    ctaText: raw.ctaText || 'Book Inspection',
    ctaLink: raw.ctaLink || '',
    icon: raw.icon || 'Layers',
    accentColor: raw.accentColor || '#0284c7',
    description: raw.description || '',
    order: Number(raw.order) || index + 1,
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : true,
    serviceCount: Number(raw.serviceCount) || 0,
  };
}

export const DISCIPLINE_COLORS = {
  waterproofing: '#0284c7',
  painting: '#f59e0b',
  repairs: '#029746',
  'false-ceiling': '#eab308',
};

export const DISCIPLINE_NAMES = {
  waterproofing: 'Waterproofing Solutions',
  painting: 'Interior & Exterior Painting',
  repairs: 'Building Repairs & Restoration',
  'false-ceiling': 'False Ceiling & Interior Work',
};

// Universal flexible discipline matcher for both Admin and Public views
export function matchesDiscipline(service, discipline) {
  if (!service || !discipline) return false;

  const targetId =
    typeof discipline === 'string'
      ? discipline.toLowerCase().trim()
      : (discipline.slug || discipline.id || discipline.name || '').toLowerCase().trim();

  if (!targetId || targetId === 'all') return true;

  const sDiscId = String(service.disciplineId || '').toLowerCase().trim();
  const sDiscName = String(service.disciplineName || '').toLowerCase().trim();
  const dSlug = String(discipline.slug || discipline.id || (typeof discipline === 'string' ? discipline : '')).toLowerCase().trim();
  const dId = String(discipline.id || (typeof discipline === 'string' ? discipline : '')).toLowerCase().trim();
  const dName = String(discipline.name || '').toLowerCase().trim();

  const norm = (str) => (str || '').replace(/[-_\s]+/g, '');

  if (sDiscId && (sDiscId === dSlug || sDiscId === dId || (dName && sDiscId === dName))) return true;
  if (sDiscId && (norm(sDiscId) === norm(dSlug) || norm(sDiscId) === norm(dId) || (dName && norm(sDiscId) === norm(dName)))) return true;

  if (dName && (sDiscName === dName || norm(sDiscName) === norm(dName))) return true;
  if (sDiscName && (sDiscName === dSlug || sDiscName === dId || norm(sDiscName) === norm(dSlug) || norm(sDiscName) === norm(dId))) return true;

  return false;
}

// Helper to resolve category string to valid disciplineId
export function mapCategoryToDiscipline(category = '') {
  const cat = String(category).toLowerCase();
  if (cat.includes('paint') || cat.includes('texture') || cat.includes('emulsion') || cat.includes('monsoon')) {
    return 'painting';
  }
  if (cat.includes('repair') || cat.includes('restoration') || cat.includes('crack') || cat.includes('concrete') || cat.includes('joint') || cat.includes('spall')) {
    return 'repairs';
  }
  if (cat.includes('ceiling') || cat.includes('gypsum') || cat.includes('acoustic') || cat.includes('drywall') || cat.includes('partition')) {
    return 'false-ceiling';
  }
  return 'waterproofing';
}

export const DEFAULT_SERVICES = [
  // --------------------------------------------------------------------------
  // 1. WATERPROOFING SOLUTIONS (5 Services)
  // --------------------------------------------------------------------------
  {
    id: '01',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    categoryKey: 'Terrace and roof waterproofing',
    title: 'Terrace & Roof Waterproofing',
    categoryLabel: 'Terrace & Roof',
    indexLabel: '01 / 05',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    description:
      'Terraces endure intense weathering, extreme thermal expansion, and torrential monsoon deluges. Our multi-layer terrace waterproofing combines high-tensile fiberglass mesh reinforcement with advanced aliphatic polyurethane elastomer membranes. We rectify screed slopes, seal construction joints, and apply solar-reflective topcoats that reduce building ambient temperatures while providing impenetrable hydrostatic protection.',
    advantages: [
      'High elongation polyurethane membrane (over 400%)',
      'UV-resistant aliphatic topcoat reduces roof heat buildup',
      'Root-resistant formula compatible with terrace gardens',
      'Accommodates structural settling without rupture',
      '10-Year leak-free written warranty',
    ],
    specifications: [
      'Elastomeric Polymer Membrane: 1.8mm – 2.2mm',
      'Tensile Strength: > 3.5 N/mm²',
      'Crack bridging capability up to 3.0mm',
      'Compatible with screeding, china mosaic, outdoor tiling',
    ],
    protocol: 'SLN Hydro-Shield Protocol',
    standard: 'IS 1346 Certified Hydrostatic System',
    iconType: 'layers',
    accentColor: '#0284c7',
    order: 1,
    publicationStatus: true,
    isFeatured: true,
    beforeMediaUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    beforeMediaCaption: 'Before: Fractured screed & pooling rainwater seepage',
    afterMediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    afterMediaCaption: 'After: Monolithic UV-shield polyurethane barrier',
  },
  {
    id: '02',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    categoryKey: 'Bathroom and wet-area waterproofing',
    title: 'Bathroom & Wet-Area Waterproofing',
    categoryLabel: 'Bathrooms & Wet-Areas',
    indexLabel: '02 / 05',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description:
      'Concealed bathroom leaks cause damp patches on lower-floor ceilings, structural rebar oxidation, and peeling adjacent wall paint. Our specialist wet-area treatment seals sunken slabs, core-cut pipe penetrations, and wall-floor cold joints with flexible polymer-modified cementitious membranes prior to final tiling, guaranteeing total containment.',
    advantages: [
      'Non-destructive re-grouting and pipe collar sealing',
      'High bond adhesion to concrete, brick & PVC sleeves',
      'Prevents efflorescence, mold spores & gypsum damage',
      'Food-grade certified, non-toxic formulation',
    ],
    specifications: [
      'Two-component acrylic-modified slurry',
      'Reinforced coving at 90° wall-floor junctures',
      'Hydrostatic pressure tolerance up to 3.5 bar',
    ],
    protocol: 'SLN Wet-Containment Protocol',
    standard: 'IS 3067 Hydrostatic Specification',
    iconType: 'droplets',
    accentColor: '#0284c7',
    order: 2,
    publicationStatus: true,
    isFeatured: true,
    beforeMediaUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    beforeMediaCaption: 'Before: Sunken slab core leakage & porous mortar bed',
    afterMediaUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
    afterMediaCaption: 'After: Continuous dual-component polymer tanking',
  },
  {
    id: '03',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    categoryKey: 'Basement waterproofing',
    title: 'Basement & Deep Tanking',
    categoryLabel: 'Basement Tanking',
    indexLabel: '03 / 05',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    description:
      'Basements and underground parking structures are vulnerable to high groundwater tables and hydrostatic pressure. We execute negative-side crystalline penetration treatments and high-pressure polyurethane chemical injection grouting to stop active running leaks instantly without excavating perimeter soil.',
    advantages: [
      'Crystalline matrix self-heals microcracks permanently',
      'High-pressure PU injection halts active gushing leaks in seconds',
      'Protects reinforcement steel from sub-soil chemical attack',
      'Resistant to chlorides, sulphates, and aggressive groundwater',
    ],
    specifications: [
      'Injection pressure up to 250 bar',
      'Crystalline depth penetration up to 100mm',
      'Compressive strength exceeds parent concrete design grade',
    ],
    protocol: 'SLN Deep-Tanking Protocol',
    standard: 'IS 1346 High-Pressure Matrix',
    iconType: 'building',
    accentColor: '#0284c7',
    order: 3,
    publicationStatus: true,
    isFeatured: true,
    beforeMediaUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
    beforeMediaCaption: 'Before: Active hydrostatic running leaks & salt efflorescence',
    afterMediaUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    afterMediaCaption: 'After: High-pressure PU stopped leaks with crystalline slurry',
  },
  {
    id: '04',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    categoryKey: 'Wall dampness and leakage treatment',
    title: 'Wall Dampness & Efflorescence Treatment',
    categoryLabel: 'Wall Dampness',
    indexLabel: '04 / 05',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
    description:
      'Flaking paint and powdery salt deposits indicate capillary moisture draw or concealed plumbing micro-leaks. Using thermal moisture meters and precision core inspection, we locate the source, insert chemical DPC barriers, and apply breathable salt-neutralizing crystalline plaster for permanent dry interiors.',
    advantages: [
      'Non-destructive moisture meter and thermal diagnostic survey',
      'Chemical injection DPC halts rising capillary dampness',
      'Eliminates musty damp odors & respiratory allergen mold',
      'Restores smooth surface for luxury interior wall paints',
    ],
    specifications: [
      'Siloxane micro-emulsion hydrophobic barrier',
      'Resistant to capillary moisture suction up to 1.5m height',
      'Breathable microporous vapor-release finish',
    ],
    protocol: 'SLN Damp-Neutralizing Protocol',
    standard: 'ISO 9001 Hydrostatic Assurance',
    iconType: 'search',
    accentColor: '#0284c7',
    order: 4,
    publicationStatus: true,
    beforeMediaUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
    beforeMediaCaption: 'Before: Flaking wall paint & capillary dampness draw',
    afterMediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    afterMediaCaption: 'After: Siloxane DPC barrier & dry breathable plaster',
  },
  {
    id: '05',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    categoryKey: 'External wall waterproofing',
    title: 'External Façade Waterproofing',
    categoryLabel: 'Façade Waterproofing',
    indexLabel: '05 / 05',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    description:
      'External building envelopes face severe monsoon rain, wind-driven moisture, and intense thermal UV expansion. Our multi-layer weatherproof system combines breathable hydrophobic silane-siloxane barriers with elastomeric wall armor that prevents rainwater ingress while allowing substrate vapors to escape.',
    advantages: [
      '100% wind-driven monsoon rain barrier',
      'UV and weather resistant elastomeric topcoats',
      'Bridges hairline plaster cracks and prevents thermal fissures',
      'Reduces interior heat absorption with solar reflective finish',
    ],
    specifications: [
      'Elastomeric coating thickness: 1.0mm – 1.5mm',
      'High vapor breathability (Sd < 0.5m)',
      'Adhesion strength > 1.8 N/mm² to concrete & masonry',
    ],
    protocol: 'SLN Façade-Armor Protocol',
    standard: 'IS 3067 Certified Standards',
    iconType: 'grid',
    accentColor: '#0284c7',
    order: 5,
    publicationStatus: true,
    beforeMediaUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
    beforeMediaCaption: 'Before: Wind-driven rain infiltration & plaster micro-cracks',
    afterMediaUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
    afterMediaCaption: 'After: High-elongation elastomeric weather armor',
  },

  // --------------------------------------------------------------------------
  // 2. INTERIOR & EXTERIOR PAINTING (3 Services)
  // --------------------------------------------------------------------------
  {
    id: '06',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    categoryKey: 'Exterior weather-shield painting',
    title: 'Exterior Monsoon Weather-Shield Painting',
    categoryLabel: 'Exterior Painting',
    indexLabel: '01 / 03',
    warranty: 'Up to 8-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    description:
      'Engineered for Indian monsoon climates, our exterior weather-shield painting system utilizes heavy-duty cross-linking acrylic emulsions. Includes high-pressure washing, biocidal fungal wash, polymer crack bridging, and two coats of UV-reflective, dirt-resistant exterior finish.',
    advantages: [
      'Superior anti-algal, anti-fungal, and black mold defense',
      'High dirt-pick-up resistance keeps walls looking brand new',
      'UV-reflective cross-linking acrylics prevent color fading',
      'Flexible film accommodates thermal wall expansion',
    ],
    specifications: [
      '100% Pure Acrylic Elastomeric Emulsion',
      'Dry Film Thickness: 110 – 130 microns',
      'Weather-o-meter tested for 1,500+ hours UV durability',
    ],
    protocol: 'SLN Weather-Shield System',
    standard: 'ASTM D412 & Indian Standards Compliant',
    iconType: 'paint',
    accentColor: '#f59e0b',
    order: 6,
    publicationStatus: true,
  },
  {
    id: '07',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    categoryKey: 'Interior luxury architectural painting',
    title: 'Interior Luxury Emulsions & Wall Finishes',
    categoryLabel: 'Interior Painting',
    indexLabel: '02 / 03',
    warranty: 'Up to 7-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    description:
      'Transform living rooms, master suites, and commercial offices with smooth luxury finishes. We provide multi-stage surface plaster sanding, acrylic wall putty skim coats, anti-bacterial primers, and premium washable silk/matte emulsions that resist household stains.',
    advantages: [
      'Low VOC, odorless, eco-friendly formulations',
      'High scrub resistance and completely stain-washable',
      'Silky smooth surface light-reflectance uniformity',
      'Silver-ion anti-bacterial protection for healthy homes',
    ],
    specifications: [
      'Ultra-fine acrylic micro-emulsion',
      'Scrub cycles: > 10,000 cycles without loss of film',
      'Zero-chalking, anti-fungal formulation',
    ],
    protocol: 'SLN Interior-Luxe Protocol',
    standard: 'Green Building & VOC Compliant',
    iconType: 'paint',
    accentColor: '#f59e0b',
    order: 7,
    publicationStatus: true,
  },
  {
    id: '08',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    categoryKey: 'Architectural wall textures and finishes',
    title: 'Designer Architectural Wall Textures',
    categoryLabel: 'Wall Textures',
    indexLabel: '03 / 03',
    warranty: 'Up to 8-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description:
      'Add depth and sophisticated visual texture to feature walls, building entrances, and façade panels. Our artisans apply custom Italian stuccos, rustic travertine stone finishes, exposed concrete textures, and metallic glazes protected with clear non-yellowing polyurethane sealers.',
    advantages: [
      'Custom hand-troweled artistic patterns & finishes',
      'Superior impact resistance against scuffs and scratches',
      'Protected with non-yellowing hydrophobic polyurethane glaze',
      'Suitable for both luxury interior accents and exterior façades',
    ],
    specifications: [
      'Reinforced acrylic copolymer textural matrix',
      'Non-cracking flexible marble-dust base',
      'Water and UV repellent protective topcoat',
    ],
    protocol: 'SLN Artisan-Texture System',
    standard: 'Architectural Grade Specification',
    iconType: 'paint',
    accentColor: '#f59e0b',
    order: 8,
    publicationStatus: true,
  },

  // --------------------------------------------------------------------------
  // 3. BUILDING REPAIRS & RESTORATION (3 Services)
  // --------------------------------------------------------------------------
  {
    id: '09',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    categoryKey: 'Structural crack stitching and grouting',
    title: 'Structural Crack Stitching & Grouting',
    categoryLabel: 'Crack Stitching',
    indexLabel: '01 / 03',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    description:
      'Settlement cracks, shear stress fissures, and thermal movements compromise structural integrity and invite water seepage. We execute non-destructive ultrasonic diagnosis, insert 316-grade helical stainless steel stitching ties, and pressure-inject low-viscosity structural epoxies that restore original masonry and concrete tensile strength.',
    advantages: [
      'Restores monolithic structural strength across fractured masonry',
      'Low-viscosity epoxy penetrates cracks down to 0.1mm width',
      'Helical stainless steel ties dissipate future building movement',
      'Clean architectural finish without unsightly exterior scars',
    ],
    specifications: [
      'Epoxy Compressive Strength: > 70 N/mm²',
      'Tensile Strength: > 35 N/mm²',
      'Helical Ties: 316 Austenitic Stainless Steel',
    ],
    protocol: 'SLN Structural-Stitch Protocol',
    standard: 'IS 456 Structural Concrete Guidelines',
    iconType: 'wrench',
    accentColor: '#029746',
    order: 9,
    publicationStatus: true,
  },
  {
    id: '10',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    categoryKey: 'Concrete spalling and carbonation rehab',
    title: 'Concrete Carbonation & Spalling Rehabilitation',
    categoryLabel: 'Concrete Rehab',
    indexLabel: '02 / 03',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    description:
      'Atmospheric carbon dioxide lowers concrete alkalinity, causing internal steel rebars to rust, expand, and spall off exterior concrete covers. Our restorative process exposes affected steel, mechanically removes rust, applies zinc-rich anodic primers, and rebuilds structural cross-sections with fiber-reinforced micro-concrete.',
    advantages: [
      'Zinc-rich corrosion inhibitor passivates rebar rust permanently',
      'Non-shrink fiber-reinforced micro-concrete restores original beam/column profile',
      'Polymer bonding agent ensures high shear adhesion to old concrete',
      'Prevents structural failure and catastrophic building spalling',
    ],
    specifications: [
      'Micro-concrete Compressive Strength: > 50 N/mm² at 28 days',
      'Corrosion Inhibitor: Active migrating zinc silicate',
      'Bond Strength: > 2.5 N/mm²',
    ],
    protocol: 'SLN Concrete-Restore Protocol',
    standard: 'IS 516 & IS 277 Rebar Passivation',
    iconType: 'wrench',
    accentColor: '#029746',
    order: 10,
    publicationStatus: true,
  },
  {
    id: '11',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    categoryKey: 'Expansion joint and cold-joint sealing',
    title: 'Expansion Joint & Cold-Joint Sealing',
    categoryLabel: 'Joint Sealing',
    indexLabel: '03 / 03',
    warranty: 'Up to 10-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description:
      'Expansion joints between structural building blocks and construction cold joints are prime entry points for monsoon water. We clean and reprofile joint edges, install closed-cell polyethylene backing rods, and inject high-movement elastomeric polysulfide or polyurethane sealants backed by mechanical cover systems.',
    advantages: [
      'Accommodates ±25% joint movement without cohesive or adhesive failure',
      'Resistant to standing water, chemical attack, and UV radiation',
      'Closed-cell backer rods maintain optimal joint depth-to-width ratios',
      'Heavy-duty aluminum cover plates for vehicular parking ramps',
    ],
    specifications: [
      'Movement Accommodation Factor (MAF): ±25%',
      'Shore A Hardness: 25 – 35',
      'Complies with ISO 11600 Class 25LM',
    ],
    protocol: 'SLN Joint-Seal Protocol',
    standard: 'ISO 11600 & ASTM C920 Compliant',
    iconType: 'wrench',
    accentColor: '#029746',
    order: 11,
    publicationStatus: true,
  },

  // --------------------------------------------------------------------------
  // 4. FALSE CEILING & INTERIOR WORK (3 Services)
  // --------------------------------------------------------------------------
  {
    id: '12',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    categoryKey: 'Moisture resistant gypsum false ceilings',
    title: 'Moisture-Resistant Gypsum False Ceilings',
    categoryLabel: 'Gypsum Ceilings',
    indexLabel: '01 / 03',
    warranty: 'Up to 7-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description:
      'Engineered for coastal humidity, top-floor apartments, and bathrooms, our moisture-resistant false ceiling installations use Saint-Gobain Gyproc moisture-repellent plasterboards. Suspended on galvanized Gypsteel framing with anti-sag perimeter channels, ensuring a flat, crack-free, sag-proof overhead surface.',
    advantages: [
      'Special water-repellent silicone core prevents moisture absorption and sagging',
      'Galvanized Gypsteel metal frame resists rust and humidity warping',
      'Flawless seamless paper-tape jointing for ultra-smooth painted finish',
      'Class 1 surface spread of flame fire safety rating',
    ],
    specifications: [
      '12.5mm Gyproc Moisture-Resistant Plasterboard',
      '0.5mm Zinc Coated Gypsteel GI Suspension Channels',
      'Water absorption rate < 5% as per IS 2095 Part 1',
    ],
    protocol: 'SLN Ceiling-Guard System',
    standard: 'IS 2095 Part 1 Moisture Standards',
    iconType: 'layers',
    accentColor: '#eab308',
    order: 12,
    publicationStatus: true,
  },
  {
    id: '13',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    categoryKey: 'Acoustic grid and mineral fiber ceilings',
    title: 'Acoustic Grid & Mineral Fiber Ceilings',
    categoryLabel: 'Acoustic Grid',
    indexLabel: '02 / 03',
    warranty: 'Up to 8-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description:
      'Ideal for corporate conference rooms, home theaters, healthcare centers, and high-noise commercial spaces. We install modular 600x600mm acoustic mineral fiber panels mounted on pre-painted silhouette T-grids that dampen echoes, enhance vocal clarity, and provide easy overhead access for HVAC and cabling.',
    advantages: [
      'High Sound Absorption (NRC 0.65 – 0.75) reduces interior reverberation',
      'BioGuard anti-microbial coating prevents mold and bacterial growth',
      'Light reflectance > 85% reduces interior ambient lighting costs',
      'Demountable grid allows instant access to concealed electrical conduits',
    ],
    specifications: [
      'Panel Thickness: 15mm – 19mm Wet-formed Mineral Fiber',
      'Noise Reduction Coefficient (NRC): 0.70',
      'Relative Humidity Resistance: RH 95% Anti-sag guarantee',
    ],
    protocol: 'SLN Acoustic-Grid System',
    standard: 'ASTM C423 Acoustic Performance',
    iconType: 'layers',
    accentColor: '#eab308',
    order: 13,
    publicationStatus: true,
  },
  {
    id: '14',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    categoryKey: 'Designer cove lighting and gypsum partitions',
    title: 'Designer Cove Ceilings & Gypsum Drywalls',
    categoryLabel: 'Designer Coves & Drywalls',
    indexLabel: '03 / 03',
    warranty: 'Up to 7-Yr Warranty',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description:
      'Elevate architectural interiors with custom multi-level step ceilings, indirect LED ambient cove troughs, and acoustic gypsum partition walls. We create floating ceiling islands, spotlight cutouts, and lightweight drywall room dividers with built-in sound-dampening glass wool insulations.',
    advantages: [
      'Custom architectural floating step designs and warm ambient LED glow',
      'Fast drywall construction with 60% less dead-load than brickwork',
      'Integrated rockwool insulation provides 45 dB acoustic room privacy',
      'Precision laser-leveled framework for razor-sharp geometric lines',
    ],
    specifications: [
      'Double-skin 12.5mm gypsum board with staggered joints',
      '70mm C-Stud and U-Track framing with floor-ceiling acoustic seals',
      'Sound Transmission Class (STC): 45 – 50 dB',
    ],
    protocol: 'SLN Interior-Drywall System',
    standard: 'IS 2095 & BS 5234 Partition Standards',
    iconType: 'layers',
    accentColor: '#eab308',
    order: 14,
    publicationStatus: true,
  },
];

export const SERVICE_ICONS_LIST = [
  { id: 'droplets', label: 'Droplets (Waterproofing)', icon: Droplets },
  { id: 'paint', label: 'Paintbrush (Painting)', icon: Paintbrush },
  { id: 'wrench', label: 'Wrench (Repairs & Restoration)', icon: Wrench },
  { id: 'layers', label: 'Layers (Ceiling / Membrane)', icon: Layers },
  { id: 'building', label: 'Building (Basement / Civil)', icon: Building2 },
  { id: 'shield', label: 'Shield (Protection)', icon: Shield },
  { id: 'shield-check', label: 'ShieldCheck (Warranty)', icon: ShieldCheck },
  { id: 'search', label: 'Search (Diagnostic / Survey)', icon: Search },
  { id: 'sparkles', label: 'Sparkles (Finishes)', icon: Sparkles },
  { id: 'grid', label: 'Grid (Façade / Structural)', icon: Grid },
];

export function renderServiceIcon(type, size = 18, className = '') {
  const t = String(type || '').toLowerCase();
  switch (t) {
    case 'layers':
      return <Layers size={size} className={className} />;
    case 'droplets':
      return <Droplets size={size} className={className} />;
    case 'building':
    case 'building2':
      return <Building2 size={size} className={className} />;
    case 'search':
      return <Search size={size} className={className} />;
    case 'grid':
      return <Grid size={size} className={className} />;
    case 'paint':
    case 'paintbrush':
      return <Paintbrush size={size} className={className} />;
    case 'wrench':
      return <Wrench size={size} className={className} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} />;
    case 'shieldcheck':
    case 'shield-check':
      return <ShieldCheck size={size} className={className} />;
    default:
      return <Shield size={size} className={className} />;
  }
}

// Normalize any service object from API, DB, or client form into standard shape
export function normalizeService(raw = {}, index = 0) {
  const disciplineId = raw.disciplineId || mapCategoryToDiscipline(raw.category || raw.disciplineName);
  const disciplineObj = CORE_DISCIPLINES.find((d) => d.id === disciplineId) || CORE_DISCIPLINES[1];
  
  const id = String(raw.id || raw._id || index + 1).padStart(2, '0');
  const title = raw.title || 'Untitled Service';
  const categoryKey = raw.categoryKey || raw.category || raw.slug || title;
  const categoryLabel = raw.categoryLabel || raw.category || disciplineObj.name;
  
  const image = raw.image || raw.coverImage || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
  const description = raw.description || raw.fullDescription || raw.shortDescription || 'Professional engineering contracting service by SLN Engineers.';
  const shortDescription = raw.shortDescription || description.slice(0, 150);
  
  const advantages = Array.isArray(raw.advantages) && raw.advantages.length > 0
    ? raw.advantages
    : Array.isArray(raw.benefits) && raw.benefits.length > 0
    ? raw.benefits
    : [
        'Engineered solution compliant with IS & ISO civil standards',
        'Multi-layer industrial grade materials for long service life',
        'Executed by certified civil applicators with 3 generations expertise',
        'Backed by written legal manufacturer-guaranteed warranty',
      ];

  const specifications = Array.isArray(raw.specifications) && raw.specifications.length > 0
    ? raw.specifications
    : Array.isArray(raw.technicalHighlights) && raw.technicalHighlights.length > 0
    ? raw.technicalHighlights
    : [
        'Material Grade: Industrial civil construction matrix',
        'Standard: IS / ASTM specification compliant',
        'Adhesion strength: High structural bond to concrete',
      ];

  return {
    ...raw,
    id,
    _id: raw._id || id,
    title,
    slug: raw.slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
    disciplineId,
    disciplineName: raw.disciplineName || disciplineObj.name,
    categoryKey,
    categoryLabel,
    indexLabel: raw.indexLabel || `${String(index + 1).padStart(2, '0')} / ${String(index + 1).padStart(2, '0')}`,
    warranty: raw.warranty || 'Up to 10-Yr Warranty',
    image,
    coverImage: image,
    description,
    shortDescription,
    fullDescription: description,
    advantages,
    specifications,
    benefits: advantages,
    technicalHighlights: specifications,
    protocol: raw.protocol || 'SLN Certified Protocol',
    standard: raw.standard || 'IS 1346 Certified',
    iconType: raw.iconType || raw.iconName || (disciplineId === 'painting' ? 'paint' : disciplineId === 'repairs' ? 'wrench' : disciplineId === 'false-ceiling' ? 'layers' : 'droplets'),
    accentColor: raw.accentColor || disciplineObj.accentColor || '#0284c7',
    order: Number(raw.order) || index + 1,
    publicationStatus: raw.publicationStatus !== undefined ? Boolean(raw.publicationStatus) : true,
    isFeatured: Boolean(raw.isFeatured),
    featuredUpdatedAt: Number(raw.featuredUpdatedAt) || 0,
    beforeMediaUrl: raw.beforeMediaUrl || (Array.isArray(raw.beforeMedia) && raw.beforeMedia[0]?.url) || '',
    beforeMediaCaption: raw.beforeMediaCaption || (Array.isArray(raw.beforeMedia) && raw.beforeMedia[0]?.caption) || 'Before Treatment',
    afterMediaUrl: raw.afterMediaUrl || (Array.isArray(raw.afterMedia) && raw.afterMedia[0]?.url) || '',
    afterMediaCaption: raw.afterMediaCaption || (Array.isArray(raw.afterMedia) && raw.afterMedia[0]?.caption) || 'After Restoration',
  };
}
