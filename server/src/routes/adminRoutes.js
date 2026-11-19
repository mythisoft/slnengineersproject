import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
import { imageUpload, upload } from '../utils/mediaStorage.js';
import { handleUploadToCloudinaryOrLocal } from '../utils/cloudinary.js';
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
router.get('/banners', protect, authorize('superadmin'), getAdminBanners);
router.post('/banners/upload', protect, authorize('superadmin'), imageUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  const url = await handleUploadToCloudinaryOrLocal(req.file, 'sln_waterproofing/banners');
  res.status(201).json({
    success: true,
    data: { url },
  });
});
router.post('/banners', protect, authorize('superadmin'), createBanner);
router.post('/banners/init-defaults', protect, authorize('superadmin'), initDefaultBanners);
router.put('/banners/:id', protect, authorize('superadmin'), updateBanner);
router.delete('/banners/:id', protect, authorize('superadmin'), deleteBanner);

// ==================== HERO TRUST METRICS TILES ====================
router.get('/trust-metrics', protect, authorize('superadmin'), getAdminTrustMetrics);
router.post('/trust-metrics', protect, authorize('superadmin'), createTrustMetric);
router.post('/trust-metrics/init-defaults', protect, authorize('superadmin'), initDefaultTrustMetrics);
router.put('/trust-metrics/:id', protect, authorize('superadmin'), updateTrustMetric);
router.delete('/trust-metrics/:id', protect, authorize('superadmin'), deleteTrustMetric);

// ==================== BEFORE & AFTER TRANSFORMATIONS ====================
router.get('/transformations', protect, authorize('superadmin'), getAdminTransformations);
router.post('/transformations/upload', protect, authorize('superadmin'), imageUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  const url = await handleUploadToCloudinaryOrLocal(req.file, 'sln_waterproofing/transformations');
  res.status(201).json({ success: true, data: { url } });
});
router.post('/transformations', protect, authorize('superadmin'), createTransformation);
router.put('/transformations/:id', protect, authorize('superadmin'), updateTransformation);
router.delete('/transformations/:id', protect, authorize('superadmin'), deleteTransformation);

// ==================== DISCIPLINE PILLARS ====================
router.get('/disciplines', protect, authorize('superadmin', 'admin'), getAllDisciplines);
router.post('/disciplines', protect, authorize('superadmin', 'admin'), createDiscipline);
router.post('/disciplines/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultDisciplines);
router.put('/disciplines/:id', protect, authorize('superadmin', 'admin'), updateDiscipline);
router.delete('/disciplines/:id', protect, authorize('superadmin', 'admin'), deleteDiscipline);

// ==================== HORIZONTAL PILLAR CARDS & GLIMPSE VIDEO ====================
router.get('/pillar-cards', protect, authorize('superadmin'), getAdminPillarCards);
router.post('/pillar-cards', protect, authorize('superadmin'), createPillarCard);
router.put('/pillar-cards/reorder', protect, authorize('superadmin'), reorderPillarCards);
router.put('/pillar-cards/glimpse-settings', protect, authorize('superadmin'), updateGlimpseSettings);
router.post('/pillar-cards/upload-video', protect, authorize('superadmin'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No video file uploaded' });
  }

  // Also copy to client/public/uploads if it exists so Vite can serve it statically
  try {
    const clientUploadsPath = path.join(__dirname, '../../../client/public/uploads');
    if (fs.existsSync(clientUploadsPath)) {
      fs.copyFileSync(req.file.path, path.join(clientUploadsPath, req.file.filename));
    }
  } catch (copyErr) {
    console.warn('Could not copy video to client/public/uploads:', copyErr);
  }

  const url = await handleUploadToCloudinaryOrLocal(req.file, 'sln_waterproofing/videos');
  res.status(201).json({ success: true, data: { url } });
});
router.put('/pillar-cards/:id', protect, authorize('superadmin'), updatePillarCard);
router.delete('/pillar-cards/:id', protect, authorize('superadmin'), deletePillarCard);

// ==================== SERVICES & SERVICE PAGE CONTENT (CRUD) ====================
router.get('/services/page-content', protect, authorize('superadmin', 'admin'), getServicePageContent);
router.put('/services/page-content', protect, authorize('superadmin', 'admin'), updateServicePageContent);
router.post('/services/page-content/reset', protect, authorize('superadmin', 'admin'), resetServicePageContent);

router.get('/services', protect, authorize('superadmin', 'admin'), getAllServices);
router.post('/services/upload', protect, authorize('superadmin', 'admin'), imageUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  // Also copy to client/public/uploads if it exists so Vite dev server can serve it statically
  try {
    const clientUploadsPath = path.join(__dirname, '../../../client/public/uploads');
    if (fs.existsSync(clientUploadsPath)) {
      fs.copyFileSync(req.file.path, path.join(clientUploadsPath, req.file.filename));
    }
  } catch (copyErr) {
    console.warn('Could not copy image to client/public/uploads:', copyErr);
  }
  const url = await handleUploadToCloudinaryOrLocal(req.file, 'sln_waterproofing/services');
  res.status(201).json({ success: true, data: { url } });
});
router.post('/services', protect, authorize('superadmin', 'admin'), createService);
router.post('/services/init-defaults', protect, authorize('superadmin', 'admin'), initDefaultServices);
router.put('/services/:id', protect, authorize('superadmin', 'admin'), updateService);
router.delete('/services/:id', protect, authorize('superadmin', 'admin'), deleteService);

