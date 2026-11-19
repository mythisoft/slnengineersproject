import mongoose from 'mongoose';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import Customer from '../models/Customer.js';
import Review from '../models/Review.js';
import ReviewLink from '../models/ReviewLink.js';
import SocialLink from '../models/SocialLink.js';
import CompanySettings from '../models/CompanySettings.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import AuditLog from '../models/AuditLog.js';
import Media from '../models/Media.js';
import User from '../models/User.js';
import { generateSecureToken, generateQRCodeDataUrl } from '../utils/qrService.js';
import { logAuditEvent } from '../utils/auditLogger.js';
import { DEFAULT_SERVICES } from '../utils/defaultServices.js';
import { DEFAULT_PROJECTS } from '../utils/defaultProjects.js';

export const ensureProjectsSeed = async () => {
  try {
    for (const proj of DEFAULT_PROJECTS) {
      const existing = await Project.findOne({ slug: proj.slug });
      if (!existing) {
        await Project.create(proj);
      } else {
        await Project.updateOne(
          { _id: existing._id },
          {
            $set: {
              disciplineId: proj.disciplineId,
              disciplineName: proj.disciplineName,
              serviceTitle: existing.serviceTitle || proj.serviceTitle,
              serviceCategory: existing.serviceCategory || proj.serviceCategory,
              coverImage: existing.coverImage || proj.coverImage,
              warrantyYears: existing.warrantyYears || proj.warrantyYears,
              warrantyTitle: existing.warrantyTitle || proj.warrantyTitle,
              formulation: existing.formulation?.length ? existing.formulation : proj.formulation,
            },
          }
        );
      }
    }

    // Heal any legacy misplaced projects in MongoDB
    await Project.updateMany(
      {
        $or: [{ serviceCategory: /paint/i }, { title: /paint|weather|façade|facade/i }],
        disciplineId: { $ne: 'painting' },
      },
      { $set: { disciplineId: 'painting', disciplineName: 'Interior & Exterior Painting' } }
    );
    await Project.updateMany(
      {
        $or: [{ serviceCategory: /repair|crack|stitch|spall|joint/i }, { title: /repair|crack|stitch|spall|joint/i }],
        disciplineId: { $ne: 'repairs' },
      },
      { $set: { disciplineId: 'repairs', disciplineName: 'Building Repairs & Restoration' } }
    );
    await Project.updateMany(
      {
        $or: [{ serviceCategory: /ceiling|gypsum|interior|drywall|acoustic/i }, { title: /ceiling|gypsum|drywall|acoustic/i }],
        disciplineId: { $ne: 'false-ceiling' },
      },
      { $set: { disciplineId: 'false-ceiling', disciplineName: 'False Ceiling & Interior Work' } }
    );
    await Project.updateMany(
      {
        $or: [{ serviceCategory: /waterproof|terrace|basement|dampness/i }, { title: /waterproof|terrace|basement|dampness/i }],
        disciplineId: { $exists: false },
      },
      { $set: { disciplineId: 'waterproofing', disciplineName: 'Waterproofing Solutions' } }
    );
  } catch (err) {
    console.warn('Auto-seed projects notice:', err.message);
  }
};

export const ensureServicesSeed = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log('Seeding initial 14 default services into MongoDB...');
      await Service.insertMany(DEFAULT_SERVICES);
      console.log('Default services seeded successfully.');
    } else {
      // Heal any legacy misplaced disciplines in MongoDB
      await Service.updateMany(
        { $or: [{ slug: 'terrace-roof-waterproofing' }, { title: /terrace/i }], disciplineId: { $ne: 'waterproofing' } },
        { $set: { disciplineId: 'waterproofing', disciplineName: 'Waterproofing Solutions' } }
      );
      await Service.updateMany(
        { $or: [{ slug: 'bathroom-wet-area-waterproofing' }, { title: /bathroom/i }], disciplineId: { $ne: 'waterproofing' } },
        { $set: { disciplineId: 'waterproofing', disciplineName: 'Waterproofing Solutions' } }
      );
      await Service.updateMany(
        { $or: [{ slug: 'basement-waterproofing' }, { title: /basement/i }], disciplineId: { $ne: 'waterproofing' } },
        { $set: { disciplineId: 'waterproofing', disciplineName: 'Waterproofing Solutions' } }
      );
    }
  } catch (err) {
    console.warn('Auto-seed services notice:', err.message);
  }
};

