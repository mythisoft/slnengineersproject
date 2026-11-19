import mongoose from 'mongoose';

const pillarCardSchema = new mongoose.Schema(
  {
    pillarId: {
      type: String,
      required: [true, 'Pillar ID is required'],
      trim: true,
      lowercase: true,
    },
    pillarName: {
      type: String,
      required: [true, 'Pillar Name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    accentColor: {
      type: String,
      default: '#0284c7',
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

pillarCardSchema.index({ order: 1, isActive: 1 });

export const PillarCard = mongoose.model('PillarCard', pillarCardSchema);
export default PillarCard;