// ==================== PROJECTS ====================
router.get('/projects', protect, authorize('superadmin'), getAllProjects);
router.post('/projects/upload', protect, authorize('superadmin'), imageUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' });
  }
  // Also copy to client/public/uploads if it exists so Vite dev server can serve it statically
  try {
    const clientUploadsPath = path.join(__dirname, '../../../client/public/uploads');
    if (fs.existsSync(clientUploadsPath)) {
      fs.copyFileSync(req.file.path, path.join(clientUploadsPath, req.file.filename));
    }
  } catch (copyErr) {
    console.warn('Could not copy image to client/public/uploads:', copyErr);
  }
  const url = await handleUploadToCloudinaryOrLocal(req.file, 'sln_waterproofing/projects');
  res.status(201).json({ success: true, data: { url } });
});
router.post('/projects', protect, authorize('superadmin'), createProject);
router.put('/projects/:id', protect, authorize('superadmin'), updateProject);
router.delete('/projects/:id', protect, authorize('superadmin'), deleteProject);

// ==================== ENQUIRIES (Accessible to both Admin & Super Admin) ====================
router.get('/enquiries', protect, authorize('superadmin', 'admin'), getAllEnquiries);
router.put('/enquiries/:id', protect, authorize('superadmin', 'admin'), updateEnquiry);
router.delete('/enquiries/:id', protect, authorize('superadmin', 'admin'), deleteEnquiry);

// ==================== CUSTOMERS ====================
router.get('/customers', protect, authorize('superadmin'), getAllCustomers);
router.post('/customers', protect, authorize('superadmin'), createCustomer);

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
router.get('/google-review-qr', protect, authorize('superadmin'), getGoogleReviewQRCode);
router.put('/google-review-qr', protect, authorize('superadmin'), updateGoogleReviewUrl);
router.post('/google-review-qr/generate-new', protect, authorize('superadmin'), generateNewGoogleQRCode);
router.post('/google-review-qr/reset', protect, authorize('superadmin'), resetGoogleQRCode);
router.get('/customer-review-qr', protect, authorize('superadmin'), getCustomerReviewQRCode);
router.put('/customer-review-qr', protect, authorize('superadmin'), updateCustomerReviewUrl);
router.post('/customer-review-qr/generate-new', protect, authorize('superadmin'), generateNewCustomerQRCode);
router.post('/customer-review-qr/reset', protect, authorize('superadmin'), resetCustomerQRCode);
router.post('/projects/:id/review-link', protect, authorize('superadmin'), (req, res, next) => {
  req.body.projectId = req.params.id;
  generateProjectReviewLink(req, res, next);
});
router.post('/review-links', protect, authorize('superadmin'), generateProjectReviewLink);
router.get('/review-links', protect, authorize('superadmin'), getAllReviewLinks);
router.patch('/review-links/:id', protect, authorize('superadmin'), toggleReviewLinkStatus);

// ==================== SOCIAL LINKS ====================
router.get('/social-links', protect, authorize('superadmin'), getAdminSocialLinks);
router.put('/social-links/:id', protect, authorize('superadmin'), updateSocialLink);

// ==================== SETTINGS & AUDIT LOGS ====================
router.get('/settings', protect, authorize('superadmin', 'admin'), getAdminSettings);
router.put('/settings', protect, authorize('superadmin', 'admin'), updateAdminSettings);
router.get('/audit-logs', protect, authorize('superadmin'), getAuditLogs);

// ==================== ABOUT US PAGE CONTENT ====================
router.get('/about', protect, authorize('superadmin'), getAdminAboutContent);
router.put('/about', protect, authorize('superadmin'), updateAboutContent);
router.post('/about/reset', protect, authorize('superadmin'), resetAboutContent);

// ==================== CONTACT US PAGE CONTENT ====================
router.get('/contact', protect, authorize('superadmin'), getAdminContactContent);
router.put('/contact', protect, authorize('superadmin'), updateContactContent);
router.post('/contact/reset', protect, authorize('superadmin'), resetContactContent);

// ==================== MEDIA UPLOAD ====================
router.post('/media/upload', protect, authorize('superadmin'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image or video file' });
  }

  const fileUrl = await handleUploadToCloudinaryOrLocal(req.file, 'sln_waterproofing/media');
  res.status(201).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    },
  });
});

// ==================== ADMIN USER MANAGEMENT & PASSWORDS (Super Admin only) ====================
router.get('/users', protect, authorize('superadmin'), getAllUsers);
router.get('/users/:id', protect, authorize('superadmin'), getUserById);
router.post('/users', protect, authorize('superadmin'), createUser);
router.put('/users/:id', protect, authorize('superadmin'), updateUser);
router.put('/users/:id/password', protect, authorize('superadmin'), changeUserPassword);
router.delete('/users/:id', protect, authorize('superadmin'), deleteUser);

export default router;