// ==================== DASHBOARD & ANALYTICS ====================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
    const siteInspections = await Enquiry.countDocuments({ status: 'Site Inspection' });
    const convertedEnquiries = await Enquiry.countDocuments({ status: 'Converted' });

    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({ isPublished: true });

    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ isApproved: false, isSpam: false });
    const approvedReviews = await Review.find({ isApproved: true, isSpam: false }).select('rating');

    const avgRating =
      approvedReviews.length > 0
        ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
        : '0.0';

    // Analytics counters from AnalyticsEvent and ReviewLinks
    const qrScansAgg = await ReviewLink.aggregate([
      { $group: { _id: null, totalScans: { $sum: '$scanCount' } } },
    ]);
    const totalQrScans = qrScansAgg[0]?.totalScans || 0;

    const googleReviewClicks = await AnalyticsEvent.countDocuments({
      eventType: 'google_review_click',
    });

    const socialClicksAgg = await SocialLink.aggregate([
      { $group: { _id: null, totalClicks: { $sum: '$clickCount' } } },
    ]);
    const totalSocialClicks = socialClicksAgg[0]?.totalClicks || 0;

    // Rating distribution for Recharts
    const ratingDistribution = [
      { rating: '5 Star', count: await Review.countDocuments({ rating: 5, isSpam: false }) },
      { rating: '4 Star', count: await Review.countDocuments({ rating: 4, isSpam: false }) },
      { rating: '3 Star', count: await Review.countDocuments({ rating: 3, isSpam: false }) },
      { rating: '2 Star', count: await Review.countDocuments({ rating: 2, isSpam: false }) },
      { rating: '1 Star', count: await Review.countDocuments({ rating: 1, isSpam: false }) },
    ];

    // Status distribution of enquiries
    const enquiryStatusDistribution = [
      { status: 'New', count: newEnquiries },
      { status: 'Contacted', count: await Enquiry.countDocuments({ status: 'Contacted' }) },
      { status: 'Site Inspection', count: siteInspections },
      { status: 'Quotation Sent', count: await Enquiry.countDocuments({ status: 'Quotation Sent' }) },
      { status: 'Converted', count: convertedEnquiries },
      { status: 'Closed', count: await Enquiry.countDocuments({ status: 'Closed' }) },
    ];

    // Recent 5 enquiries and recent 5 audit logs
    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(5).lean();

    res.json({
      success: true,
      data: {
        metrics: {
          totalEnquiries,
          newEnquiries,
          siteInspections,
          convertedEnquiries,
          totalProjects,
          publishedProjects,
          totalReviews,
          pendingReviews,
          averageWebsiteRating: parseFloat(avgRating),
          totalQrScans,
          outboundGoogleClicks: googleReviewClicks,
          outboundSocialClicks: totalSocialClicks,
        },
        charts: {
          ratingDistribution,
          enquiryStatusDistribution,
        },
        recentEnquiries,
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SERVICES CRUD ====================
export const getAllServices = async (req, res, next) => {
  try {
    await ensureServicesSeed();
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const {
      title,
      disciplineId,
      disciplineName,
      category,
      categoryLabel,
      categoryKey,
      warranty,
      protocol,
      standard,
      accentColor,
      shortDescription,
      fullDescription,
      description,
      coverImage,
      image,
      iconName,
      iconType,
      benefits,
      advantages,
      technicalHighlights,
      specifications,
      order,
      publicationStatus,
    } = req.body;

    let baseSlug = (title || 'service')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    const existing = await Service.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const finalDesc = description || fullDescription || shortDescription || '';
    const finalImage = image || coverImage || '';
    const finalAdvantages = Array.isArray(advantages) && advantages.length > 0
      ? advantages
      : Array.isArray(benefits) ? benefits : [];
    const finalSpecs = Array.isArray(specifications) && specifications.length > 0
      ? specifications
      : Array.isArray(technicalHighlights) ? technicalHighlights : [];

    const service = await Service.create({
      title,
      slug,
      disciplineId: disciplineId || 'waterproofing',
      disciplineName: disciplineName || 'Waterproofing Solutions',
      category: category || title,
      categoryLabel: categoryLabel || category || title,
      categoryKey: categoryKey || category || title,
      warranty: warranty || 'Up to 10-Yr Warranty',
      protocol: protocol || 'SLN Certified Protocol',
      standard: standard || 'IS 1346 Certified',
      accentColor: accentColor || '#0284c7',
      shortDescription: shortDescription || finalDesc.slice(0, 160),
      fullDescription: fullDescription || finalDesc,
      description: finalDesc,
      coverImage: finalImage,
      image: finalImage,
      iconName: iconName || 'ShieldCheck',
      iconType: iconType || 'droplets',
      benefits: finalAdvantages,
      advantages: finalAdvantages,
      technicalHighlights: finalSpecs,
      specifications: finalSpecs,
      order: Number(order) || 0,
      publicationStatus: publicationStatus !== undefined ? publicationStatus : true,
    });

    await logAuditEvent({
      req,
      action: 'CREATE_SERVICE',
      resource: 'Service',
      resourceId: service._id,
      details: { title: service.title },
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (updateData.image && !updateData.coverImage) {
      updateData.coverImage = updateData.image;
    }
    if (updateData.coverImage && !updateData.image) {
      updateData.image = updateData.coverImage;
    }

    if (updateData.isPublished === false) {
      updateData.isActive = false;
    }
    if (updateData.description && !updateData.fullDescription) {
      updateData.fullDescription = updateData.description;
    }
    if (updateData.fullDescription && !updateData.description) {
      updateData.description = updateData.fullDescription;
    }
    if (updateData.advantages && (!updateData.benefits || updateData.benefits.length === 0)) {
      updateData.benefits = updateData.advantages;
    }
    if (updateData.benefits && (!updateData.advantages || updateData.advantages.length === 0)) {
      updateData.advantages = updateData.benefits;
    }
    if (updateData.specifications && (!updateData.technicalHighlights || updateData.technicalHighlights.length === 0)) {
      updateData.technicalHighlights = updateData.specifications;
    }
    if (updateData.technicalHighlights && (!updateData.specifications || updateData.specifications.length === 0)) {
      updateData.specifications = updateData.technicalHighlights;
    }

    let service = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      service = await Service.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
    }

    if (!service) {
      service = await Service.findOneAndUpdate(
        { $or: [{ slug: req.params.id }, { id: req.params.id }, { title: req.params.id }] },
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!service) {
      service = await Service.create({
        ...updateData,
        slug: updateData.slug || req.params.id,
      });
    }

    await logAuditEvent({
      req,
      action: 'UPDATE_SERVICE',
      resource: 'Service',
      resourceId: service._id,
      details: { title: service.title },
    });

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const initDefaultServices = async (req, res, next) => {
  try {
    const defaultServicesData = [
      {
        title: 'Terrace & Roof Waterproofing',
        slug: 'terrace-roof-waterproofing',
        disciplineId: 'waterproofing',
        disciplineName: 'Waterproofing Solutions',
        category: 'Terrace and roof waterproofing',
        categoryLabel: 'Terrace & Roof',
        warranty: 'Up to 10-Yr Warranty',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        description: 'Terraces endure intense weathering, extreme thermal expansion, and torrential monsoon deluges. Our multi-layer terrace waterproofing combines high-tensile fiberglass mesh reinforcement with advanced aliphatic polyurethane elastomer membranes.',
        advantages: ['High elongation polyurethane membrane (over 400%)', 'UV-resistant aliphatic topcoat reduces roof heat buildup', 'Root-resistant formula compatible with terrace gardens', '10-Year leak-free written warranty'],
        specifications: ['Elastomeric Polymer Membrane: 1.8mm – 2.2mm', 'Tensile Strength: > 3.5 N/mm²', 'Crack bridging capability up to 3.0mm'],
        protocol: 'SLN Hydro-Shield Protocol',
        standard: 'IS 1346 Certified Hydrostatic System',
        iconType: 'layers',
        accentColor: '#0284c7',
        order: 1,
        publicationStatus: true,
      },
      {
        title: 'Bathroom & Wet-Area Waterproofing',
        slug: 'bathroom-wet-area-waterproofing',
        disciplineId: 'waterproofing',
        disciplineName: 'Waterproofing Solutions',
        category: 'Bathroom and wet-area waterproofing',
        categoryLabel: 'Bathrooms & Wet-Areas',
        warranty: 'Up to 10-Yr Warranty',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        description: 'Concealed bathroom leaks cause damp patches on lower-floor ceilings, structural rebar oxidation, and peeling adjacent wall paint.',
        advantages: ['Non-destructive re-grouting and pipe collar sealing', 'High bond adhesion to concrete, brick & PVC sleeves', 'Food-grade certified, non-toxic formulation'],
        specifications: ['Two-component acrylic-modified slurry', 'Reinforced coving at 90° wall-floor junctures', 'Hydrostatic pressure tolerance up to 3.5 bar'],
        protocol: 'SLN Wet-Containment Protocol',
        standard: 'IS 3067 Hydrostatic Specification',
        iconType: 'droplets',
        accentColor: '#0284c7',
        order: 2,
        publicationStatus: true,
      },
      {
        title: 'Exterior Monsoon Weather-Shield Painting',
        slug: 'exterior-monsoon-weather-shield-painting',
        disciplineId: 'painting',
        disciplineName: 'Interior & Exterior Painting',
        category: 'Exterior weather-shield painting',
        categoryLabel: 'Exterior Painting',
        warranty: 'Up to 8-Yr Warranty',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        description: 'Engineered for Indian monsoon climates, our exterior weather-shield painting system utilizes heavy-duty cross-linking acrylic emulsions.',
        advantages: ['Superior anti-algal, anti-fungal, and black mold defense', 'High dirt-pick-up resistance keeps walls looking brand new', 'UV-reflective cross-linking acrylics prevent color fading'],
        specifications: ['100% Pure Acrylic Elastomeric Emulsion', 'Dry Film Thickness: 110 – 130 microns', 'Weather-o-meter tested for 1,500+ hours UV durability'],
        protocol: 'SLN Weather-Shield System',
        standard: 'ASTM D412 & Indian Standards Compliant',
        iconType: 'paint',
        accentColor: '#f59e0b',
        order: 6,
        publicationStatus: true,
      },
      {
        title: 'Structural Crack Stitching & Grouting',
        slug: 'structural-crack-stitching-grouting',
        disciplineId: 'repairs',
        disciplineName: 'Building Repairs & Restoration',
        category: 'Structural crack stitching and grouting',
        categoryLabel: 'Crack Stitching',
        warranty: 'Up to 10-Yr Warranty',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        description: 'Settlement cracks, shear stress fissures, and thermal movements compromise structural integrity and invite water seepage.',
        advantages: ['Restores monolithic structural strength across fractured masonry', 'Low-viscosity epoxy penetrates cracks down to 0.1mm width', 'Clean architectural finish without unsightly exterior scars'],
        specifications: ['Epoxy Compressive Strength: > 70 N/mm²', 'Tensile Strength: > 35 N/mm²', 'Helical Ties: 316 Austenitic Stainless Steel'],
        protocol: 'SLN Structural-Stitch Protocol',
        standard: 'IS 456 Structural Concrete Guidelines',
        iconType: 'wrench',
        accentColor: '#029746',
        order: 9,
        publicationStatus: true,
      },
      {
        title: 'Moisture-Resistant Gypsum False Ceilings',
        slug: 'moisture-resistant-gypsum-false-ceilings',
        disciplineId: 'false-ceiling',
        disciplineName: 'False Ceiling & Interior Work',
        category: 'Moisture resistant gypsum false ceilings',
        categoryLabel: 'Gypsum Ceilings',
        warranty: 'Up to 7-Yr Warranty',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        description: 'Engineered for coastal humidity, top-floor apartments, and bathrooms, our moisture-resistant false ceiling installations use Saint-Gobain Gyproc moisture-repellent plasterboards.',
        advantages: ['Special water-repellent silicone core prevents moisture absorption and sagging', 'Galvanized Gypsteel metal frame resists rust and humidity warping', 'Class 1 surface spread of flame fire safety rating'],
        specifications: ['12.5mm Gyproc Moisture-Resistant Plasterboard', '0.5mm Zinc Coated Gypsteel GI Suspension Channels', 'Water absorption rate < 5% as per IS 2095 Part 1'],
        protocol: 'SLN Ceiling-Guard System',
        standard: 'IS 2095 Part 1 Moisture Standards',
        iconType: 'layers',
        accentColor: '#eab308',
        order: 12,
        publicationStatus: true,
      },
    ];

    await Service.deleteMany({});
    const inserted = await Service.insertMany(DEFAULT_SERVICES);

    await logAuditEvent({
      req,
      action: 'RESET_SERVICES_DEFAULTS',
      resource: 'Service',
      details: { count: inserted.length },
    });

    res.json({ success: true, count: inserted.length, data: inserted });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    let service = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      service = await Service.findByIdAndDelete(req.params.id);
    }
    if (!service) {
      service = await Service.findOneAndDelete({
        $or: [{ slug: req.params.id }, { id: req.params.id }, { title: req.params.id }],
      });
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await logAuditEvent({
      req,
      action: 'DELETE_SERVICE',
      resource: 'Service',
      resourceId: service._id || req.params.id,
      details: { title: service.title },
    });

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== PROJECTS CRUD ====================
export const getAllProjects = async (req, res, next) => {
  try {
    await ensureProjectsSeed();
    const { category, discipline, search, page = 1, limit = 100 } = req.query;
    const query = {};

    if (category && category !== 'All' && category !== 'all') {
      query.$or = [{ serviceCategory: category }, { serviceTitle: category }];
    }
    if (discipline && discipline !== 'All' && discipline !== 'all') {
      query.disciplineId = discipline;
    }
    if (search) {
      const searchOr = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { clientReference: { $regex: search, $options: 'i' } },
        { materialsUsed: { $regex: search, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }];
        delete query.$or;
      } else {
        query.$or = searchOr;
      }
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      total,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      serviceCategory,
      serviceTitle,
      serviceId,
      disciplineId,
      disciplineName,
      location,
      clientReference,
      problemDescription,
      inspectionFindings,
      workPerformed,
      materialsUsed,
      beforeMedia = [],
      duringMedia = [],
      afterMedia = [],
      completionDate,
      warrantyDetails,
      warrantyYears,
      warrantyTitle,
      formulation,
      coverImage,
      image,
      isPublished,
      customerConsentPublished,
      isFeatured,
    } = req.body;

    let baseSlug = (title || 'project')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const finalImage = image || coverImage || afterMedia?.[0]?.url || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
    const finalFormulation = Array.isArray(formulation) && formulation.length > 0
      ? formulation
      : typeof materialsUsed === 'string'
      ? materialsUsed.split(/[,•\n]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      title,
      slug,
      serviceCategory: serviceCategory || serviceTitle || 'Terrace and roof waterproofing',
      serviceTitle: serviceTitle || serviceCategory || title,
      serviceId: serviceId || null,
      disciplineId: disciplineId || 'waterproofing',
      disciplineName: disciplineName || 'Waterproofing Solutions',
      location: location || 'Hyderabad, Telangana',
      clientReference: clientReference || 'Commercial / Residential Property',
      problemDescription: problemDescription || '',
      inspectionFindings: inspectionFindings || '',
      workPerformed: workPerformed || '',
      materialsUsed: materialsUsed || finalFormulation.join(', '),
      formulation: finalFormulation,
      coverImage: finalImage,
      image: finalImage,
      warrantyYears: warrantyYears || '10-Year',
      warrantyTitle: warrantyTitle || warrantyDetails || 'Written Certificate of Waterproofing Assurance',
      warrantyDetails: warrantyDetails || 'Standard 10-Year Leak-Proof Workmanship Warranty',
      beforeMedia: Array.isArray(beforeMedia) ? beforeMedia : [],
      duringMedia: Array.isArray(duringMedia) ? duringMedia : [],
      afterMedia: Array.isArray(afterMedia) ? afterMedia : [],
      completionDate: completionDate || new Date(),
      isPublished: isPublished !== undefined ? isPublished : true,
      customerConsentPublished: customerConsentPublished !== undefined ? customerConsentPublished : true,
      isFeatured: Boolean(isFeatured),
      showOnHome: Boolean(req.body.showOnHome),
      featuredUpdatedAt: isFeatured ? Date.now() : 0,
    });

    if (project.showOnHome && project.disciplineId) {
      await Project.updateMany(
        { _id: { $ne: project._id }, disciplineId: project.disciplineId },
        { $set: { showOnHome: false } }
      ).catch(() => {});
    }

    if (project.isFeatured && project.disciplineId) {
      await Project.updateMany(
        { _id: { $ne: project._id }, disciplineId: project.disciplineId },
        { $set: { isFeatured: false } }
      ).catch(() => {});
    }

    await logAuditEvent({
      req,
      action: 'CREATE_PROJECT',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title, slug: project.slug },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (updateData.materialsUsed && (!updateData.formulation || updateData.formulation.length === 0)) {
      updateData.formulation = String(updateData.materialsUsed)
        .split(/[,•\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (updateData.image && !updateData.coverImage) {
      updateData.coverImage = updateData.image;
    }
    if (updateData.coverImage && !updateData.image) {
      updateData.image = updateData.coverImage;
    }

    if (updateData.showOnHome === true) {
      updateData.isPublished = true;
      const existingProject = mongoose.Types.ObjectId.isValid(req.params.id)
        ? await Project.findById(req.params.id).select('disciplineId').lean()
        : null;
      const targetDisc = updateData.disciplineId || existingProject?.disciplineId;
      if (targetDisc) {
        await Project.updateMany(
          { _id: { $ne: req.params.id }, disciplineId: targetDisc },
          { $set: { showOnHome: false } }
        ).catch(() => {});
      }
    }

    if (updateData.isFeatured === true) {
      updateData.isPublished = true;
      updateData.featuredUpdatedAt = Date.now();
      const existingProject = mongoose.Types.ObjectId.isValid(req.params.id)
        ? await Project.findById(req.params.id).select('disciplineId').lean()
        : null;
      const targetDisc = updateData.disciplineId || existingProject?.disciplineId;
      if (targetDisc) {
        // Enforce 1 Featured Showcase per Discipline Pillar
        await Project.updateMany(
          { _id: { $ne: req.params.id }, disciplineId: targetDisc },
          { $set: { isFeatured: false } }
        ).catch(() => {});
      }
    }

    if (updateData.isPublished === false) {
      updateData.showOnHome = false;
      updateData.isFeatured = false;
      updateData.isActive = false;
    }

    let project = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      project = await Project.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
    }

    if (!project) {
      project = await Project.findOneAndUpdate(
        { $or: [{ slug: req.params.id }, { id: req.params.id }, { title: req.params.id }] },
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await logAuditEvent({
      req,
      action: 'UPDATE_PROJECT',
      resource: 'Project',
      resourceId: project._id,
      details: { title: project.title },
    });

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    let project = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      project = await Project.findByIdAndDelete(req.params.id);
    }

    if (!project) {
      project = await Project.findOneAndDelete({
        $or: [{ slug: req.params.id }, { id: req.params.id }, { title: req.params.id }],
      });
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await logAuditEvent({
      req,
      action: 'DELETE_PROJECT',
      resource: 'Project',
      resourceId: req.params.id,
      details: { title: project.title },
    });

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== ENQUIRIES CRUD ====================
export const getAllEnquiries = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .populate('assignedStaff', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, total, data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const { status, assignedStaff, followUpDate, newNote } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (status && status !== enquiry.status) {
      enquiry.internalNotes.push({
        note: `Status changed from '${enquiry.status}' to '${status}'`,
        author: req.user?.username || 'Admin',
      });
      enquiry.status = status;
    }

    if (assignedStaff !== undefined) {
      enquiry.assignedStaff = assignedStaff || null;
    }

    if (followUpDate !== undefined) {
      enquiry.followUpDate = followUpDate || null;
    }

    if (newNote && newNote.trim()) {
      enquiry.internalNotes.push({
        note: newNote.trim(),
        author: req.user?.username || 'Admin',
      });
    }

    await enquiry.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_ENQUIRY',
      resource: 'Enquiry',
      resourceId: enquiry._id,
      details: { status: enquiry.status, customerName: enquiry.customerName },
    });

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await logAuditEvent({
      req,
      action: 'DELETE_ENQUIRY',
      resource: 'Enquiry',
      resourceId: req.params.id,
      details: { customerName: enquiry.customerName },
    });

    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== CUSTOMERS ====================
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// ==================== REVIEWS MODERATION ====================
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const {
      customerName,
      rating,
      feedbackText,
      projectTitle,
      isApproved,
      isSpam,
      adminNotes,
      showOnHome,
    } = req.body;

    if (!customerName || !feedbackText || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, rating (1-5 stars), and written feedback are required.',
      });
    }

    if (showOnHome) {
      const homeCount = await Review.countDocuments({ showOnHome: true });
      if (homeCount >= 3) {
        return res.status(400).json({
          success: false,
          message: 'Only a maximum of 3 reviews can be featured on the Homepage. Please deselect another review first.',
        });
      }
    }

    const review = await Review.create({
      customerName: customerName.trim(),
      rating: Number(rating),
      feedbackText: feedbackText.trim(),
      projectTitle: projectTitle ? projectTitle.trim() : 'Waterproofing & Civil Restoration',
      isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      showOnHome: Boolean(showOnHome),
      isSpam: Boolean(isSpam),
      adminNotes: adminNotes ? adminNotes.trim() : '',
      consentToPublish: true,
      token: 'admin-created',
    });

    await logAuditEvent({
      req,
      action: 'CREATE_REVIEW',
      resource: 'Review',
      resourceId: review._id,
      details: { customerName: review.customerName, rating: review.rating, showOnHome: review.showOnHome },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const {
      customerName,
      rating,
      feedbackText,
      projectTitle,
      isApproved,
      isSpam,
      adminNotes,
      showOnHome,
    } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (showOnHome !== undefined) {
      const willBeHome = Boolean(showOnHome);
      if (willBeHome && !review.showOnHome) {
        const homeCount = await Review.countDocuments({
          _id: { $ne: review._id },
          showOnHome: true,
        });
        if (homeCount >= 3) {
          return res.status(400).json({
            success: false,
            message: 'Only a maximum of 3 reviews can be featured on the Homepage. Please deselect another review first.',
          });
        }
      }
      review.showOnHome = willBeHome;
    }

    if (customerName !== undefined) review.customerName = customerName.trim();
    if (rating !== undefined) review.rating = Number(rating);
    if (feedbackText !== undefined) review.feedbackText = feedbackText.trim();
    if (projectTitle !== undefined) review.projectTitle = projectTitle.trim();
    if (isApproved !== undefined) review.isApproved = Boolean(isApproved);
    if (isSpam !== undefined) review.isSpam = Boolean(isSpam);
    if (adminNotes !== undefined) review.adminNotes = adminNotes;

    await review.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_REVIEW',
      resource: 'Review',
      resourceId: review._id,
      details: {
        customerName: review.customerName,
        rating: review.rating,
        isApproved: review.isApproved,
        showOnHome: review.showOnHome,
        isSpam: review.isSpam,
      },
    });

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await logAuditEvent({
      req,
      action: 'DELETE_REVIEW',
      resource: 'Review',
      resourceId: req.params.id,
      details: { customerName: review.customerName },
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== QR REVIEW SYSTEM ====================
export const generateProjectReviewLink = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Associated project not found' });
    }

    // Settings for reviewBaseUrl
    const settings = await CompanySettings.findOne();
    const baseUrl = settings?.reviewBaseUrl || process.env.PUBLIC_DOMAIN || 'http://localhost:5173';

    // Generate cryptographically secure unguessable token
    const token = generateSecureToken();
    const fullReviewUrl = `${baseUrl.replace(/\/$/, '')}/scan-review/${token}`;

    // Generate scannable QR code data URL base64
    const qrCodeDataUrl = await generateQRCodeDataUrl(fullReviewUrl);

    const reviewLink = await ReviewLink.create({
      token,
      projectId: project._id,
      projectTitle: project.title,
      clientReference: project.clientReference,
      qrCodeDataUrl,
      isActive: true,
      createdBy: req.user?._id || null,
    });

    await logAuditEvent({
      req,
      action: 'GENERATE_QR_REVIEW_LINK',
      resource: 'ReviewLink',
      resourceId: reviewLink._id,
      details: { projectTitle: project.title, token },
    });

    res.status(201).json({
      success: true,
      message: 'Cryptographically secure QR review link generated successfully!',
      data: {
        ...reviewLink.toObject(),
        reviewUrl: fullReviewUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviewLinks = async (req, res, next) => {
  try {
    const links = await ReviewLink.find()
      .populate('projectId', 'title location serviceCategory')
      .sort({ createdAt: -1 })
      .lean();

    const settings = await CompanySettings.findOne();
    const baseUrl = settings?.reviewBaseUrl || process.env.PUBLIC_DOMAIN || 'http://localhost:5173';

    const enrichedLinks = links.map((link) => ({
      ...link,
      reviewUrl: `${baseUrl.replace(/\/$/, '')}/scan-review/${link.token}`,
    }));

    res.json({ success: true, count: enrichedLinks.length, data: enrichedLinks });
  } catch (error) {
    next(error);
  }
};

export const toggleReviewLinkStatus = async (req, res, next) => {
  try {
    const link = await ReviewLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Review link not found' });
    }

    link.isActive = !link.isActive;
    await link.save();

    await logAuditEvent({
      req,
      action: 'TOGGLE_QR_LINK',
      resource: 'ReviewLink',
      resourceId: link._id,
      details: { isActive: link.isActive },
    });

    res.json({
      success: true,
      message: `Review link ${link.isActive ? 'activated' : 'deactivated'} successfully`,
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GOOGLE REVIEW QR CODE (Super Admin Only) ====================
export const getGoogleReviewQRCode = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    const googleReviewUrl =
      settings.googleReviewUrl && !settings.googleReviewUrl.includes('sln-engineers-review') && !settings.googleReviewUrl.includes('slnengineers/review')
        ? settings.googleReviewUrl
        : 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';

    let qrCodeDataUrl = settings.googleQrCodeDataUrl;
    if (!qrCodeDataUrl) {
      qrCodeDataUrl = await generateQRCodeDataUrl(googleReviewUrl);
      settings.googleQrCodeDataUrl = qrCodeDataUrl;
      settings.googleQrUpdatedAt = settings.googleQrUpdatedAt || new Date();
      await settings.save();
    }

    res.json({
      success: true,
      data: {
        googleReviewUrl,
        qrCodeDataUrl,
        updatedAt: settings.googleQrUpdatedAt || settings.updatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoogleReviewUrl = async (req, res, next) => {
  try {
    const { googleReviewUrl } = req.body;
    if (!googleReviewUrl || !googleReviewUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Google Review URL.',
      });
    }

    const trimmedUrl = googleReviewUrl.trim();
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }
    settings.googleReviewUrl = trimmedUrl;
    const qrCodeDataUrl = await generateQRCodeDataUrl(trimmedUrl);
    settings.googleQrCodeDataUrl = qrCodeDataUrl;
    settings.googleQrUpdatedAt = new Date();
    await settings.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_GOOGLE_REVIEW_URL',
      resource: 'CompanySettings',
      resourceId: settings._id,
      details: { googleReviewUrl: trimmedUrl },
    });

    res.json({
      success: true,
      message: 'Google review link and QR code updated successfully.',
      data: {
        googleReviewUrl: trimmedUrl,
        qrCodeDataUrl,
        updatedAt: settings.googleQrUpdatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Generate a brand new Google Review QR Code replacing the old one
export const generateNewGoogleQRCode = async (req, res, next) => {
  try {
    const { googleReviewUrl } = req.body || {};
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }

    const targetUrl =
      googleReviewUrl && googleReviewUrl.trim()
        ? googleReviewUrl.trim()
        : settings.googleReviewUrl && !settings.googleReviewUrl.includes('sln-engineers-review')
        ? settings.googleReviewUrl
        : 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';

    settings.googleReviewUrl = targetUrl;
    // Generate fresh new QR code replacing the previous one
    const newQrCodeDataUrl = await generateQRCodeDataUrl(targetUrl);
    settings.googleQrCodeDataUrl = newQrCodeDataUrl;
    settings.googleQrUpdatedAt = new Date();
    await settings.save();

    await logAuditEvent({
      req,
      action: 'GENERATE_NEW_GOOGLE_QR_CODE',
      resource: 'CompanySettings',
      resourceId: settings._id,
      details: { googleReviewUrl: targetUrl, replacedAt: settings.googleQrUpdatedAt },
    });

    res.json({
      success: true,
      message: 'Brand new Google Review QR code generated and replaced old QR code successfully.',
      data: {
        googleReviewUrl: targetUrl,
        qrCodeDataUrl: newQrCodeDataUrl,
        updatedAt: settings.googleQrUpdatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset Google Review QR Code to factory default
export const resetGoogleQRCode = async (req, res, next) => {
  try {
    const defaultUrl = 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }
    settings.googleReviewUrl = defaultUrl;
    const newQrCodeDataUrl = await generateQRCodeDataUrl(defaultUrl);
    settings.googleQrCodeDataUrl = newQrCodeDataUrl;
    settings.googleQrUpdatedAt = new Date();
    await settings.save();

    res.json({
      success: true,
      message: 'Google Review QR code reset to default and replaced successfully.',
      data: {
        googleReviewUrl: defaultUrl,
        qrCodeDataUrl: newQrCodeDataUrl,
        updatedAt: settings.googleQrUpdatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CUSTOMER REVIEW QR CODE (Super Admin Only) ====================
export const getCustomerReviewQRCode = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    const origin = req.headers.origin || req.headers.referer || '';
    let host = settings.reviewBaseUrl || 'http://localhost:5173';
    if (!settings.reviewBaseUrl && origin) {
      try {
        const parsed = new URL(origin);
        host = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {}
    }
    const customerReviewUrl =
      settings.customerReviewUrl && settings.customerReviewUrl.trim()
        ? settings.customerReviewUrl.trim()
        : `${host.replace(/\/$/, '')}/review`;

    let qrCodeDataUrl = settings.customerQrCodeDataUrl;
    if (!qrCodeDataUrl) {
      qrCodeDataUrl = await generateQRCodeDataUrl(customerReviewUrl);
      settings.customerQrCodeDataUrl = qrCodeDataUrl;
      settings.customerQrUpdatedAt = settings.customerQrUpdatedAt || new Date();
      await settings.save();
    }

    res.json({
      success: true,
      data: {
        customerReviewUrl,
        qrCodeDataUrl,
        version: settings.customerQrVersion || 'v1',
        updatedAt: settings.customerQrUpdatedAt || settings.updatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomerReviewUrl = async (req, res, next) => {
  try {
    const { customerReviewUrl } = req.body;
    if (!customerReviewUrl || !customerReviewUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Customer Review URL.',
      });
    }

    const trimmedUrl = customerReviewUrl.trim();
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }
    settings.customerReviewUrl = trimmedUrl;
    const qrCodeDataUrl = await generateQRCodeDataUrl(trimmedUrl);
    settings.customerQrCodeDataUrl = qrCodeDataUrl;
    settings.customerQrUpdatedAt = new Date();
    await settings.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_CUSTOMER_REVIEW_URL',
      resource: 'CompanySettings',
      resourceId: settings._id,
      details: { customerReviewUrl: trimmedUrl },
    });

    res.json({
      success: true,
      message: 'Customer review link and QR code updated successfully.',
      data: {
        customerReviewUrl: trimmedUrl,
        qrCodeDataUrl,
        version: settings.customerQrVersion || 'v1',
        updatedAt: settings.customerQrUpdatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Generate a brand new Customer Review QR Code replacing the old one
export const generateNewCustomerQRCode = async (req, res, next) => {
  try {
    const { customerReviewUrl, generateNewVersion } = req.body || {};
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }
    const origin = req.headers.origin || req.headers.referer || '';
    let host = settings.reviewBaseUrl || 'http://localhost:5173';
    if (!settings.reviewBaseUrl && origin) {
      try {
        const parsed = new URL(origin);
        host = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {}
    }

    let version = settings.customerQrVersion || 'v1';
    let targetUrl = customerReviewUrl && customerReviewUrl.trim() ? customerReviewUrl.trim() : '';

    if (generateNewVersion) {
      const nextVerNum = (parseInt((version.match(/\d+/) || [1])[0], 10) || 1) + 1;
      version = `v${nextVerNum}`;
      settings.customerQrVersion = version;
      if (!targetUrl || targetUrl.includes('/review')) {
        targetUrl = `${host.replace(/\/$/, '')}/review?v=${version}`;
      }
    } else if (!targetUrl) {
      targetUrl = settings.customerReviewUrl && settings.customerReviewUrl.trim()
        ? settings.customerReviewUrl.trim()
        : `${host.replace(/\/$/, '')}/review`;
    }

    settings.customerReviewUrl = targetUrl;
    // Generate fresh new QR code replacing the previous one
    const newQrCodeDataUrl = await generateQRCodeDataUrl(targetUrl);
    settings.customerQrCodeDataUrl = newQrCodeDataUrl;
    settings.customerQrUpdatedAt = new Date();
    await settings.save();

    await logAuditEvent({
      req,
      action: 'GENERATE_NEW_CUSTOMER_QR_CODE',
      resource: 'CompanySettings',
      resourceId: settings._id,
      details: { customerReviewUrl: targetUrl, version, replacedAt: settings.customerQrUpdatedAt },
    });

    res.json({
      success: true,
      message: 'Brand new Customer Review QR code generated and replaced old QR code successfully.',
      data: {
        customerReviewUrl: targetUrl,
        qrCodeDataUrl: newQrCodeDataUrl,
        version,
        updatedAt: settings.customerQrUpdatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset Customer Review QR Code to factory default
export const resetCustomerQRCode = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }
    const origin = req.headers.origin || req.headers.referer || '';
    let host = settings.reviewBaseUrl || 'http://localhost:5173';
    if (!settings.reviewBaseUrl && origin) {
      try {
        const parsed = new URL(origin);
        host = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {}
    }
    const defaultUrl = `${host.replace(/\/$/, '')}/review`;
    settings.customerReviewUrl = defaultUrl;
    settings.customerQrVersion = 'v1';
    const newQrCodeDataUrl = await generateQRCodeDataUrl(defaultUrl);
    settings.customerQrCodeDataUrl = newQrCodeDataUrl;
    settings.customerQrUpdatedAt = new Date();
    await settings.save();

    res.json({
      success: true,
      message: 'Customer Review QR code reset to default and replaced successfully.',
      data: {
        customerReviewUrl: defaultUrl,
        qrCodeDataUrl: newQrCodeDataUrl,
        version: 'v1',
        updatedAt: settings.customerQrUpdatedAt,
        companyName: settings.companyName || 'SLN Engineers Projects Pvt. Ltd.',
        phone: settings.phone || '+91 8977668776',
        tagline: settings.tagline || 'Restoration for Three Generations',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SOCIAL LINKS & SETTINGS ====================
export const getAdminSocialLinks = async (req, res, next) => {
  try {
    const links = await SocialLink.find().sort({ order: 1 });
    res.json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
};

export const updateSocialLink = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Social link not found' });
    }
    res.json({ success: true, data: link });
  } catch (error) {
    next(error);
  }
};

export const getAdminSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateAdminSettings = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    let settings = await CompanySettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    try {
      await logAuditEvent({
        req,
        action: 'UPDATE_SETTINGS',
        resource: 'CompanySettings',
        resourceId: settings._id,
        details: { updatedFields: Object.keys(updateData) },
      });
    } catch (auditErr) {
      console.warn('Audit log warning:', auditErr.message);
    }

    res.json({ success: true, message: 'Company settings updated successfully', data: settings });
  } catch (error) {
    next(error);
  }
};

// ==================== AUDIT LOGS ====================
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
