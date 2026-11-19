import mongoose from 'mongoose';

const glimpseSettingSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      default: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-mason-working-with-mortar-and-trowel-41885-large.mp4',
    },
    durationSeconds: {
      type: Number,
      default: 3,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'Specialized Civil Engineering in Action',
    },
    badgeText: {
      type: String,
      default: 'Civil Engineering in Action • 3s Glimpse',
    },
  },
  { timestamps: true }
);

export default mongoose.model('GlimpseSetting', glimpseSettingSchema);
