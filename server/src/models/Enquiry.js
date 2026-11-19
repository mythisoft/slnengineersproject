import mongoose from 'mongoose';

const internalNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const enquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Property or project location is required'],
      trim: true,
    },
    serviceRequired: {
      type: String,
      required: [true, 'Service required must be selected'],
      trim: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },
    problemDescription: {
      type: String,
      required: [true, 'Description of the problem is required'],
      trim: true,
    },
    photos: [
      {
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    preferredContactMethod: {
      type: String,
      enum: ['Phone', 'WhatsApp', 'Email'],
      default: 'Phone',
    },
    consentGiven: {
      type: Boolean,
      required: [true, 'Consent to privacy notice is required'],
      default: false,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Site Inspection', 'Quotation Sent', 'Converted', 'Closed'],
      default: 'New',
      index: true,
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    internalNotes: [internalNoteSchema],
    followUpDate: {
      type: Date,
      default: null,
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

enquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
