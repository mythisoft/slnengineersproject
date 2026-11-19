import mongoose from 'mongoose';

const disciplineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Discipline name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Discipline slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortCategory: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      default: 'IS Certified',
      trim: true,
    },
    badge: {
      type: String,
      default: 'Core Discipline',
      trim: true,
    },
    eyebrow: {
      type: String,
      default: 'Specialized Discipline',
      trim: true,
    },
    ctaText: {
      type: String,
      default: 'Book Inspection',
      trim: true,
    },
    ctaLink: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'Layers',
    },
    accentColor: {
      type: String,
      default: '#0284c7',
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Discipline = mongoose.model('Discipline', disciplineSchema);
export default Discipline;
