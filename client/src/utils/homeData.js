import React from 'react';
import {
  Search,
  FlaskConical,
  ShieldCheck,
  HardHat,
  Shield,
  Award,
  Sparkles,
  Layers,
  Droplets,
  Paintbrush,
  Building2,
  CheckCircle,
  Hammer,
  Wrench,
  Clock,
  Star,
  Users,
} from 'lucide-react';

export const TRUST_CARD_ICONS = [
  { id: 'Search', label: 'Search (Diagnosis & Inspection)', icon: Search },
  { id: 'FlaskConical', label: 'FlaskConical (Chemical Formulations)', icon: FlaskConical },
  { id: 'ShieldCheck', label: 'ShieldCheck (Quality Handover)', icon: ShieldCheck },
  { id: 'HardHat', label: 'HardHat (Engineer Oversight)', icon: HardHat },
  { id: 'Shield', label: 'Shield (Structural Protection)', icon: Shield },
  { id: 'Award', label: 'Award (Certified Excellence)', icon: Award },
  { id: 'Sparkles', label: 'Sparkles (Premium Finishing)', icon: Sparkles },
  { id: 'Layers', label: 'Layers (Multi-Discipline Engineering)', icon: Layers },
  { id: 'Droplets', label: 'Droplets (Waterproofing)', icon: Droplets },
  { id: 'Paintbrush', label: 'Paintbrush (Weather-Shield Painting)', icon: Paintbrush },
  { id: 'Building2', label: 'Building2 (Structural Restoration)', icon: Building2 },
  { id: 'CheckCircle', label: 'CheckCircle (Verified Standards)', icon: CheckCircle },
  { id: 'Hammer', label: 'Hammer (Civil Execution)', icon: Hammer },
  { id: 'Wrench', label: 'Wrench (Rehabilitation)', icon: Wrench },
  { id: 'Clock', label: 'Clock (Four Decades Practice)', icon: Clock },
  { id: 'Users', label: 'Users (Generational Lineage)', icon: Users },
];

export const renderTrustCardIcon = (iconName, size = 18, className = '') => {
  const match = TRUST_CARD_ICONS.find((item) => item.id === iconName);
  const IconComponent = match ? match.icon : Search;
  return React.createElement(IconComponent, { size, className });
};

export const DEFAULT_HOME_CONTENT = {
  // 1. Core Practice / 4 Pillars Section (Section 2.5)
  pillarsSection: {
    eyebrow: 'Specialized Civil Engineering',
    title: 'Four Disciplines. One Trusted Civil Engineering Standard.',
    description:
      'Backed by over 40 years of continuous practice across four specialized pillars. Explore our proven methodologies, authorized chemical formulations, and verified field transformations.',
    cardHeaderTitle: 'Execution Discipline Pillars',
    cardHeaderSubtitle: 'Click any image or pillar name to view its specialized civil engineering services',
  },

  // 2. Proven Field Transformations (Section 3)
  transformationsSection: {
    eyebrow: 'Proven Transformation',
    title: 'Documented Proof: Real Field Transformations',
    description:
      'Every project is engineered, executed, and verified on site. Drag the slider to inspect how hydrostatic seepage, structural cracks, and weathered surfaces are permanently restored.',
    pillSelectorLabel: 'View Transformation by Discipline Pillar:',
  },

  // 3. Featured Case Studies Section (Section 4)
  caseStudiesSection: {
    eyebrow: 'Case Studies',
    title: 'Featured Civil Engineering Case Studies',
    description:
      'Real restoration projects documented with root-cause diagnostics, authorized chemical formulations, and verified results.',
    ctaText: 'View Entire Portfolio',
    ctaLink: '/projects',
  },

  // 4. Our Lineage / Why Trust Section (Section 5)
  lineageSection: {
    eyebrow: 'Our Lineage',
    title: 'Why Property Owners Trust SLN Engineers',
    description:
      'Carrying forward three generations of civil engineering integrity. Where conventional contractors apply temporary surface patches, our licensed engineers diagnose root-cause moisture paths to deliver permanent structural protection.',
    ctaText: 'View Google Reviews',
    ctaLink: '/reviews',
    trustCards: [
      {
        icon: 'Search',
        title: 'Scientific Diagnosis',
        description: 'Thermal imaging & substrate core checks',
      },
      {
        icon: 'FlaskConical',
        title: 'Industrial Polyurethanes',
        description: '400% elongation elastic membranes',
      },
      {
        icon: 'ShieldCheck',
        title: 'Quality Engineering Handover',
        description: 'Standardized compliance + technical audits',
      },
      {
        icon: 'HardHat',
        title: 'Direct Engineer Oversight',
        description: 'Qualified civil engineers on every site',
      },
    ],
  },

  // 5. Authentic Client Voices & Reviews Section (Section 8)
  reviewsSection: {
    eyebrow: 'Authentic Client Voices',
    title: 'Verified Client Reviews & Handover Ratings',
    description:
      'Direct feedback from residential homeowners, apartment associations, and commercial facility managers across Hyderabad and Telangana.',
    ctaText: 'Write a Google Review',
    ctaLink: '/reviews',
    googleBanner: {
      headline: 'Have You Used SLN Engineers Services?',
      description:
        'We believe in 100% transparent client feedback. Share your candid review on our official Google Business listing.',
      ctaText: 'Write a Google Review',
      ctaLink:
        'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D',
      tagline: 'Trusted by Generations',
    },
  },

  // 6. Bottom Contact CTA Band (Section 8 Bottom)
  bottomCtaSection: {
    eyebrow: 'Ready for Zero-Leak Protection?',
    title: 'Protect Your Structure with Licensed Civil Engineers',
    description:
      'Schedule an on-site technical inspection today. Our senior engineers will survey your property with non-destructive thermal moisture meters and provide an itemized technical diagnostic proposal.',
    primaryCtaText: 'Book Site Visit',
    primaryCtaLink: '/contact',
    phoneCtaText: 'Call {phone}',
    whatsappCtaText: 'WhatsApp',
  },
};
