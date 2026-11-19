import Banner from '../models/Banner.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const bannerTextLimits = {
  eyebrow: 100,
  foundedText: 40,
  headline: 80,
  highlightedHeadline: 80,
  description: 500,
  primaryCtaText: 50,
  secondaryCtaText: 50,
};

const getBannerTextUpdates = (body) => {
  const updates = {};
  for (const [field, maxLength] of Object.entries(bannerTextLimits)) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'string' || body[field].length > maxLength) return null;
    updates[field] = body[field].trim();
  }
  return updates;
};

const normalizeMetrics = (metrics) => {
  if (!Array.isArray(metrics) || metrics.length !== 3) return null;
  if (metrics.some((metric) =>
    !metric ||
    typeof metric.value !== 'string' ||
    typeof metric.label !== 'string' ||
    !metric.value.trim() ||
    !metric.label.trim() ||
    metric.value.length > 40 ||
    metric.label.length > 80
  )) {
    return null;
  }
  return metrics.map(({ value, label }) => ({ value: value.trim(), label: label.trim() }));
};

const normalizeBannerServices = (services) => {
  if (!Array.isArray(services)) return [];
  return services
    .filter((s) => s && typeof s.name === 'string' && s.name.trim().length > 0)
    .map((s) => ({
      name: s.name.trim().slice(0, 60),
      shortCategory: typeof s.shortCategory === 'string' ? s.shortCategory.trim().slice(0, 100) : '',
      tag: typeof s.tag === 'string' ? s.tag.trim().slice(0, 40) : '',
      icon: typeof s.icon === 'string' ? s.icon.trim().slice(0, 40) : 'Droplets',
      accentColor: typeof s.accentColor === 'string' ? s.accentColor.trim().slice(0, 20) : '#38bdf8',
      targetBannerIndex: Number.isFinite(Number(s.targetBannerIndex)) ? Number(s.targetBannerIndex) : 1,
    }));
};

export const getPublicBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    next(error);
  }
};

