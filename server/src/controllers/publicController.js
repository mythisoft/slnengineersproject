import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import Review from '../models/Review.js';
import ReviewLink from '../models/ReviewLink.js';
import SocialLink from '../models/SocialLink.js';
import CompanySettings from '../models/CompanySettings.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import Customer from '../models/Customer.js';
import { ensureServicesSeed, ensureProjectsSeed } from './adminController.js';
import { generateQRCodeDataUrl, generateGoogleQRCodeDataUrl } from '../utils/qrService.js';

// GET /api/settings - Public company details & social links
export const getPublicSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne().lean();
    if (!settings) {
      settings = await CompanySettings.create({});
    }

    const socialLinks = await SocialLink.find({ isActive: true }).sort({ order: 1 }).lean();

    const googleReviewUrl =
      settings.googleReviewUrl && !settings.googleReviewUrl.includes('sln-engineers-review') && !settings.googleReviewUrl.includes('slnengineers/review')
        ? settings.googleReviewUrl
        : 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';

    res.json({
      success: true,
      data: {
        ...settings,
        googleReviewUrl,
        socialLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/services - Published services
export const getPublicServices = async (req, res, next) => {
  try {
    await ensureServicesSeed();
    const services = await Service.find({ publicationStatus: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/services/:slug - Single service details
export const getPublicServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      publicationStatus: true,
    }).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found or currently unpublished.',
      });
    }

    // Also fetch 3 related completed projects in this category
    const relatedProjects = await Project.find({
      serviceCategory: service.category,
      isPublished: true,
    })
      .select('title slug location completionDate beforeMedia afterMedia warrantyDetails')
      .limit(3)
      .lean();

    res.json({
      success: true,
      data: {
        ...service,
        relatedProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects - Published projects with category filter & pagination
export const getPublicProjects = async (req, res, next) => {
  try {
    await ensureProjectsSeed();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const { category, discipline, page = 1, limit = 50, featured } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All' && category !== 'all') {
      query.$or = [
        { serviceCategory: category },
        { serviceTitle: category },
        { serviceCategory: { $regex: category, $options: 'i' } },
      ];
    }

    if (discipline && discipline !== 'All' && discipline !== 'all') {
      const discRegex = new RegExp(discipline.replace(/[-_]/g, '.*'), 'i');
      const discConditions = [
        { disciplineId: discipline },
        { disciplineName: { $regex: discRegex } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: discConditions }];
        delete query.$or;
      } else {
        query.$or = discConditions;
      }
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ order: 1, isFeatured: -1, completionDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug - Single project details
export const getPublicProjectBySlug = async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const project = await Project.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project record not found or unpublished.',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/enquiries - Public enquiry form submission
export const submitPublicEnquiry = async (req, res, next) => {
  try {
    const {
      customerName,
      phone,
      email,
      location,
      serviceRequired,
      problemDescription,
      preferredContactMethod,
      consentGiven,
      photos = [],
      honeypot, // Spam trap
    } = req.body;

    // Honeypot check - bots fill hidden field
    if (honeypot) {
      return res.status(200).json({
        success: true,
        message: 'Thank you for your enquiry. Our team will contact you shortly.',
      });
    }

    if (!customerName || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields: Customer Name, Phone Number, and Property Location.',
      });
    }

    const finalServiceRequired = (serviceRequired && serviceRequired.trim()) || 'Inspection & Site Survey';
    const finalProblemDescription =
      (problemDescription && problemDescription.trim()) || `Inspection requested for property at ${location.trim()}`;
    const finalConsentGiven = consentGiven !== undefined ? Boolean(consentGiven) : true;

    if (!finalConsentGiven) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the privacy notice to submit your enquiry.',
      });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Create or update customer record for reference
    let customer = await Customer.findOne({ phone: phone.trim() });
    if (!customer) {
      customer = await Customer.create({
        name: customerName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : '',
        address: { area: location.trim() },
        notes: `Initial website enquiry for: ${finalServiceRequired}`,
      });
    }

    const enquiry = await Enquiry.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      location: location.trim(),
      serviceRequired: finalServiceRequired,
      problemDescription: finalProblemDescription,
      preferredContactMethod: preferredContactMethod || 'Phone',
      consentGiven: finalConsentGiven,
      photos: Array.isArray(photos) ? photos : [],
      status: 'New',
      ipAddress,
      userAgent,
      internalNotes: [
        {
          note: `Enquiry received through website ${serviceRequired ? 'quote' : 'inspection'} form. Preferred contact: ${preferredContactMethod || 'Phone'}`,
          author: 'System',
        },
      ],
    });

    // Record Analytics Event
    await AnalyticsEvent.create({
      eventType: 'enquiry_submit',
      targetId: String(enquiry._id),
      metadata: { serviceRequired, location },
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received! An SLN restoration engineer will contact you shortly.',
      data: {
        id: enquiry._id,
        customerName: enquiry.customerName,
        status: enquiry.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews - Approved customer reviews
export const getPublicReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      isApproved: true,
      isSpam: false,
    })
      .select('customerName projectTitle rating feedbackText showOnHome createdAt')
      .sort({ showOnHome: -1, createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : '5.0';

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (starCounts[r.rating] !== undefined) {
        starCounts[r.rating]++;
      }
    });

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          averageRating: parseFloat(avgRating),
          starCounts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/token/:token - QR Scan validation & project details
export const getReviewByToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const reviewLink = await ReviewLink.findOne({ token }).populate('projectId').lean();

    if (!reviewLink) {
      return res.status(404).json({
        success: false,
        message: 'This review link is invalid or does not exist.',
      });
    }

    if (!reviewLink.isActive) {
      return res.status(410).json({
        success: false,
        message: 'This review link has been deactivated by the administrator.',
      });
    }

    // Increment scan count and record last scanned date asynchronously
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await ReviewLink.updateOne(
      { _id: reviewLink._id },
      { $inc: { scanCount: 1 }, $set: { lastScannedAt: new Date() } }
    );

    await AnalyticsEvent.create({
      eventType: 'qr_scan',
      targetId: String(reviewLink._id),
      metadata: {
        token,
        projectTitle: reviewLink.projectTitle || reviewLink.projectId?.title,
      },
      ipAddress,
      userAgent,
    });

    const settings = await CompanySettings.findOne().lean();

    res.json({
      success: true,
      data: {
        token: reviewLink.token,
        project: {
          title: reviewLink.projectTitle || reviewLink.projectId?.title || 'Completed Waterproofing Project',
          serviceCategory: reviewLink.projectId?.serviceCategory || 'Restoration Service',
          location: reviewLink.projectId?.location || 'Hyderabad',
          warrantyDetails: reviewLink.projectId?.warrantyDetails || '',
        },
        company: {
          name: settings?.companyName || 'SLN Engineers Projects Pvt. Ltd.',
          tagline: settings?.tagline || 'Restoration for Three Generations',
          googleReviewUrl: settings?.googleReviewUrl || 'https://g.page/r/sln-engineers-review',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/reviews/token/:token - Submit customer feedback from QR scan
export const submitReviewByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { rating, feedbackText, customerName, consentToPublish } = req.body;

    const reviewLink = await ReviewLink.findOne({ token });

    if (!reviewLink) {
      return res.status(404).json({
        success: false,
        message: 'Invalid review link token.',
      });
    }

    if (!reviewLink.isActive) {
      return res.status(410).json({
        success: false,
        message: 'This review link has expired or has been deactivated.',
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5 stars.',
      });
    }

    if (!feedbackText || feedbackText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please write a brief feedback description (at least 5 characters).',
      });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Check duplicate submission from same IP for same token within 1 hour
    const recentSubmissions = await Review.countDocuments({
      token,
      ipAddress,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    });

    if (recentSubmissions >= 2) {
      return res.status(429).json({
        success: false,
        message: 'Feedback has already been submitted for this project from this device. Thank you!',
      });
    }

    const review = await Review.create({
      reviewLinkId: reviewLink._id,
      token,
      projectId: reviewLink.projectId,
      projectTitle: reviewLink.projectTitle,
      rating: Number(rating),
      feedbackText: feedbackText.trim(),
      customerName: customerName ? customerName.trim() : 'Verified Customer',
      consentToPublish: Boolean(consentToPublish),
      isApproved: false, // Default pending admin moderation
      isSpam: false,
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been received and helps us uphold three generations of quality.',
      data: {
        id: review._id,
        rating: review.rating,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/universal-qr - Generate master company review QR code
export const getUniversalQRCode = async (req, res, next) => {
  try {
    const settings = await CompanySettings.findOne();
    const origin = req.headers.origin || req.headers.referer || '';
    let host = settings?.reviewBaseUrl || 'http://localhost:5173';
    if (!settings?.reviewBaseUrl && origin) {
      try {
        const parsed = new URL(origin);
        host = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {
        // fallback
      }
    }
    const reviewUrl =
      settings?.customerReviewUrl && settings.customerReviewUrl.trim()
        ? settings.customerReviewUrl.trim()
        : `${host.replace(/\/$/, '')}/review`;
    const qrCodeDataUrl = await generateQRCodeDataUrl(reviewUrl);

    const googleReviewUrl =
      settings?.googleReviewUrl &&
      !settings.googleReviewUrl.includes('sln-engineers-review') &&
      !settings.googleReviewUrl.includes('slnengineers/review')
        ? settings.googleReviewUrl
        : 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';
    const googleQrCodeDataUrl = await generateGoogleQRCodeDataUrl(googleReviewUrl);

    res.json({
      success: true,
      data: {
        reviewUrl,
        qrCodeDataUrl,
        qrDataUrl: qrCodeDataUrl,
        googleReviewUrl,
        googleQrCodeDataUrl,
        googleQrDataUrl: googleQrCodeDataUrl,
        companyName: settings?.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings?.phone || '+91 8977668776',
        tagline: settings?.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/reviews/universal - Direct review submission by any client
export const submitUniversalReview = async (req, res, next) => {
  try {
    const {
      rating,
      feedbackText,
      customerName,
      serviceCategory,
      projectTitle,
      location,
      consentToPublish,
    } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5 stars.',
      });
    }

    if (!feedbackText || feedbackText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please write a brief feedback description (at least 5 characters).',
      });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Check duplicate submission from same IP within 15 minutes
    const recentSubmissions = await Review.countDocuments({
      token: 'universal',
      ipAddress,
      createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
    });

    if (recentSubmissions >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Thank you! You have already submitted feedback recently from this device.',
      });
    }

    const title =
      projectTitle?.trim() ||
      serviceCategory?.trim() ||
      (location?.trim() ? `Restoration in ${location.trim()}` : 'SLN Waterproofing & Civil Restoration');

    const review = await Review.create({
      reviewLinkId: null,
      token: 'universal',
      projectId: null,
      projectTitle: title,
      rating: Number(rating),
      feedbackText: feedbackText.trim(),
      customerName: customerName ? customerName.trim() : 'Verified Customer',
      consentToPublish: Boolean(consentToPublish),
      isApproved: false, // Default pending admin moderation
      isSpam: false,
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been received and helps us uphold three generations of quality.',
      data: {
        id: review._id,
        rating: review.rating,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/social/:platform - Track outbound click & redirect
export const handleSocialRedirect = async (req, res, next) => {
  try {
    const { platform } = req.params;

    const socialLink = await SocialLink.findOne({ platform });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    let destinationUrl = 'https://www.google.com';

    if (socialLink) {
      destinationUrl = socialLink.url;
      // Increment click count asynchronously
      await SocialLink.updateOne({ _id: socialLink._id }, { $inc: { clickCount: 1 }, $set: { lastClickedAt: new Date() } });
    } else if (platform === 'google_review') {
      const settings = await CompanySettings.findOne();
      if (settings?.googleReviewUrl) {
        destinationUrl = settings.googleReviewUrl;
      }
    }

    await AnalyticsEvent.create({
      eventType: platform === 'google_review' ? 'google_review_click' : 'social_click',
      targetId: platform,
      metadata: { destinationUrl },
      ipAddress,
      userAgent,
    });

    // Support both JSON mode and direct 302 HTTP redirect
    if (req.query.mode === 'json') {
      return res.json({ success: true, url: destinationUrl });
    }

    res.redirect(302, destinationUrl);
  } catch (error) {
    next(error);
  }
};
