import { matchesDiscipline } from './servicesData';

export const LOCAL_STORAGE_PROJECTS_KEY = 'sln_custom_projects';

// Standard 12 Verified Engineering Projects across all 4 Core Disciplines
export const DEFAULT_PROJECTS = [
  // -------------------------------------------------------------------------
  // 1. WATERPROOFING SOLUTIONS (4 Projects)
  // -------------------------------------------------------------------------
  {
    id: '01',
    _id: 'proj-01',
    slug: 'penthouse-roof-terrace-garden-waterproofing-whitefield-villa',
    title: 'Penthouse Roof & Terrace Garden Waterproofing at Palm Meadows Villa',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    serviceCategory: 'Terrace and roof waterproofing',
    serviceTitle: 'Terrace & Roof Waterproofing',
    location: 'Palm Meadows Villa, Medipally, Hyderabad',
    clientReference: 'Luxury Villa #42 (Mr. Ramesh Sundaram)',
    completionDate: '2026-03-12',
    date: 'Mar 2026',
    problemDescription:
      'Severe water seepage through terrace floor expansion joints causing recurring damp patches and electrical conduit moisture in the master bedroom suite directly below.',
    inspectionFindings:
      'Thermal imaging and electronic moisture detection identified capillary water tracking across 18 linear meters of fractured brick-bat coba screed, with saturated porous mortar under the decorative planter borders.',
    workPerformed:
      'Stripped loose debonded substrate, routed and sealed perimeter joints with polyurethane elastomer, installed 200 GSM fiberglass reinforcing mesh, applied 3 coats of aliphatic polyurethane membrane, and finished with UV-reflective solar cooling coat.',
    materialsUsed:
      'Dr. Fixit Fastflex Elastomeric Membrane, Fosroc Nitoseal PU40, SikaTop Seal-107, 200 GSM Fiberglass Woven Mesh.',
    formulation: [
      'Dr. Fixit Fastflex Elastomeric Membrane',
      'Fosroc Nitoseal PU40 Polyurethane Sealant',
      'SikaTop Seal-107 Polymer Slurry',
      '200 GSM Woven Fiberglass Reinforcement',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: 'Written Certificate of Waterproofing Assurance',
    warrantyDetails: '10-Year Leak-Proof Workmanship & Materials Handover Warranty',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Deteriorated terrace screed showing ponding water and hairline shrinkage cracks',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: High-tensile fiberglass mesh embedment into primary elastomeric slurry coat',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Seamless monolithic waterproof shield with solar-reflective protective topcoat',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: true,
    showOnHome: true,
    customerConsentPublished: true,
  },
  {
    id: '02',
    _id: 'proj-02',
    slug: 'negative-side-basement-tanking-pu-chemical-injection-tech-park',
    title: 'Negative-Side Basement Tanking & PU Chemical Injection at Corporate Tower',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    serviceCategory: 'Basement waterproofing',
    serviceTitle: 'Basement & Deep Tanking',
    location: 'Hitec City / Madhapur, Hyderabad',
    clientReference: 'Corporate Tower B2 Underground Parking (-6.0m Subgrade)',
    completionDate: '2026-02-18',
    date: 'Feb 2026',
    problemDescription:
      'High monsoon groundwater table resulting in active water gushing through retaining wall cold joints and elevator pit floor fissures at -6.0m subgrade.',
    inspectionFindings:
      'Hydrostatic pressure head exceeding 1.8 bar causing continuous running leaks through retaining wall tie-rod holes and construction cold joints.',
    workPerformed:
      'Drilled 14mm angled injection ports into active fissure paths, installed high-pressure mechanical packers, injected hydrophobic polyurethane resin to stop running water in 45 seconds, followed by complete crystalline slurry tanking.',
    materialsUsed:
      'Fosroc Renderoc RG, Sika Injection-201 CE flexible polyurethane foam, Xypex Concentrate crystalline tanking slurry.',
    formulation: [
      'Fosroc Renderoc RG High-Strength Grout',
      'Sika Injection-201 CE Hydrophobic PU Foam',
      'Xypex Concentrate Crystalline Tanking Slurry',
      'High-Pressure Steel Mechanical Injection Packers',
    ],
    warrantyYears: '8-Year',
    warrantyTitle: 'Structural Hydrostatic Barrier Warranty',
    warrantyDetails: '8-Year Subgrade Hydrostatic Water Containment Guarantee',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Active hydrostatic running leaks and severe salt efflorescence on basement retaining wall',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: High-pressure electric piston pumping of hydrophobic polyurethane resin at 200 bar',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Bone-dry retaining wall sealed with deep-penetration crystalline barrier',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },
  {
    id: '03',
    _id: 'proj-03',
    slug: 'sunken-slab-bathroom-wet-area-containment-jubilee-enclave',
    title: 'Sunken Slab Bathroom Waterproofing & Pipe Collar Sealing at Jubilee Enclave',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    serviceCategory: 'Bathroom and wet-area waterproofing',
    serviceTitle: 'Bathroom & Wet-Area Waterproofing',
    location: 'Jubilee Hills, Hyderabad',
    clientReference: '4BHK Residence #104 (Dr. Anita Narayan)',
    completionDate: '2026-02-04',
    date: 'Feb 2026',
    problemDescription:
      'Chronic seepage from 3 upper-floor master bathroom sunken slabs causing damp ceiling patches, paint peeling, and gypsum false ceiling sagging on lower floors.',
    inspectionFindings:
      'Failed PVC drain pipe core collars, lack of perimeter coving, and porous brick-bat sunken filling channeling water directly through structural slab micro-fissures.',
    workPerformed:
      'Excavated damaged sunken fill, applied rapid-setting waterstop plug around plumbing sleeves, cast 50mm polymer-modified fillet covings at all 90° corners, and double-coated with acrylic cementitious slurry.',
    materialsUsed:
      'Laticrete Hydro Ban, SikaTop Seal-107, Fosroc Conbextra GP, Non-Shrink Hydraulic Waterplug.',
    formulation: [
      'Laticrete Hydro Ban Waterproofing Membrane',
      'SikaTop Seal-107 Dual Component Slurry',
      'Fosroc Conbextra GP Non-Shrink Grout',
      'Fosroc Renderoc Plug Rapid-Setting Waterstop',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: 'Wet-Area Containment Warranty',
    warrantyDetails: '10-Year Zero-Leakage Guarantee on Sunken Slabs & Plumbing Penetrations',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Saturated plumbing core penetrations and debonded sunken mortar bed',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Reinforced 90° coving and pipe sleeve elastomeric collar casting',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Flood-tested continuous hydrostatic containment ready for luxury tile laying',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },
  {
    id: '04',
    _id: 'proj-04',
    slug: 'thermal-injection-dpc-wall-dampness-remediation-heritage-estate',
    title: 'Chemical DPC Injection & Salt Efflorescence Remediation at Heritage Bungalow',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    serviceCategory: 'Wall dampness and leakage treatment',
    serviceTitle: 'Wall Dampness & Efflorescence Treatment',
    location: 'Banjara Hills, Hyderabad',
    clientReference: 'Ancestral Bungalow (The Reddy Estate)',
    completionDate: '2026-01-15',
    date: 'Jan 2026',
    problemDescription:
      'Severe rising capillary dampness up to 1.2m height across internal load-bearing brick walls, causing powdery salt crystallization, musty mildew odor, and peeling wall paint.',
    inspectionFindings:
      'Absence of physical damp-proof course (DPC) at plinth beam level; masonry core moisture reading exceeded 88% saturation.',
    workPerformed:
      'Drilled continuous horizontal injection ports at 100mm intervals along base plinth, injected low-viscosity siloxane micro-emulsion hydrophobic barrier, stripped salt-contaminated plaster, and rendered with breathable salt-retardant crystalline mortar.',
    materialsUsed:
      'Silane-Siloxane Micro-Emulsion DPC Fluid, Dr. Fixit Dampguard Classic, Salt-Neutralizing Acid Wash.',
    formulation: [
      'Silane-Siloxane Micro-Emulsion Hydrophobic Barrier',
      'Dr. Fixit Dampguard Classic Epoxy Coating',
      'Salt-Neutralizing Crystalline Render Matrix',
      'Breathable Microporous Anti-Efflorescence Primer',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: 'Capillary Moisture Defense Warranty',
    warrantyDetails: '10-Year Anti-Dampness & Rising Moisture Free Warranty',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Flaking paint blisters and powdery salt crystals across lower 1 meter of interior walls',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Precision angled bore-hole injection of hydrophobic siloxane chemical barrier',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Completely dry interior walls finished with smooth stain-resistant washable emulsion',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },

  // -------------------------------------------------------------------------
  // 2. INTERIOR & EXTERIOR PAINTING (3 Projects)
  // -------------------------------------------------------------------------
  {
    id: '05',
    _id: 'proj-05',
    slug: 'exterior-monsoon-weather-shield-painting-regency-enclave',
    title: 'Façade Re-pointing & Elastomeric Weather-Shielding at Regency Enclave',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    serviceCategory: 'Exterior weather-shield painting',
    serviceTitle: 'Exterior Monsoon Weather-Shield Painting',
    location: 'Jubilee Hills, Hyderabad',
    clientReference: 'Regency Enclave 8-Storey Residential Complex (RWA Board)',
    completionDate: '2026-01-29',
    date: 'Jan 2026',
    problemDescription:
      'Heavy wind-driven monsoon rains penetrating external plaster shrinkage cracks, soaking brickwork and causing algae stains across 35,000 sq ft exterior elevation.',
    inspectionFindings:
      'Multiple structural micro-settlement cracks on south-west elevation, combined with deteriorated window perimeter silicone seals and UV chalking of old paint.',
    workPerformed:
      'Erected safety suspended rope scaffolding, hydro-washed exterior walls, routed plaster fissures, filled with fiber-reinforced crack filler, resealed 64 window perimeters, and applied two coats of 100% acrylic elastomeric monsoon weather-shield.',
    materialsUsed:
      'Asian Paints Apex Ultima Protek Duralife, Fosroc Nitocote Wallguard, Dow Corning 789 Silicone Sealant.',
    formulation: [
      'Asian Paints Apex Ultima Protek Duralife 100% Acrylic',
      'Fosroc Nitocote Wallguard Elastomeric Coating',
      'Dow Corning 789 Structural Weatherproofing Silicone',
      'Polymer Modified Plaster Crack Bridging Paste',
    ],
    warrantyYears: '8-Year',
    warrantyTitle: 'Façade Weather-Shield Warranty',
    warrantyDetails: '8-Year Anti-Algae, Anti-Fading & Lotus Water-Repellency Warranty',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Weather-beaten external elevation with black fungal patches and plaster fissures',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: High-pressure hydro-washing and polymer joint stitching via suspended scaffold',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Rejuvenated exterior elevation with vibrant color and 8-year weather-shield durability',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: true,
    showOnHome: true,
    customerConsentPublished: true,
  },
  {
    id: '06',
    _id: 'proj-06',
    slug: 'luxury-interior-emulsion-stain-shield-gachibowli-condo',
    title: 'Luxury Washable Interior Emulsions & Surface Skimming at Gachibowli Penthouse',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    serviceCategory: 'Interior luxury architectural painting',
    serviceTitle: 'Interior Luxury Emulsions & Wall Finishes',
    location: 'Financial District, Gachibowli, Hyderabad',
    clientReference: 'Penthouse #28B (Executive Residence)',
    completionDate: '2026-02-22',
    date: 'Feb 2026',
    problemDescription:
      'Uneven wall plaster waviness, visible ceiling drywall joint tape lines, and low washability of existing paint in high-traffic living and dining spaces.',
    inspectionFindings:
      'Substrate undulations exceeding 4mm over 2-meter straightedge; prior builder coat had poor adhesion and high chalking.',
    workPerformed:
      'Machine-sanded all surfaces with dust-free orbital sanders, applied 3 coats of acrylic wall putty to achieve Level 5 smoothness, primed with anti-bacterial sealer, and sprayed luxury matte washable emulsion.',
    materialsUsed:
      'Asian Paints Royale Aspira Luxury Emulsion, Birla White Wall Care Putty, Ultra-Fine Acrylic Primer.',
    formulation: [
      'Asian Paints Royale Aspira Teflon Surface Protector',
      'Birla White Level 5 Acrylic Polymer Wall Putty',
      'Silver-Ion Anti-Bacterial Interior Primer',
      'Zero-VOC Non-Toxic Eco Emulsion Matrix',
    ],
    warrantyYears: '7-Year',
    warrantyTitle: 'Interior Luxury Finish Warranty',
    warrantyDetails: '7-Year Scrub-Proof Washable Finish & Color Retention Guarantee',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Dull interior walls showing surface waviness and drywall joint telegraphing',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: High-precision Level-5 acrylic skim coating and dustless orbital sanding',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Silky smooth, light-reflective luxury living room walls with Teflon stain resistance',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },
  {
    id: '07',
    _id: 'proj-07',
    slug: 'architectural-italian-stucco-feature-wall-hitec-city',
    title: 'Architectural Travertine & Italian Stucco Feature Walls at Corporate Headquarters',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    serviceCategory: 'Architectural wall textures and finishes',
    serviceTitle: 'Designer Architectural Wall Textures',
    location: 'Mindspace IT Park, Madhapur, Hyderabad',
    clientReference: 'Global Fintech HQ Reception & Boardroom Suites',
    completionDate: '2026-03-01',
    date: 'Mar 2026',
    problemDescription:
      'Corporate client required ultra-premium natural stone aesthetic without the structural load and high cost of imported marble cladding across a 4-storey double-height atrium.',
    inspectionFindings:
      'Substrate required fiber mesh reinforcement to prevent micro-fissuring across high-vibration elevator shafts.',
    workPerformed:
      'Applied base adhesive mortar with fiberglass mesh, hand-troweled 3 layers of genuine Italian limestone travertine stucco, burnished with stainless steel venetian trowels, and sealed with clear hydrophobic wax.',
    materialsUsed:
      'Oikos Travertino Romano, Grassello di Calce, Protective Hydrophobic Cera Wax.',
    formulation: [
      'Genuine Italian Marble Dust & Slaked Lime Stucco',
      'Oikos Travertino Romano Mineral Matrix',
      'Non-Yellowing Polyurethane Hydrophobic Glaze',
      'High-Adhesion Micro-Fiber Bonding Mortar',
    ],
    warrantyYears: '8-Year',
    warrantyTitle: 'Artisan Architectural Texture Warranty',
    warrantyDetails: '8-Year Crack-Resistant & Non-Yellowing Finish Guarantee',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Plain unfinished concrete atrium wall in newly constructed office tower',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Master artisan hand-troweling raw mineral lime and natural marble aggregate',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Stunning stone-veined textured feature elevation with natural light reflection',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },

  // -------------------------------------------------------------------------
  // 3. BUILDING REPAIRS & RESTORATION (3 Projects)
  // -------------------------------------------------------------------------
  {
    id: '08',
    _id: 'proj-08',
    slug: 'structural-crack-stitching-helical-ties-manikonda-tower',
    title: 'Structural Crack Stitching & Helical Tie Reinforcement at Manikonda Tower',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    serviceCategory: 'Structural crack stitching and grouting',
    serviceTitle: 'Structural Crack Stitching & Grouting',
    location: 'Manikonda / Puppalguda, Hyderabad',
    clientReference: '12-Storey Residential Tower (Tower C)',
    completionDate: '2026-02-10',
    date: 'Feb 2026',
    problemDescription:
      'Differential soil settlement caused severe diagonal shear cracks up to 4.5mm wide across 4 storeys of brick masonry and RCC beam junctions, posing structural safety concerns.',
    inspectionFindings:
      'Ultrasonic pulse velocity and crack-depth gauge revealed through-and-through shear fracture across exterior columns and masonry infills.',
    workPerformed:
      'Chased horizontal bed joints at 450mm vertical spacing, inserted 316-grade austenitic stainless steel helical stitching ties embedded in high-bond thixotropic grout, and low-pressure injected structural epoxy into all fractures.',
    materialsUsed:
      'Helifix Helibar 316 Stainless Steel Ties, HeliBond Grout, Sika Injection-451 High-Strength Structural Epoxy.',
    formulation: [
      'Helifix 316 Austenitic Stainless Steel Helical Ties',
      'HeliBond Thixotropic Non-Shrink Cementitious Grout',
      'Sika Injection-451 Low-Viscosity Structural Epoxy (>70 MPa)',
      'Fiber-Reinforced Structural Micro-Concrete Mortar',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: 'Monolithic Structural Integrity Warranty',
    warrantyDetails: '10-Year Load-Bearing Structural Stitching & Crack Stability Warranty',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: 4.5mm diagonal settlement fracture threatening masonry structural stability',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: High-tensile stainless steel helical bar insertion into mortar bed joints',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Completely restored monolithic structural strength with invisible patch finish',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: true,
    showOnHome: true,
    customerConsentPublished: true,
  },
  {
    id: '09',
    _id: 'proj-09',
    slug: 'concrete-spalling-rebar-passivation-secunderabad-rail-complex',
    title: 'Concrete Spalling Rehabilitation & Rebar Passivation at Secunderabad Commercial Depot',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    serviceCategory: 'Concrete spalling and carbonation rehab',
    serviceTitle: 'Concrete Carbonation & Spalling Rehabilitation',
    location: 'Secunderabad / Marredpally, Hyderabad',
    clientReference: 'Commercial Logistics & Warehouse Depot',
    completionDate: '2026-01-20',
    date: 'Jan 2026',
    problemDescription:
      'Atmospheric carbonation and moisture penetration caused internal rebar expansion, breaking off large concrete spalls from 16 structural columns and overhead parking deck beams.',
    inspectionFindings:
      'Phenolphthalein carbonation depth test showed 45mm deep matrix acidification; reinforcing steel had up to 25% section loss due to oxidation rust scale.',
    workPerformed:
      'Mechanically chipped loose spalled concrete, grit-blasted corroded steel rebars to SA 2.5 cleanliness, coated with zinc-rich epoxy passivation primer, rebuilt column profiles with polymer-modified structural mortar, and applied anti-carbonation barrier.',
    materialsUsed:
      'Fosroc Renderoc S2, Nitozinc Primer, Nitocote Dekguard Anti-Carbonation Coating.',
    formulation: [
      'Nitozinc Primer Active Zinc-Rich Corrosion Barrier',
      'Fosroc Renderoc S2 High-Strength Structural Mortar (45 MPa)',
      'Nitocote Dekguard Atmospheric Anti-Carbonation Shield',
      'Alkaline Steel Rebar Passivation Compound',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: 'RCC Structural Rehabilitation Warranty',
    warrantyDetails: '10-Year Rust-Passivation & Spalling Prevention Guarantee',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Severe concrete spalling with exposed rusting structural reinforcement steel',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Sandblasted steel passivated with active zinc primer and polymer mortar build',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Completely restored structural column dimensions with anti-carbonation shield',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },

  // -------------------------------------------------------------------------
  // 4. FALSE CEILING & INTERIOR WORK (3 Projects)
  // -------------------------------------------------------------------------
  {
    id: '10',
    _id: 'proj-10',
    slug: 'moisture-proof-gypsum-false-ceiling-madhapur-condos',
    title: 'Moisture-Resistant Gypsum False Ceilings with Ambient Cove Lighting at Madhapur',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    serviceCategory: 'Moisture resistant gypsum false ceilings',
    serviceTitle: 'Moisture-Resistant Gypsum False Ceilings',
    location: 'Madhapur / Hitec City, Hyderabad',
    clientReference: 'Luxury High-Rise Top Floor Apartments (Tower 4)',
    completionDate: '2026-03-05',
    date: 'Mar 2026',
    problemDescription:
      'Top-floor apartments experienced roof condensation causing standard gypsum plasterboards to sag, stain yellow, and harbor mildew around AC vents.',
    inspectionFindings:
      'Existing framing used light gauge 0.3mm non-galvanized studs with rusting screws; standard regular plasterboard had 22% moisture absorption.',
    workPerformed:
      'Demolished damaged ceilings, installed heavy-gauge 0.55mm Gypsteel zinc-coated suspension framework, fixed Saint-Gobain Gyproc Moisture-Resistant (green) boards, integrated indirect LED ambient cove drop details, and sealed with anti-mold jointing compounds.',
    materialsUsed:
      'Saint-Gobain Gyproc MR Plasterboards, Gypsteel Ultra GI Framing, Jointing Compound, Acoustic Silicone.',
    formulation: [
      'Saint-Gobain Gyproc 12.5mm Moisture-Resistant Plasterboard',
      'Gypsteel Ultra 550 MPA High-Yield Galvanized GI Framing',
      'Water-Repellent Silicone-Core Impregnation Matrix',
      'Fire-Rated Anti-Mildew Gyproc Jointing Compound',
    ],
    warrantyYears: '7-Year',
    warrantyTitle: 'Sag-Proof Moisture-Shield Warranty',
    warrantyDetails: '7-Year Anti-Sag, Humidity & Warping Protection Warranty',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Sagging and water-stained drywall ceiling under roof slab condensation',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Heavy-gauge 0.55mm Gypsteel anti-sag suspension grid laser-leveled installation',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Flawless architectural drop ceiling with warm indirect LED perimeter illumination',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: true,
    showOnHome: true,
    customerConsentPublished: true,
  },
  {
    id: '11',
    _id: 'proj-11',
    slug: 'acoustic-grid-mineral-fiber-ceilings-corporate-boardroom',
    title: 'Acoustic Mineral Fiber Ceiling Grid & Sound Damping at Tech Innovation Hub',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    serviceCategory: 'Acoustic modular grid ceilings',
    serviceTitle: 'Acoustic Modular Grid Ceilings',
    location: 'Gachibowli Financial District, Hyderabad',
    clientReference: 'R&D Innovation Center & 250-Seater Auditorium',
    completionDate: '2026-02-15',
    date: 'Feb 2026',
    problemDescription:
      'Excessive acoustic reverberation (RT60 > 2.4s) and HVAC equipment rumble inside corporate boardroom and conference facilities causing severe audio conferencing echo.',
    inspectionFindings:
      'Hard plaster surfaces reflected 92% of sound energy; ambient background HVAC noise measured 58 dBA.',
    workPerformed:
      'Engineered T24 exposed modular suspension grid, installed Armstrong high-density mineral fiber acoustic tiles with NRC 0.85 rating, installed perimeter acoustic caulking, and integrated clean-room return air troffers.',
    materialsUsed:
      'Armstrong Fine Fissured BioGuard Tiles, Silhouette T24 Grid, Sound Absorption Mineral Batts.',
    formulation: [
      'Armstrong High-Density Mineral Fiber Acoustic Tiles (NRC 0.85)',
      'Silhouette T24 Hot-Dipped Galvanized Steel Grid',
      'Anti-Microbial BioGuard Bio-Static Paint Coating',
      'Resilient Sound-Damping Acoustic Perimeter Gasket',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: 'Acoustic Performance Assurance Warranty',
    warrantyDetails: '10-Year Sound Dampening & Tile Integrity Warranty',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Echo-prone open ceiling with uninsulated metal HVAC ductwork noise',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Precision laser grid suspension and acoustic mineral batt insulation lay-in',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: Clean modular aesthetic with NRC 0.85 speech privacy clarity and low noise',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },
  {
    id: '12',
    _id: 'proj-12',
    slug: 'fire-resistant-drywall-partitioning-cyber-gateway',
    title: '2-Hour Fire-Resistant Drywall Partitions & Metal Stud Ceilings at Cyber Gateway',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    serviceCategory: 'Drywall partitions and cove ceilings',
    serviceTitle: 'Drywall Partitions & Cove Drop Ceilings',
    location: 'Cyber Gateway, Madhapur, Hyderabad',
    clientReference: 'Tier-3 Data Center & Operations Control Center',
    completionDate: '2026-01-10',
    date: 'Jan 2026',
    problemDescription:
      'Server farm facility required 2-hour certified passive fire separation partitions and humidity-controlled suspended ceilings conforming to National Building Code (NBC 2016).',
    inspectionFindings:
      'Heavy cabling trays and fire suppression gas pipelines required specialized vibration-damped ceiling hangers.',
    workPerformed:
      'Constructed 100mm heavy-duty C-stud drywall framing packed with 64 kg/m³ rockwool insulation, double-clad with 15mm Gyproc FireLine pink boards, sealed all cable tray penetrations with intumescent firestop pillows, and hung ceiling.',
    materialsUsed:
      'Saint-Gobain Gyproc FireLine 15mm, Rockwool Thermal Batts, Hilti Intumescent Firestop Sealant.',
    formulation: [
      'Saint-Gobain Gyproc FireLine 15mm Glass-Fiber Reinforced Board',
      '64 kg/m³ High-Density Non-Combustible Rockwool Insulation',
      'Hilti CP 606 Intumescent Firestop Mastic & Pillows',
      '0.7mm Heavy Gauge High-Tensile Steel Stud & Track',
    ],
    warrantyYears: '10-Year',
    warrantyTitle: '2-Hour Certified Firestop Warranty',
    warrantyDetails: '10-Year Passive Fire Protection & Structural Integrity Warranty',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
    beforeMedia: [
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Before: Unpartitioned server hall with exposed high-voltage cables and cable trays',
        type: 'image',
      },
    ],
    duringMedia: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        caption: 'During: Rockwool insulation packing and double-layer 15mm Gyproc FireLine installation',
        type: 'image',
      },
    ],
    afterMedia: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
        caption: 'After: NBC 2016 compliant 2-hour passive fire-safe partitions and clean ceiling finish',
        type: 'image',
      },
    ],
    isPublished: true,
    isFeatured: false,
    customerConsentPublished: true,
  },
];

// Helper to normalize any project object from API or local cache
export function normalizeProject(raw = {}, index = 0) {
  const id = String(raw.id || raw._id || index + 1).padStart(2, '0');
  const title = raw.title || 'Untitled Project Case Study';
  const slug =
    raw.slug ||
    title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const disciplineId =
    raw.disciplineId ||
    (raw.serviceCategory && String(raw.serviceCategory).toLowerCase().includes('paint')
      ? 'painting'
      : raw.serviceCategory && String(raw.serviceCategory).toLowerCase().includes('repair')
      ? 'repairs'
      : raw.serviceCategory && String(raw.serviceCategory).toLowerCase().includes('ceiling')
      ? 'false-ceiling'
      : 'waterproofing');

  const disciplineName =
    raw.disciplineName ||
    (disciplineId === 'painting'
      ? 'Interior & Exterior Painting'
      : disciplineId === 'repairs'
      ? 'Building Repairs & Restoration'
      : disciplineId === 'false-ceiling'
      ? 'False Ceiling & Interior Work'
      : 'Waterproofing Solutions');

  const image =
    raw.image ||
    raw.coverImage ||
    raw.afterMedia?.[0]?.url ||
    raw.beforeMedia?.[0]?.url ||
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80';

  let formulation = [];
  if (Array.isArray(raw.formulation) && raw.formulation.length > 0) {
    formulation = raw.formulation;
  } else if (typeof raw.materialsUsed === 'string' && raw.materialsUsed.trim()) {
    formulation = raw.materialsUsed.split(/[,•\n]+/).map((s) => s.trim()).filter(Boolean);
  } else {
    formulation = [
      'Industrial Civil Grade Formulation',
      'IS & ASTM Certified Specifications',
      'High-Tensile Reinforcement Matrix',
    ];
  }

  const beforeMedia = Array.isArray(raw.beforeMedia) && raw.beforeMedia.length > 0
    ? raw.beforeMedia
    : [{ url: image, caption: 'Before Treatment', type: 'image' }];

  const afterMedia = Array.isArray(raw.afterMedia) && raw.afterMedia.length > 0
    ? raw.afterMedia
    : [{ url: image, caption: 'After Engineering Restoration', type: 'image' }];

  return {
    ...raw,
    id,
    _id: raw._id || id,
    slug,
    title,
    disciplineId,
    disciplineName,
    serviceCategory: raw.serviceCategory || raw.serviceTitle || 'Civil Engineering Service',
    serviceTitle: raw.serviceTitle || raw.serviceCategory || title,
    location: raw.location || 'Hyderabad, Telangana',
    clientReference: raw.clientReference || 'Commercial / Residential Property',
    completionDate: raw.completionDate || new Date().toISOString(),
    date: raw.date || new Date(raw.completionDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    problemDescription: raw.problemDescription || raw.problem || 'Structural diagnostic survey and waterproofing defect containment.',
    problem: raw.problem || raw.problemDescription || 'Structural diagnostic survey and waterproofing defect containment.',
    inspectionFindings: raw.inspectionFindings || 'Substrate saturation and micro-crack pathways diagnosed.',
    workPerformed: raw.workPerformed || 'Substrate repair, multi-layer coating, and warranty handover.',
    materialsUsed: raw.materialsUsed || formulation.join(', '),
    formulation,
    warrantyYears: raw.warrantyYears || (raw.warrantyDetails && raw.warrantyDetails.includes('10') ? '10-Year' : '5-Year'),
    warrantyTitle: raw.warrantyTitle || raw.warrantyDetails || 'Written Certificate of Workmanship Warranty',
    warrantyDetails: raw.warrantyDetails || 'Standard 10-Year Leak-Proof Workmanship Warranty',
    image,
    coverImage: image,
    beforeMedia,
    afterMedia,
    duringMedia: Array.isArray(raw.duringMedia) ? raw.duringMedia : [],
    isPublished: raw.isPublished !== undefined ? Boolean(raw.isPublished) : true,
    showOnHome: Boolean(raw.showOnHome),
    isFeatured: Boolean(raw.isFeatured),
    featuredUpdatedAt: Number(raw.featuredUpdatedAt) || 0,
    customerConsentPublished: raw.customerConsentPublished !== undefined ? Boolean(raw.customerConsentPublished) : true,
  };
}

// Matches a project to a discipline (string slug/id or object)
export function matchesProjectDiscipline(project, discipline) {
  if (!project || !discipline) return false;
  return matchesDiscipline(project, discipline);
}

// Matches a project to a specific service category/title
export function matchesProjectService(project, serviceKey) {
  if (!project || !serviceKey) return false;
  const key = String(serviceKey).toLowerCase().trim();
  if (key === 'all') return true;

  const cat = String(project.serviceCategory || '').toLowerCase().trim();
  const title = String(project.serviceTitle || '').toLowerCase().trim();
  const sId = String(project.serviceId || '').toLowerCase().trim();

  return cat === key || title === key || sId === key || cat.includes(key) || title.includes(key);
}
