import mongoose from 'mongoose';

const trustMetricSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, 'Metric value (e.g., 40+ Yrs) is required'],
      trim: true,
      maxlength: [60, 'Metric value cannot exceed 60 characters'],
    },
    label: {
      type: String,
      required: [true, 'Metric label (e.g., Continuous Contracting Practice) is required'],
      trim: true,
      maxlength: [120, 'Metric label cannot exceed 120 characters'],
    },
    icon: {
      type: String,
      default: 'ShieldCheck',
      trim: true,
    },
    color: {
      type: String,
      default: '#0284c7',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TrustMetric = mongoose.model('TrustMetric', trustMetricSchema);
export default TrustMetric;
