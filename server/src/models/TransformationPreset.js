import mongoose from 'mongoose';

const transformationPresetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120,
    },
    disciplineId: {
      type: String,
      default: 'waterproofing',
      trim: true,
      maxlength: 100,
    },
    disciplineName: {
      type: String,
      default: 'Waterproofing Solutions',
      trim: true,
      maxlength: 120,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUpdatedAt: {
      type: Number,
      default: 0,
    },
    coreCategory: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120,
      // Backward compatibility
    },
    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120,
    },
    caseStudySlug: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
    beforeImage: {
      type: String,
      required: true,
      trim: true,
    },
    afterImage: {
      type: String,
      required: true,
      trim: true,
    },
    beforeLabel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: 'Before Treatment',
    },
    afterLabel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: 'After Restoration',
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
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
  { timestamps: true }
);

export const TransformationPreset = mongoose.model('TransformationPreset', transformationPresetSchema);
export default TransformationPreset;

const initializationSchema = new mongoose.Schema(
  {
    _id: { type: String },
  },
  { versionKey: false }
);

export const TransformationPresetInitialization = mongoose.model(
  'TransformationPresetInitialization',
  initializationSchema
);
