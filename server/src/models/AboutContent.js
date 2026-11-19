import mongoose from 'mongoose';

export const DEFAULT_ABOUT_CONTENT = {
  hero: {
    badge: '4 Core Discipline Pillars • Past, Present & Future Evolution',
    title: 'Civil Engineering Mastery Across 4 Core Discipline Pillars.',
    description:
      'Four decades of specialized civil contracting delivering permanent structural defense across four core execution pillars: Waterproofing Solutions, Building Repairs & Restoration, Interior & Exterior Painting, and False Ceiling & Interior Work.',
  },
  trustMetrics: [
    { value: '40+', label: 'Years Continuous Practice', sub: 'Founded in 1984', icon: 'Calendar', color: '#0284c7' },
    { value: '3', label: 'Engineering Generations', sub: 'Past • Present • Future', icon: 'Layers', color: '#0891b2' },
    { value: '1,450+', label: 'Projects Sealed', sub: 'Commercial & Residential', icon: 'Building2', color: '#0369a1' },
    { value: '100%', label: 'In-House Execution', sub: 'Licensed Civil Engineers', icon: 'ShieldCheck', color: '#0284c7' },
  ],
  generationsRoadmap: {
    sectionTitle: 'The Three-Generation Engineering Roadmap',
    sectionSubtitle:
      'Continuous civil engineering progression from foundational craftsmanship to modern polymers and next-generation smart chemistry across all four core disciplines: Waterproofing, Structural Repairs, Painting, and False Ceilings.',
    cards: [
      {
        id: 1,
        era: 'Past Generation',
        pill: 'Past Era • Classical Foundation',
        subtitle: 'Foundational Craft across All 4 Pillars',
        description:
          'Mastery in traditional brick-bat coba terrace waterproofing, lime-mortar structural masonry repairs, artisanal lime wash and oil-based protective painting, and timber-framed plaster false ceiling architecture.',
        checkpoints: [
          { pillar: 'Waterproofing', text: 'Brick-Bat Coba & Bitumen Tanking' },
          { pillar: 'Building Repairs', text: 'Lime-Mortar Masonry Stitching' },
          { pillar: 'Painting', text: 'Traditional Lime Washes & Protective Enamels' },
          { pillar: 'False Ceiling', text: 'Timber Framing & Plaster Cornice Work' },
        ],
      },
      {
        id: 2,
        era: 'Present Generation',
        pill: 'Present Era • Industrial Polymers',
        subtitle: 'Engineered Precision across All 4 Pillars',
        description:
          'Advanced cold-applied polyurethane waterproofing membranes, epoxy rebar passivating repairs, anti-carbonation monsoon exterior paint shields, and commercial metal-grid acoustic false ceilings.',
        checkpoints: [
          { pillar: 'Waterproofing', text: 'High-Pressure PU Injection & Elastomers' },
          { pillar: 'Building Repairs', text: 'Rebar Rust Passivation & Epoxy Micro-Grouting' },
          { pillar: 'Painting', text: 'Weather-Shield Acrylics & Anti-Carbonation Coatings' },
          { pillar: 'False Ceiling', text: 'Galvanized Metal Framing & Gypsum Ceilings' },
        ],
      },
      {
        id: 3,
        era: 'Future Generation',
        pill: 'Future Era • Smart Nano Chemistry',
        subtitle: 'Next-Gen Science across All 4 Pillars',
        description:
          'Pioneering deep self-healing nano-crystalline concrete matrices, carbon-fiber composite structural retrofitting, solar heat-reflective smart paints, and modular acoustic magnetic-cove ceiling systems.',
        checkpoints: [
          { pillar: 'Waterproofing', text: 'Self-Healing Crystalline Nanotechnology' },
          { pillar: 'Building Repairs', text: 'Carbon-Fiber (CFRP) Structural Retrofitting' },
          { pillar: 'Painting', text: 'Solar-Reflective Cool Coatings & Eco Emulsions' },
          { pillar: 'False Ceiling', text: 'Modular Acoustic Baffles & LED Cove Systems' },
        ],
      },
    ],
  },
  slnDifference: {
    sectionTitle: 'Why Conventional Repair Fails — And How SLN Succeeds Across All Pillars',
    sectionSubtitle:
      'Most contractors treat symptoms with cosmetic putty and generic coats. We diagnose root hydrostatic paths, reinforce structural matrices, and execute complete protection across all four engineering disciplines.',
    contractorApproach: {
      title: 'The Cosmetic Contractor Approach',
      subtitle: 'Fragmented Trades & Superficial Masking',
      points: [
        {
          title: 'Waterproofing: Superficial Tar & Slurry',
          description:
            'Unreinforced cement slurries and tar coats applied over damp slabs crack under movement, trapping water inside building masonry.',
        },
        {
          title: 'Building Repairs: Untreated Rebar & Rigid Fillers',
          description:
            'Cosmetic crack pastes spread directly over corroding rebar without rust passivation, causing spalling concrete chunks to break off.',
        },
        {
          title: 'Painting: Trapped Moisture & Blistering',
          description:
            'Generic acrylic emulsions rolled over damp plaster, trapping hydrostatic vapor and causing paint bubbling, flaking, and black mold.',
        },
        {
          title: 'False Ceiling: Sagging Discolored Gypsum',
          description:
            'Moisture-sensitive boards and unrated tin channels that warp, rust, and collapse under hidden seepage loads.',
        },
        {
          title: 'Zero Technical Accountability',
          description:
            'Fragmented casual labor with zero engineering oversight and no accountability when next monsoon hits.',
        },
      ],
      outcome: 'Re-leakage, peeling paint & structural spalling within 3–6 months.',
    },
    slnStandard: {
      title: 'SLN 4-Pillar Engineered Standard',
      subtitle: 'Unified Civil Engineering Across All 4 Disciplines',
      points: [
        {
          title: 'Waterproofing: Monolithic 400% Elongation Elastomers',
          description:
            'Hydrostatic head pressure calculation, substrate core-sampling, and deep crystalline PU barrier injection that flexes with structural movement.',
        },
        {
          title: 'Building Repairs: Rebar Rust Passivation & Grouting',
          description:
            'Full mechanical concrete chipping, anti-corrosion zinc rebar priming, epoxy shear crack stitching, and polymer-modified micro-concreting.',
        },
        {
          title: 'Painting: Monsoon Weather-Shield Acrylics',
          description:
            'Anti-carbonation primers, crack-bridging intermediate films, and breathable elastomeric topcoats that withstand heavy monsoon downpours.',
        },
        {
          title: 'False Ceiling: Moisture-Resistant Acoustic Systems',
          description:
            'Galvanized steel grid framing with zero corrosion risk, water-resistant gypsum paneling, and integrated indirect LED cove channels.',
        },
        {
          title: 'Direct Senior Engineer Oversight & Handover',
          description:
            'Licensed civil engineers supervise every application on-site, providing itemized technical reports and scheduled post-monsoon audits.',
        },
      ],
      outcome: 'Monolithic, permanent seal backed by three generations of engineering mastery (Past, Present & Future).',
    },
  },
  principles: [
    {
      title: 'Scientific Diagnosis',
      description:
        'We never guess. We measure substrate moisture levels, check slab gradient falls, and trace hydrostatic capillary paths with electronic meters before recommending solutions.',
      icon: 'Search',
      color: '#0284c7',
    },
    {
      title: 'Certified Chemistry',
      description:
        'We exclusively specify tested formulations from global chemical leaders—Fosroc, Dr. Fixit, Sika, and Asian Paints SmartCare—mixed strictly to manufacturer ratios.',
      icon: 'FlaskConical',
      color: '#0891b2',
    },
    {
      title: 'Documented Accountability',
      description:
        'Every project carries itemized engineering specifications, standardized quality sign-offs, and scheduled annual post-monsoon technical audits.',
      icon: 'ShieldCheck',
      color: '#0284c7',
    },
    {
      title: 'Direct Engineer Oversight',
      description:
        'Qualified civil engineers oversee substrate grinding, primer bonding, joint reinforcing, and final topcoats. We never leave sites to unguided casual labor.',
      icon: 'HardHat',
      color: '#0f172a',
    },
  ],
  ctaBanner: {
    title: 'Ready for Permanent Zero-Leak Protection?',
    subtitle: 'Consult With Our Senior Engineers Today',
    description:
      'Contact SLN Engineers Projects Pvt. Ltd. We provide comprehensive precision moisture diagnostic surveys, clear technical proposals, and itemized engineering specifications for permanent protection.',
  },
};

const AboutContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: DEFAULT_ABOUT_CONTENT.hero.badge },
      title: { type: String, default: DEFAULT_ABOUT_CONTENT.hero.title },
      description: { type: String, default: DEFAULT_ABOUT_CONTENT.hero.description },
    },
    trustMetrics: {
      type: Array,
      default: DEFAULT_ABOUT_CONTENT.trustMetrics,
    },
    generationsRoadmap: {
      sectionTitle: { type: String, default: DEFAULT_ABOUT_CONTENT.generationsRoadmap.sectionTitle },
      sectionSubtitle: { type: String, default: DEFAULT_ABOUT_CONTENT.generationsRoadmap.sectionSubtitle },
      cards: { type: Array, default: DEFAULT_ABOUT_CONTENT.generationsRoadmap.cards },
    },
    slnDifference: {
      sectionTitle: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.sectionTitle },
      sectionSubtitle: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.sectionSubtitle },
      contractorApproach: {
        title: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.title },
        subtitle: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.subtitle },
        points: { type: Array, default: DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.points },
        outcome: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.contractorApproach.outcome },
      },
      slnStandard: {
        title: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.title },
        subtitle: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.subtitle },
        points: { type: Array, default: DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.points },
        outcome: { type: String, default: DEFAULT_ABOUT_CONTENT.slnDifference.slnStandard.outcome },
      },
    },
    principles: {
      type: Array,
      default: DEFAULT_ABOUT_CONTENT.principles,
    },
    ctaBanner: {
      title: { type: String, default: DEFAULT_ABOUT_CONTENT.ctaBanner.title },
      subtitle: { type: String, default: DEFAULT_ABOUT_CONTENT.ctaBanner.subtitle },
      description: { type: String, default: DEFAULT_ABOUT_CONTENT.ctaBanner.description },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
