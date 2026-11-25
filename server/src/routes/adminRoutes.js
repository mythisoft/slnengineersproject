import express from 'express';
import { adminLogin, adminLogout, getAdminProfile } from '../controllers/authController.js';
import {
  getDashboardStats,
  getAllServices,
  createService,
  updateService,
  deleteService,
  initDefaultServices,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  initDefaultProjects,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
  getAllCustomers,
  createCustomer,
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
  generateProjectReviewLink,
  getAllReviewLinks,
  toggleReviewLinkStatus,
  getGoogleReviewQRCode,
  updateGoogleReviewUrl,
  generateNewGoogleQRCode,
  resetGoogleQRCode,
  getCustomerReviewQRCode,
  updateCustomerReviewUrl,
  generateNewCustomerQRCode,
  resetCustomerQRCode,
  getAdminSocialLinks,
  updateSocialLink,
  getAdminSettings,
  updateAdminSettings,
  getAuditLogs,
  getServicePageContent,
  updateServicePageContent,
  resetServicePageContent,
  getReviewPageContent,
  updateReviewPageContent,
  resetReviewPageContent,
} from '../controllers/adminController.js';
import {
  getAllDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
  initDefaultDisciplines,
} from '../controllers/disciplineController.js';
import {
  getAdminPillarCards,
  createPillarCard,
  updatePillarCard,
  deletePillarCard,
  reorderPillarCards,
  updateGlimpseSettings,
} from '../controllers/pillarCardController.js';
import { protect, authorize } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { imageUpload, upload } from '../utils/mediaStorage.js';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  initDefaultBanners,
} from '../controllers/bannerController.js';
import {
  getAdminTransformations,
  createTransformation,
  updateTransformation,
  deleteTransformation,
} from '../controllers/transformationController.js';
import {
  getAdminTrustMetrics,
  createTrustMetric,
  updateTrustMetric,
  deleteTrustMetric,
  initDefaultTrustMetrics,
} from '../controllers/trustMetricController.js';
import {
  getAdminAboutContent,
  updateAboutContent,
  resetAboutContent,
} from '../controllers/aboutController.js';
import {
  getAdminContactContent,
  updateContactContent,
  resetContactContent,
} from '../controllers/contactController.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// ==================== AUTHENTICATION ====================
router.post('/auth/login', loginLimiter, adminLogin);
router.post('/auth/logout', protect, adminLogout);
router.get('/auth/me', protect, getAdminProfile);

// ==================== DASHBOARD ====================
router.get('/dashboard', protect, getDashboardStats);

// ==================== HOMEPAGE BANNERS ====================
router.get('/banners', protect, authorize('superadmin', 'admin'), getAdminBanners);
router.post('/banners/upload', protect, authorize('superadmin', 'admin'), imageUpload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  const url = await uploadFileToCloudinary(req.file, 'sln_waterproofing/banners');
  res.status(201).json({
    success: true,
    data: { url },
  });
}));
router.post('/banners', protect, authorize('superadmin', 'admin'), createBanner);
router.post('/banners/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultBanners);
router.put('/banners/:id', protect, authorize('superadmin', 'admin'), updateBanner);
router.delete('/banners/:id', protect, authorize('superadmin', 'admin'), deleteBanner);

// ==================== HERO TRUST METRICS TILES ====================
router.get('/trust-metrics', protect, authorize('superadmin', 'admin'), getAdminTrustMetrics);
router.post('/trust-metrics', protect, authorize('superadmin', 'admin'), createTrustMetric);
router.post('/trust-metrics/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultTrustMetrics);
router.put('/trust-metrics/:id', protect, authorize('superadmin', 'admin'), updateTrustMetric);
router.delete('/trust-metrics/:id', protect, authorize('superadmin', 'admin'), deleteTrustMetric);

// ==================== BEFORE & AFTER TRANSFORMATIONS ====================
router.get('/transformations', protect, authorize('superadmin', 'admin'), getAdminTransformations);
router.post('/transformations/upload', protect, authorize('superadmin', 'admin'), imageUpload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  const url = await uploadFileToCloudinary(req.file, 'sln_waterproofing/transformations');
  res.status(201).json({ success: true, data: { url } });
}));
router.post('/transformations', protect, authorize('superadmin', 'admin'), createTransformation);
router.put('/transformations/:id', protect, authorize('superadmin', 'admin'), updateTransformation);
router.delete('/transformations/:id', protect, authorize('superadmin', 'admin'), deleteTransformation);

