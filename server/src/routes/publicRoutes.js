import express from 'express';
import {
  getPublicSettings,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicProjects,
  getPublicProjectBySlug,
  submitPublicEnquiry,
  getPublicReviews,
  getReviewByToken,
  submitReviewByToken,
  getUniversalQRCode,
  submitUniversalReview,
  handleSocialRedirect,
} from '../controllers/publicController.js';
import { enquiryLimiter, reviewLimiter } from '../middleware/rateLimiter.js';
import { upload } from '../utils/mediaStorage.js';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getPublicBanners } from '../controllers/bannerController.js';
import { getPublicTransformations } from '../controllers/transformationController.js';
import { getPublicTrustMetrics } from '../controllers/trustMetricController.js';
import { getPublicDisciplines } from '../controllers/disciplineController.js';
import { getPublicPillarCards, getGlimpseSettings } from '../controllers/pillarCardController.js';
import { getPublicAboutContent } from '../controllers/aboutController.js';
import { getPublicContactContent } from '../controllers/contactController.js';

const router = express.Router();

// Company Settings & Contact
router.get('/settings', getPublicSettings);
router.get('/about', getPublicAboutContent);
router.get('/contact', getPublicContactContent);
router.get('/banners', getPublicBanners);
router.get('/transformations', getPublicTransformations);
router.get('/trust-metrics', getPublicTrustMetrics);
router.get('/disciplines', getPublicDisciplines);
router.get('/pillar-cards', getPublicPillarCards);
router.get('/pillar-cards/glimpse-settings', getGlimpseSettings);

// Services
router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);

// Projects Portfolio
router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

// Customer Enquiry
router.post('/enquiries', enquiryLimiter, submitPublicEnquiry);

// Upload optional customer photo for enquiry
router.post('/enquiries/upload', upload.single('photo'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = await uploadFileToCloudinary(req.file, 'sln_waterproofing/enquiries');
  res.json({ success: true, url: fileUrl });
}));

// Customer Reviews & Feedback
router.get('/reviews', getPublicReviews);
router.get('/reviews/universal-qr', getUniversalQRCode);
router.post('/reviews/universal', reviewLimiter, submitUniversalReview);
router.post('/reviews', reviewLimiter, submitUniversalReview);
router.get('/reviews/token/:token', getReviewByToken);
router.post('/reviews/token/:token', reviewLimiter, submitReviewByToken);

// Outbound Social Media Redirect Tracking
router.get('/social/:platform', handleSocialRedirect);
router.get('/social/click/:platform', handleSocialRedirect);

export default router;
