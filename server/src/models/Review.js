import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewLinkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReviewLink',
      default: null,
    },
    token: {
      type: String,
      default: '',
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    projectTitle: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
      index: true,
    },
    feedbackText: {
      type: String,
      required: [true, 'Written feedback is required'],
      trim: true,
      minlength: [5, 'Feedback must be at least 5 characters'],
      maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    customerName: {
      type: String,
      trim: true,
      default: 'Verified Customer',
    },
    consentToPublish: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    showOnHome: {
      type: Boolean,
      default: false,
      index: true,
    },
    homeOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isSpam: {
      type: Boolean,
      default: false,
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ isApproved: 1, consentToPublish: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
export default Review;
