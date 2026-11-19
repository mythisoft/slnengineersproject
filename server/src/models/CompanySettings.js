import mongoose from 'mongoose';

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'SLN Engineers Projects Pvt. Ltd.',
      required: true,
    },
    tagline: {
      type: String,
      default: 'Restoration for Three Generations',
      required: true,
    },
    businessType: {
      type: String,
      default: 'Waterproofing, restoration and painting contracting services',
    },
    logoUrl: {
      type: String,
      default: '/sln-logo.png',
    },
    brandNameLine1: {
      type: String,
      default: 'SLN ENGINEERS',
    },
    brandNameLine2: {
      type: String,
      default: 'PROJECTS PVT. LTD.',
    },
    logoNameColor: {
      type: String,
      default: '#029746',
    },
    phone: {
      type: String,
      default: '+91 8977668776',
    },
    emergencyPhone: {
      type: String,
      default: '+91 8977668776',
    },
    email: {
      type: String,
      default: 'contact@slnengineers.com',
    },
    whatsappNumber: {
      type: String,
      default: '+91 8977668776',
    },
    whatsappDefaultMessage: {
      type: String,
      default: 'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.',
    },
    address: {
      street: { type: String, default: 'Medipally, Hyderabad' },
      area: { type: String, default: 'Hyderabad, Telangana' },
      city: { type: String, default: 'Hyderabad' },
      state: { type: String, default: 'Telangana' },
      pincode: { type: String, default: '500098' },
      country: { type: String, default: 'India' },
    },
    googleReviewUrl: {
      type: String,
      default: 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D',
    },
    googleQrCodeDataUrl: {
      type: String,
      default: '',
    },
    googleQrUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    customerReviewUrl: {
      type: String,
      default: '',
    },
    customerQrCodeDataUrl: {
      type: String,
      default: '',
    },
    customerQrUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    customerQrVersion: {
      type: String,
      default: 'v1',
    },
    reviewBaseUrl: {
      type: String,
      default: 'http://localhost:5173',
    },
    businessHours: {
      weekdays: { type: String, default: 'Monday – Saturday: 8:30 AM – 7:30 PM' },
      sunday: { type: String, default: 'Sunday: Emergency Leak Response Only' },
    },
    statsConfig: {
      yearsExperience: { type: String, default: '3 Generations (40+ Years)' },
      projectsCompleted: { type: String, default: '1,200+' },
      satisfactionRate: { type: String, default: '99.4%' },
      warrantyAssurance: { type: String, default: 'Up to 10 Years' },
    },
    servicesPageContent: {
      type: Object,
      default: {},
    },
    projectsPageContent: {
      type: Object,
      default: {},
    },
    reviewsPageContent: {
      type: Object,
      default: {},
    },
    homePageContent: {
      type: Object,
      default: {},
    },
    navbarConfig: {
      type: Object,
      default: {},
    },
    footerDeveloperCredit: {
      type: Object,
      default: {
        isEnabled: true,
        prefixText: 'Designed & Developed by',
        companyName: 'Mythisoft Innovations Pvt. Ltd.',
        websiteUrl: 'https://mythisoft.com',
        badgeText: 'Technology Partner',
        openInNewTab: true,
      },
    },
    demoNotice: {
      type: String,
      default: 'This platform contains realistic demonstration content for SLN Engineers Projects Pvt. Ltd. Contact details, project references, and credentials can be customized via the Admin Dashboard.',
    },
  },
  {
    timestamps: true,
  }
);

export const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);
export default CompanySettings;
