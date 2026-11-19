import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '/sln-logo.png',
      trim: true,
    },
    isCompanyLogoBanner: {
      type: Boolean,
      default: false,
    },
    durationSeconds: {
      type: Number,
      default: 6,
      min: 1,
      max: 60,
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    eyebrow: {
      type: String,
      default: 'Precision Structural Waterproofing',
      trim: true,
    },
    foundedText: {
      type: String,
      default: '',
      trim: true,
    },
    headline: {
      type: String,
      default: 'Advanced Waterproofing,',
      trim: true,
    },
    highlightedHeadline: {
      type: String,
      default: 'engineered for decades.',
      trim: true,
    },
    description: {
      type: String,
      default: 'High-pressure polyurethane injection, crystalline tanking, and elastomeric membrane systems that stop active groundwater ingress and structural dampness permanently.',
      trim: true,
    },
    primaryCtaText: {
      type: String,
      default: 'Book Free Inspection',
      trim: true,
    },
    secondaryCtaText: {
      type: String,
      default: 'WhatsApp Senior Engineer',
      trim: true,
    },
    metrics: {
      type: [
        new mongoose.Schema(
          {
            value: { type: String, required: true, trim: true },
            label: { type: String, required: true, trim: true },
          },
          { _id: false }
        ),
      ],
      default: [
        { value: '100%', label: 'Active Leak Defense' },
        { value: '500+ Bar', label: 'Injection Capacity' },
        { value: '10-Year', label: 'Written Warranty' },
      ],
    },
    bannerServices: {
      type: [
        new mongoose.Schema(
          {
            name: { type: String, required: true, trim: true },
            shortCategory: { type: String, default: '', trim: true },
            tag: { type: String, default: '', trim: true },
            icon: { type: String, default: 'Droplets', trim: true },
            accentColor: { type: String, default: '#38bdf8', trim: true },
            targetBannerIndex: { type: Number, default: 1 },
          },
          { _id: true }
        ),
      ],
      default: [
        {
          name: 'Waterproofing Solutions',
          shortCategory: 'Active Leak Defense & Crystalline Tanking',
          tag: 'IS 1346 Certified',
          icon: 'Droplets',
          accentColor: '#38bdf8',
          targetBannerIndex: 1,
        },
        {
          name: 'Interior & Exterior Painting',
          shortCategory: 'Weather-Shield & Aesthetic Finishes',
          tag: 'UV Weather-Shield',
          icon: 'Paintbrush',
          accentColor: '#f59e0b',
          targetBannerIndex: 1,
        },
        {
          name: 'Building Repairs & Restoration',
          shortCategory: 'Structural Crack Stitching & Concrete Rehab',
          tag: 'Structural Defense',
          icon: 'Building2',
          accentColor: '#029746',
          targetBannerIndex: 1,
        },
        {
          name: 'False Ceiling & Interior Work',
          shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
          tag: 'Acoustic & Gypsum',
          icon: 'Layers',
          accentColor: '#fbbf24',
          targetBannerIndex: 1,
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
