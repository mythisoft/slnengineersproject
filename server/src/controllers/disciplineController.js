import mongoose from 'mongoose';
import Discipline from '../models/Discipline.js';
import Service from '../models/Service.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const DEFAULT_DISCIPLINES = [
  {
    name: 'Waterproofing Solutions',
    slug: 'waterproofing',
    shortCategory: 'Active Hydrostatic Defense & Crystalline Tanking',
    tag: 'IS 1346 Certified',
    badge: 'Core Practice',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Droplets',
    accentColor: '#0284c7',
    description:
      'Permanent hydrostatic containment, high-pressure polyurethane injection grouting, crystalline deep tanking, and elastomeric membrane systems protecting against active groundwater ingress and structural moisture.',
    order: 1,
    isActive: true,
  },
  {
    name: 'Interior & Exterior Painting',
    slug: 'painting',
    shortCategory: 'Weather-Shield & Aesthetic Finishes',
    tag: 'UV Weather-Shield',
    badge: 'Weather Defense',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Paintbrush',
    accentColor: '#f59e0b',
    description:
      'High-durability 100% acrylic exterior monsoon weather-shield coatings, anti-fungal interior emulsions, washable luxury finishes, and architectural wall textures engineered for high UV resistance.',
    order: 2,
    isActive: true,
  },
  {
    name: 'Building Repairs & Restoration',
    slug: 'repairs',
    shortCategory: 'Structural Crack Stitching & Concrete Rehab',
    tag: 'Structural Defense',
    badge: '3 Generations Legacy',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Building2',
    accentColor: '#029746',
    description:
      'Precision structural crack stitching, carbon fiber strengthening, concrete spalling rehabilitation, rebar rust passivation, and elastomeric expansion joint sealing to restore load-bearing structural integrity.',
    order: 3,
    isActive: true,
  },
  {
    name: 'False Ceiling & Interior Work',
    slug: 'false-ceiling',
    shortCategory: 'Acoustic Ceilings & Gypsum Partitions',
    tag: 'Acoustic & Gypsum',
    badge: 'Interior Engineering',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Layers',
    accentColor: '#eab308',
    description:
      'Moisture-resistant gypsum false ceilings, anti-sag Gypsteel framing, mineral fiber acoustic ceiling tiles, ambient LED cove drop ceilings, and fire-resistant drywall partition systems.',
    order: 4,
    isActive: true,
  },
];

// Ensure database has default disciplines on startup or query
async function ensureDisciplinesSeed() {
  const count = await Discipline.countDocuments();
  if (count === 0) {
    await Discipline.insertMany(DEFAULT_DISCIPLINES);
  }
}

// GET /api/disciplines - Public active disciplines
export const getPublicDisciplines = async (req, res, next) => {
  try {
    await ensureDisciplinesSeed();
    const disciplines = await Discipline.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      count: disciplines.length,
      data: disciplines,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/disciplines - All disciplines for Admin
export const getAllDisciplines = async (req, res, next) => {
  try {
    await ensureDisciplinesSeed();
    const disciplines = await Discipline.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Attach service count to each discipline
    const disciplinesWithCounts = await Promise.all(
      disciplines.map(async (d) => {
        const serviceCount = await Service.countDocuments({ disciplineId: d.slug });
        return {
          ...d,
          serviceCount,
        };
      })
    );

    res.json({
      success: true,
      count: disciplinesWithCounts.length,
      data: disciplinesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/disciplines - Create new discipline
export const createDiscipline = async (req, res, next) => {
  try {
    const { name, slug, shortCategory, tag, badge, icon, accentColor, description, order, isActive } = req.body;

    let baseSlug = (slug || name || 'discipline')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let finalSlug = baseSlug;
    const existing = await Discipline.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const discipline = await Discipline.create({
      name,
      slug: finalSlug,
      shortCategory: shortCategory || '',
      tag: tag || 'IS Certified',
      badge: badge || 'Core Practice',
      icon: icon || 'Layers',
      accentColor: accentColor || '#0284c7',
      description: description || '',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await logAuditEvent({
      req,
      action: 'CREATE_DISCIPLINE',
      resource: 'Discipline',
      resourceId: discipline._id,
      details: { name: discipline.name, slug: discipline.slug },
    });

    res.status(201).json({ success: true, data: discipline });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/disciplines/:id - Update discipline
export const updateDiscipline = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    let oldDiscipline = null;
    if (mongoose.isValidObjectId(req.params.id)) {
      oldDiscipline = await Discipline.findById(req.params.id);
    }
    if (!oldDiscipline) {
      oldDiscipline = await Discipline.findOne({ slug: req.params.id });
    }
    if (!oldDiscipline) {
      return res.status(404).json({ success: false, message: 'Discipline not found' });
    }

    // If slug is being updated, also cascade update services pointing to the old slug
    if (updateData.slug && updateData.slug !== oldDiscipline.slug) {
      await Service.updateMany(
        { disciplineId: oldDiscipline.slug },
        { disciplineId: updateData.slug, disciplineName: updateData.name || oldDiscipline.name }
      );
    } else if (updateData.name && updateData.name !== oldDiscipline.name) {
      await Service.updateMany(
        { disciplineId: oldDiscipline.slug },
        { disciplineName: updateData.name }
      );
    }

    const updated = await Discipline.findByIdAndUpdate(oldDiscipline._id, updateData, {
      new: true,
      runValidators: true,
    });

    await logAuditEvent({
      req,
      action: 'UPDATE_DISCIPLINE',
      resource: 'Discipline',
      resourceId: updated._id,
      details: { name: updated.name, slug: updated.slug },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/disciplines/:id - Delete discipline
export const deleteDiscipline = async (req, res, next) => {
  try {
    let discipline = null;
    if (mongoose.isValidObjectId(req.params.id)) {
      discipline = await Discipline.findById(req.params.id);
    }
    if (!discipline) {
      discipline = await Discipline.findOne({ slug: req.params.id });
    }
    if (!discipline) {
      return res.status(404).json({ success: false, message: 'Discipline not found' });
    }

    // Check if services are assigned to this discipline
    const assignedCount = await Service.countDocuments({ disciplineId: discipline.slug });
    if (assignedCount > 0) {
      // Reassign to 'waterproofing' fallback or notify
      await Service.updateMany(
        { disciplineId: discipline.slug },
        { disciplineId: 'waterproofing', disciplineName: 'Waterproofing Solutions' }
      );
    }

    await Discipline.findByIdAndDelete(discipline._id);

    await logAuditEvent({
      req,
      action: 'DELETE_DISCIPLINE',
      resource: 'Discipline',
      resourceId: discipline._id,
      details: { name: discipline.name, reallocatedServices: assignedCount },
    });

    res.json({
      success: true,
      message: `Discipline "${discipline.name}" deleted successfully. ${assignedCount > 0 ? `(${assignedCount} services reallocated to Waterproofing).` : ''}`,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/disciplines/init-defaults - Reset to 4 default company pillars
export const initDefaultDisciplines = async (req, res, next) => {
  try {
    await Discipline.deleteMany({});
    const inserted = await Discipline.insertMany(DEFAULT_DISCIPLINES);

    await logAuditEvent({
      req,
      action: 'RESET_DISCIPLINES_DEFAULTS',
      resource: 'Discipline',
      details: { count: inserted.length },
    });

    res.json({ success: true, count: inserted.length, data: inserted });
  } catch (error) {
    next(error);
  }
};
