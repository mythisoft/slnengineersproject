import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    disciplineId: {
      type: String,
      default: 'waterproofing',
      index: true,
    },
    disciplineName: {
      type: String,
      default: 'Waterproofing Solutions',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    categoryLabel: {
      type: String,
      default: '',
    },
    categoryKey: {
      type: String,
      default: '',
    },
    warranty: {
      type: String,
      default: 'Up to 10-Yr Warranty',
    },
    protocol: {
      type: String,
      default: 'SLN Hydro-Shield Protocol',
    },
    standard: {
      type: String,
      default: 'IS 1346 Certified',
    },
    accentColor: {
      type: String,
      default: '#0284c7',
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
      default: 'ShieldCheck',
    },
    iconType: {
      type: String,
      default: 'droplets',
    },
    coverImage: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    benefits: [
      {
        type: String,
      },
    ],
    advantages: [
      {
        type: String,
      },
    ],
    technicalHighlights: [
      {
        type: String,
      },
    ],
    specifications: [
      {
        type: String,
      },
    ],
    publicationStatus: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-fill alias fields before saving
serviceSchema.pre('save', function (next) {
  if (!this.description && this.fullDescription) {
    this.description = this.fullDescription;
  }
  if (!this.fullDescription && this.description) {
    this.fullDescription = this.description;
  }
  if (!this.image && this.coverImage) {
    this.image = this.coverImage;
  }
  if (!this.coverImage && this.image) {
    this.coverImage = this.image;
  }
  if ((!this.advantages || this.advantages.length === 0) && this.benefits && this.benefits.length > 0) {
    this.advantages = this.benefits;
  }
  if ((!this.benefits || this.benefits.length === 0) && this.advantages && this.advantages.length > 0) {
    this.benefits = this.advantages;
  }
  if ((!this.specifications || this.specifications.length === 0) && this.technicalHighlights && this.technicalHighlights.length > 0) {
    this.specifications = this.technicalHighlights;
  }
  if ((!this.technicalHighlights || this.technicalHighlights.length === 0) && this.specifications && this.specifications.length > 0) {
    this.technicalHighlights = this.specifications;
  }
  next();
});

export const Service = mongoose.model('Service', serviceSchema);
export default Service;

const initializationSchema = new mongoose.Schema(
  {
    _id: { type: String },
  },
  { versionKey: false }
);

export const ServiceInitialization = mongoose.model(
  'ServiceInitialization',
  initializationSchema
);