// ==================== DISCIPLINE PILLARS ====================
router.get('/disciplines', protect, authorize('superadmin', 'admin'), getAllDisciplines);
router.post('/disciplines', protect, authorize('superadmin', 'admin'), createDiscipline);
router.post('/disciplines/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultDisciplines);
router.put('/disciplines/:id', protect, authorize('superadmin', 'admin'), updateDiscipline);
router.delete('/disciplines/:id', protect, authorize('superadmin', 'admin'), deleteDiscipline);

// ==================== HORIZONTAL PILLAR CARDS & GLIMPSE VIDEO ====================
router.get('/pillar-cards', protect, authorize('superadmin', 'admin'), getAdminPillarCards);
router.post('/pillar-cards', protect, authorize('superadmin', 'admin'), createPillarCard);
router.put('/pillar-cards/reorder', protect, authorize('superadmin', 'admin'), reorderPillarCards);
router.put('/pillar-cards/glimpse-settings', protect, authorize('superadmin', 'admin'), updateGlimpseSettings);
router.post('/pillar-cards/upload-image', protect, authorize('superadmin', 'admin'), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image or GIF file.' });
  }
  const url = await uploadFileToCloudinary(req.file, 'sln_waterproofing/pillar_cards');
  res.status(201).json({ success: true, data: { url } });
}));
router.post('/pillar-cards/upload-video', protect, authorize('superadmin', 'admin'), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No video file uploaded' });
  }
  const url = await uploadFileToCloudinary(req.file, 'sln_waterproofing/videos');
  res.status(201).json({ success: true, data: { url } });
}));
router.put('/pillar-cards/:id', protect, authorize('superadmin', 'admin'), updatePillarCard);
router.delete('/pillar-cards/:id', protect, authorize('superadmin', 'admin'), deletePillarCard);

// ==================== SERVICES & SERVICE PAGE CONTENT (CRUD) ====================
router.get('/services/page-content', protect, authorize('superadmin', 'admin'), getServicePageContent);
router.put('/services/page-content', protect, authorize('superadmin', 'admin'), updateServicePageContent);
router.post('/services/page-content/reset', protect, authorize('superadmin', 'admin'), resetServicePageContent);