export const getAdminBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const { title, imageUrl, altText, isActive, order, isCompanyLogoBanner, durationSeconds } = req.body;
    const normalizedTitle = typeof title === 'string' ? title.trim() : '';
    const isLogoBanner = Boolean(isCompanyLogoBanner);
    const normalizedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';
    const finalImageUrl = normalizedImageUrl || (isLogoBanner ? '/sln-logo.png' : '');

    if (!normalizedTitle || !finalImageUrl) {
      return res.status(400).json({ success: false, message: 'Banner title and image are required.' });
    }
    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Banner status must be true or false.' });
    }
    const bannerOrder = order === undefined ? 0 : Number(order);
    if (!Number.isFinite(bannerOrder)) {
      return res.status(400).json({ success: false, message: 'Banner order must be a number.' });
    }
    const bannerDuration = Number(durationSeconds) || (isLogoBanner ? 3 : 6);
    const textUpdates = getBannerTextUpdates(req.body);
    if (!textUpdates) {
      return res.status(400).json({ success: false, message: 'One or more banner text fields are invalid or too long.' });
    }
    const metrics = req.body.metrics === undefined ? undefined : normalizeMetrics(req.body.metrics);
    if (req.body.metrics !== undefined && !metrics) {
      return res.status(400).json({ success: false, message: 'Provide a value and label for all three banner highlights.' });
    }
    const bannerServices = req.body.bannerServices !== undefined ? normalizeBannerServices(req.body.bannerServices) : undefined;

    const banner = await Banner.create({
      title: normalizedTitle,
      imageUrl: finalImageUrl,
      isCompanyLogoBanner: isLogoBanner,
      durationSeconds: bannerDuration,
      altText: typeof altText === 'string' ? altText.trim() : '',
      isActive: isActive !== false,
      order: bannerOrder,
      ...textUpdates,
      ...(metrics ? { metrics } : {}),
      ...(bannerServices ? { bannerServices } : {}),
    });

    await logAuditEvent({
      req,
      action: 'CREATE_BANNER',
      resource: 'Banner',
      resourceId: banner._id,
      details: { title: banner.title },
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const updates = {};
    for (const [field, maxLength] of Object.entries({ title: 120, imageUrl: 2000, altText: 250 })) {
      if (req.body[field] === undefined) continue;
      if (typeof req.body[field] !== 'string' || req.body[field].length > maxLength) {
        return res.status(400).json({ success: false, message: `${field} is invalid or too long.` });
      }
      updates[field] = req.body[field].trim();
    }
    const textUpdates = getBannerTextUpdates(req.body);
    if (!textUpdates) {
      return res.status(400).json({ success: false, message: 'One or more banner text fields are invalid or too long.' });
    }
    Object.assign(updates, textUpdates);
    if (req.body.metrics !== undefined) {
      const metrics = normalizeMetrics(req.body.metrics);
      if (!metrics) {
        return res.status(400).json({ success: false, message: 'Provide a value and label for all three banner highlights.' });
      }
      updates.metrics = metrics;
    }
    if (req.body.isActive !== undefined) {
      if (typeof req.body.isActive !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Banner status must be true or false.' });
      }
      updates.isActive = req.body.isActive;
    }
    if (req.body.order !== undefined) {
      const bannerOrder = Number(req.body.order);
      if (!Number.isFinite(bannerOrder)) {
        return res.status(400).json({ success: false, message: 'Banner order must be a number.' });
      }
      updates.order = bannerOrder;
    }
    if (req.body.isCompanyLogoBanner !== undefined) {
      updates.isCompanyLogoBanner = Boolean(req.body.isCompanyLogoBanner);
    }
    if (req.body.bannerServices !== undefined) {
      updates.bannerServices = normalizeBannerServices(req.body.bannerServices);
    }
    if (req.body.durationSeconds !== undefined) {
      const dur = Number(req.body.durationSeconds);
      if (Number.isFinite(dur) && dur >= 1 && dur <= 60) {
        updates.durationSeconds = dur;
      }
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    await logAuditEvent({
      req,
      action: 'UPDATE_BANNER',
      resource: 'Banner',
      resourceId: banner._id,
      details: { title: banner.title },
    });

    res.json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    await logAuditEvent({
      req,
      action: 'DELETE_BANNER',
      resource: 'Banner',
      resourceId: banner._id,
      details: { title: banner.title },
    });

    res.json({ success: true, message: 'Banner deleted.' });
  } catch (error) {
    next(error);
  }
};

export const initDefaultBanners = async (req, res, next) => {
  try {
    const defaultBannersData = [
      {
        title: 'All Specialized Services & Company Overview',
        imageUrl: '/sln-logo.png',
        isCompanyLogoBanner: true,
        durationSeconds: 3,
        altText: 'SLN Engineers Projects Official Company Logo and Full Civil Services Spectrum',
        eyebrow: 'All 4 Specializations Under One Roof',
        foundedText: '',
        headline: 'Complete Civil Solutions,',
        highlightedHeadline: 'all 4 services covered.',
        description: 'Certified ISO civil engineering practice delivering specialized leak defense, weather-shield painting, structural restoration, and acoustic interior ceilings with warranty protection.',
        primaryCtaText: 'Request Inspection',
        secondaryCtaText: 'WhatsApp Senior Engineer',
        metrics: [
          { value: '4 Core', label: 'Civil Disciplines' },
          { value: '40+ Yrs', label: 'Continuous Practice' },
          { value: '100%', label: 'In-House Execution' },
        ],
        isActive: true,
        order: 0,
      },
      {
        title: 'Precision Waterproofing & Structural Defense',
        imageUrl: '/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png',
        isCompanyLogoBanner: false,
        durationSeconds: 6,
        altText: 'Modern architectural home protected by SLN Engineers advanced waterproofing',
        eyebrow: 'Precision Structural Waterproofing',
        foundedText: '',
        headline: 'Advanced Waterproofing,',
        highlightedHeadline: 'engineered for decades.',
        description: 'High-pressure polyurethane injection, crystalline tanking, and elastomeric membrane systems that stop active groundwater ingress and structural dampness permanently.',
        primaryCtaText: 'Book Free Inspection',
        secondaryCtaText: 'WhatsApp Senior Engineer',
        metrics: [
          { value: '100%', label: 'Active Leak Defense' },
          { value: '500+ Bar', label: 'Injection Capacity' },
          { value: '10-Year', label: 'Written Warranty' },
        ],
        isActive: true,
        order: 1,
      },
    ];

    if (req.body?.reset || req.query?.reset === 'true') {
      await Banner.deleteMany({});
    } else {
      const existing = await Banner.countDocuments();
      if (existing > 0) {
        return res.status(400).json({
          success: false,
          message: 'Banners already exist. Pass reset: true to overwrite with homepage defaults.',
        });
      }
    }

    const created = await Banner.insertMany(defaultBannersData);

    await logAuditEvent({
      req,
      action: 'INIT_DEFAULT_BANNERS',
      resource: 'Banner',
      details: { count: created.length },
    });

    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (error) {
    next(error);
  }
};
