import mongoose from 'mongoose';

const mediaItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    caption: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    serviceCategory: {
      type: String,
      required: [true, 'Service category is required'],
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
    serviceTitle: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    warrantyYears: {
      type: String,
      default: '10-Year',
    },
    warrantyTitle: {
      type: String,
      default: 'Written Certificate of Workmanship Warranty',
    },
    formulation: {
      type: [String],
      default: [],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },
    location: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true,
    },
    clientReference: {
      type: String,
      required: [true, 'Client reference or property designation is required'],
      trim: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    problemDescription: {
      type: String,
      required: [true, 'Problem description is required'],
    },
    inspectionFindings: {
      type: String,
      required: [true, 'Inspection findings are required'],
    },
    workPerformed: {
      type: String,
      required: [true, 'Work performed details are required'],
    },
    materialsUsed: {
      type: String,
      required: [true, 'Materials and treatment used are required'],
    },
    beforeMedia: [mediaItemSchema],
    duringMedia: [mediaItemSchema],
    afterMedia: [mediaItemSchema],
    completionDate: {
      type: Date,
      required: [true, 'Project completion date is required'],
    },
    warrantyDetails: {
      type: String,
      default: 'Standard 5-Year Leak-Proof Workmanship Warranty',
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    customerConsentPublished: {
      type: Boolean,
      required: [true, 'Customer consent for publication status is required'],
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    showOnHome: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredUpdatedAt: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ serviceCategory: 1, isPublished: 1 });
projectSchema.index({ isFeatured: 1, isPublished: 1 });

export const Project = mongoose.model('Project', projectSchema);
export default Project;