router.get('/services', protect, authorize('superadmin', 'admin'), getAllServices);
router.post('/services/upload', protect, authorize('superadmin', 'admin'), imageUpload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  const url = await uploadFileToCloudinary(req.file, 'sln_waterproofing/services');
  res.status(201).json({ success: true, data: { url } });
}));
router.post('/services', protect, authorize('superadmin', 'admin'), createService);
router.post('/services/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultServices);
router.put('/services/:id', protect, authorize('superadmin', 'admin'), updateService);
router.delete('/services/:id', protect, authorize('superadmin', 'admin'), deleteService);

// ==================== PROJECTS ====================
router.get('/projects', protect, authorize('superadmin', 'admin'), getAllProjects);
router.post('/projects/upload', protect, authorize('superadmin', 'admin'), imageUpload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  const url = await uploadFileToCloudinary(req.file, 'sln_waterproofing/projects');
  res.status(201).json({ success: true, data: { url } });
}));
router.post('/projects', protect, authorize('superadmin', 'admin'), createProject);
router.post('/projects/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultProjects);
router.put('/projects/reorder', protect, authorize('superadmin', 'admin'), reorderProjects);
router.put('/projects/:id', protect, authorize('superadmin', 'admin'), updateProject);
router.delete('/projects/:id', protect, authorize('superadmin', 'admin'), deleteProject);

// ==================== ENQUIRIES (Accessible to both Admin & Super Admin) ====================
router.get('/enquiries', protect, authorize('superadmin', 'admin'), getAllEnquiries);
router.put('/enquiries/:id', protect, authorize('superadmin', 'admin'), updateEnquiry);
router.delete('/enquiries/:id', protect, authorize('superadmin', 'admin'), deleteEnquiry);

// ==================== CUSTOMERS ====================
router.get('/customers', protect, authorize('superadmin', 'admin'), getAllCustomers);
router.post('/customers', protect, authorize('superadmin', 'admin'), createCustomer);

// ==================== REVIEWS MODERATION & CRUD (Accessible to Admin & Super Admin) ====================
router.get('/reviews', protect, authorize('superadmin', 'admin'), getAllReviews);
router.post('/reviews', protect, authorize('superadmin', 'admin'), createReview);
router.put('/reviews/:id', protect, authorize('superadmin', 'admin'), updateReviewStatus);
router.patch('/reviews/:id', protect, authorize('superadmin', 'admin'), updateReviewStatus);
router.delete('/reviews/:id', protect, authorize('superadmin', 'admin'), deleteReview);
router.get('/reviews/page-content', protect, authorize('superadmin', 'admin'), getReviewPageContent);
router.put('/reviews/page-content', protect, authorize('superadmin', 'admin'), updateReviewPageContent);
router.post('/reviews/page-content/reset', protect, authorize('superadmin', 'admin'), resetReviewPageContent);

// ==================== QR REVIEW LINKS & GOOGLE REVIEW QR ====================
router.get('/google-review-qr', protect, authorize('superadmin', 'admin'), getGoogleReviewQRCode);
router.put('/google-review-qr', protect, authorize('superadmin', 'admin'), updateGoogleReviewUrl);
router.post('/google-review-qr/generate-new', protect, authorize('superadmin', 'admin'), generateNewGoogleQRCode);
router.post('/google-review-qr/reset', protect, authorize('superadmin', 'admin'), resetGoogleQRCode);
router.get('/customer-review-qr', protect, authorize('superadmin', 'admin'), getCustomerReviewQRCode);
router.put('/customer-review-qr', protect, authorize('superadmin', 'admin'), updateCustomerReviewUrl);
router.post('/customer-review-qr/generate-new', protect, authorize('superadmin', 'admin'), generateNewCustomerQRCode);
router.post('/customer-review-qr/reset', protect, authorize('superadmin', 'admin'), resetCustomerQRCode);
router.post('/projects/:id/review-link', protect, authorize('superadmin', 'admin'), (req, res, next) => {
  req.body.projectId = req.params.id;
  generateProjectReviewLink(req, res, next);
});
router.post('/review-links', protect, authorize('superadmin', 'admin'), generateProjectReviewLink);
router.get('/review-links', protect, authorize('superadmin', 'admin'), getAllReviewLinks);
router.patch('/review-links/:id', protect, authorize('superadmin', 'admin'), toggleReviewLinkStatus);

// ==================== SOCIAL LINKS ====================
router.get('/social-links', protect, authorize('superadmin', 'admin'), getAdminSocialLinks);
router.put('/social-links/:id', protect, authorize('superadmin', 'admin'), updateSocialLink);

// ==================== SETTINGS & AUDIT LOGS ====================
router.get('/settings', protect, authorize('superadmin', 'admin'), getAdminSettings);
router.put('/settings', protect, authorize('superadmin', 'admin'), updateAdminSettings);
router.get('/audit-logs', protect, authorize('superadmin', 'admin'), getAuditLogs);

// ==================== ABOUT US PAGE CONTENT ====================
router.get('/about', protect, authorize('superadmin', 'admin'), getAdminAboutContent);
router.put('/about', protect, authorize('superadmin', 'admin'), updateAboutContent);
router.post('/about/reset', protect, authorize('superadmin', 'admin'), resetAboutContent);

// ==================== CONTACT US PAGE CONTENT ====================
router.get('/contact', protect, authorize('superadmin', 'admin'), getAdminContactContent);
router.put('/contact', protect, authorize('superadmin', 'admin'), updateContactContent);
router.post('/contact/reset', protect, authorize('superadmin', 'admin'), resetContactContent);

// ==================== MEDIA UPLOAD ====================
router.post('/media/upload', protect, authorize('superadmin', 'admin'), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image or video file' });
  }

  const fileUrl = await uploadFileToCloudinary(req.file, 'sln_waterproofing/media');
  res.status(201).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    },
  });
}));

// ==================== ADMIN USER MANAGEMENT & PASSWORDS (Super Admin only) ====================
router.get('/users', protect, authorize('superadmin'), getAllUsers);
router.get('/users/:id', protect, authorize('superadmin'), getUserById);
router.post('/users', protect, authorize('superadmin'), createUser);
router.put('/users/:id', protect, authorize('superadmin'), updateUser);
router.put('/users/:id/password', protect, authorize('superadmin'), changeUserPassword);
router.delete('/users/:id', protect, authorize('superadmin'), deleteUser);

export default router;
