import mongoose from 'mongoose';
import TransformationPreset, { TransformationPresetInitialization } from '../models/TransformationPreset.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const initialPresets = [
  {
    title: 'Palm Meadows Villa',
    subtitle: 'Terrace & Roof Garden',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    showOnHome: true,
    isFeatured: true,
    featuredUpdatedAt: Date.now(),
    location: 'Medipally, Hyderabad | Mar 2026',
    beforeImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'Multi-layer elastomeric membrane eliminating bedroom ceiling leaks and standing rainwater ponding.',
    caseStudySlug: 'terrace-roof-waterproofing',
    isActive: true,
    order: 0,
  },
  {
    title: 'Tech Park Commercial Hub',
    subtitle: 'Structural Foundation & Basement Rehab',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    showOnHome: true,
    isFeatured: false,
    location: 'Madhapur, Hyderabad | Feb 2026',
    beforeImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'Precision structural crack stitching, carbon fiber strengthening, concrete spalling rehabilitation, and rebar rust passivation.',
    caseStudySlug: 'building-repairs',
    isActive: true,
    order: 1,
  },
  {
    title: 'Regency Enclave Complex',
    subtitle: 'Exterior Wall & Façade UV Shield',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    showOnHome: true,
    isFeatured: false,
    location: 'Jubilee Hills, Hyderabad | Jan 2026',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'High-durability 100% acrylic exterior monsoon weather-shield coatings and anti-fungal luxury architectural wall finishes.',
    caseStudySlug: 'exterior-painting',
    isActive: true,
    order: 2,
  },
  {
    title: 'Emerald Corporate Suites',
    subtitle: 'Acoustic Ceilings & Gypsum Partitions',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    showOnHome: true,
    isFeatured: false,
    location: 'Gachibowli, Hyderabad | Dec 2025',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'Moisture-resistant gypsum false ceilings, anti-sag framing, mineral fiber acoustic ceiling tiles, and ambient LED cove lighting.',
    caseStudySlug: 'false-ceiling-interior',
    isActive: true,
    order: 3,
  },
];

const validFields = {
  title: 100,
  subtitle: 120,
  disciplineId: 100,
  disciplineName: 120,
  coreCategory: 120,
  location: 120,
  caseStudySlug: 200,
  beforeImage: 2000,
  afterImage: 2000,
  beforeLabel: 120,
  afterLabel: 120,
  description: 1000,
};

const normalizePayload = (body, partial = false) => {
  const updates = {};
  for (const [field, maxLength] of Object.entries(validFields)) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'string' || body[field].length > maxLength) {
      return { error: `${field} must be a valid text string up to ${maxLength} characters.` };
    }
    const trimmed = body[field].trim();
    const isOptional = ['description', 'subtitle', 'disciplineId', 'disciplineName', 'coreCategory', 'location', 'caseStudySlug'].includes(field);
    if (!isOptional && trimmed.length === 0) {
      return { error: `${field} is required.` };
    }
    updates[field] = trimmed;
  }

  if (body.isActive !== undefined) {
    updates.isActive = body.isActive === true || body.isActive === 'true';
  }
  if (body.showOnHome !== undefined) {
    updates.showOnHome = body.showOnHome === true || body.showOnHome === 'true';
  }
  if (body.isFeatured !== undefined) {
    updates.isFeatured = body.isFeatured === true || body.isFeatured === 'true';
    if (updates.isFeatured) {
      updates.featuredUpdatedAt = Date.now();
    }
  }
  if (body.order !== undefined) {
    const order = Number(body.order);
    if (!Number.isFinite(order)) return { error: 'Order must be a number.' };
    updates.order = order;
  }

  if (!partial) {
    for (const field of ['title', 'beforeImage', 'afterImage']) {
      if (!updates[field]) return { error: `${field} is required.` };
    }
    if (!updates.beforeLabel) updates.beforeLabel = 'Before Treatment';
    if (!updates.afterLabel) updates.afterLabel = 'After Restoration';
  }
  return { updates };
};

const ensureInitialPresets = async () => {
  try {
    const initializationId = 'initial-presets-v3';
    if (await TransformationPresetInitialization.exists({ _id: initializationId })) return;
    if (!(await TransformationPreset.exists())) {
      await TransformationPreset.insertMany(initialPresets);
    }
    await TransformationPresetInitialization.create({ _id: initializationId });
  } catch (err) {
    console.warn('[Transformations] ensureInitialPresets skipped:', err.message);
  }
};

let inMemoryPresets = initialPresets.map((p, idx) => ({
  ...p,
  _id: p._id || `trans-0${idx + 1}`,
}));

export const getPublicTransformations = async (req, res, next) => {
  try {
    await ensureInitialPresets();
    const presets = await TransformationPreset.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({
      success: true,
      count: presets.length,
      data: presets,
    });
  } catch (error) {
    // Graceful in-memory fallback if database is not reachable
    const activeOnly = inMemoryPresets.filter((p) => p.isActive !== false);
    res.json({ success: true, count: activeOnly.length, data: activeOnly });
  }
};

export const getAdminTransformations = async (req, res, next) => {
  try {
    await ensureInitialPresets();
    const presets = await TransformationPreset.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({
      success: true,
      count: presets.length,
      data: presets,
    });
  } catch (error) {
    // Graceful in-memory fallback if database is not reachable
    res.json({ success: true, count: inMemoryPresets.length, data: inMemoryPresets });
  }
};

export const createTransformation = async (req, res, next) => {
  try {
    const { updates, error } = normalizePayload(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    if (updates.showOnHome === true) {
      updates.isActive = true;
      if (updates.disciplineId) {
        await TransformationPreset.updateMany(
          { disciplineId: updates.disciplineId },
          { $set: { showOnHome: false } }
        );
      }
    }

    if (updates.isFeatured === true) {
      updates.isActive = true;
      updates.showOnHome = true;
      await TransformationPreset.updateMany({}, { $set: { isFeatured: false } });
    }

    // Also sync in-memory fallback
    const newId = `trans-${Date.now()}`;
    const newPresetInMemory = { ...updates, _id: newId, order: inMemoryPresets.length };
    if (updates.showOnHome) {
      inMemoryPresets.forEach((p) => {
        if (p.disciplineId === updates.disciplineId) p.showOnHome = false;
      });
    }
    if (updates.isFeatured) {
      inMemoryPresets.forEach((p) => { p.isFeatured = false; });
    }
    inMemoryPresets.push(newPresetInMemory);

    const preset = await TransformationPreset.create(updates);
    await logAuditEvent({
      req,
      action: 'CREATE_TRANSFORMATION',
      resource: 'TransformationPreset',
      resourceId: preset._id,
      details: { title: preset.title },
    });
    res.status(201).json({ success: true, data: preset });
  } catch (error) {
    const fallbackItem = inMemoryPresets[inMemoryPresets.length - 1];
    if (fallbackItem) {
      return res.status(201).json({ success: true, data: fallbackItem });
    }
    next(error);
  }
};

export const updateTransformation = async (req, res, next) => {
  try {
    const { updates, error } = normalizePayload(req.body, true);
    if (error) return res.status(400).json({ success: false, message: error });

    // Logical business rules for isActive vs showOnHome vs isFeatured:
    // 1. If actively hidden (isActive === false), it CANNOT show on homepage or be featured
    if (updates.isActive === false) {
      updates.showOnHome = false;
      updates.isFeatured = false;
    }

    // 2. If selected for homepage showcase (showOnHome === true), it MUST be active
    if (updates.showOnHome === true) {
      updates.isActive = true;
      const current = await TransformationPreset.findById(req.params.id).catch(() => null);
      const disc = updates.disciplineId || current?.disciplineId;
      if (disc) {
        await TransformationPreset.updateMany(
          { _id: { $ne: req.params.id }, disciplineId: disc },
          { $set: { showOnHome: false } }
        ).catch(() => {});
      }
    }

    // 3. If featured, it MUST be active and show on homepage, deselect other featured
    if (updates.isFeatured === true) {
      updates.isActive = true;
      updates.showOnHome = true;
      await TransformationPreset.updateMany(
        { _id: { $ne: req.params.id } },
        { $set: { isFeatured: false } }
      ).catch(() => {});
    }

    // Update in-memory fallback
    const targetIdx = inMemoryPresets.findIndex((p) => String(p._id) === String(req.params.id));
    if (targetIdx !== -1) {
      const disc = updates.disciplineId || inMemoryPresets[targetIdx].disciplineId;
      if (updates.showOnHome === true && disc) {
        inMemoryPresets.forEach((p, idx) => {
          if (idx !== targetIdx && p.disciplineId === disc) {
            p.showOnHome = false;
          }
        });
      }
      if (updates.isFeatured === true) {
        inMemoryPresets.forEach((p, idx) => {
          if (idx !== targetIdx) p.isFeatured = false;
        });
      }
      inMemoryPresets[targetIdx] = { ...inMemoryPresets[targetIdx], ...updates };
    }

    const preset = await TransformationPreset.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (preset) {
      await logAuditEvent({
        req,
        action: 'UPDATE_TRANSFORMATION',
        resource: 'TransformationPreset',
        resourceId: preset._id,
        details: { title: preset.title },
      }).catch(() => {});
      return res.json({ success: true, data: preset });
    }

    // If MongoDB didn't have it but in-memory does:
    if (targetIdx !== -1) {
      return res.json({ success: true, data: inMemoryPresets[targetIdx] });
    }
    return res.status(404).json({ success: false, message: 'Transformation not found.' });
  } catch (error) {
    // If Mongo failed (offline), check in-memory
    const targetIdx = inMemoryPresets.findIndex((p) => String(p._id) === String(req.params.id));
    if (targetIdx !== -1) {
      return res.json({ success: true, data: inMemoryPresets[targetIdx] });
    }
    next(error);
  }
};

export const deleteTransformation = async (req, res, next) => {
  try {
    const id = req.params.id;
    inMemoryPresets = inMemoryPresets.filter(
      (p) => String(p._id) !== String(id) && String(p.id) !== String(id)
    );

    let preset = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      preset = await TransformationPreset.findByIdAndDelete(id);
    }
    if (!preset) {
      preset = await TransformationPreset.findOneAndDelete({
        $or: [{ _id: id }, { id: id }, { title: id }, { caseStudySlug: id }],
      });
    }

    await logAuditEvent({
      req,
      action: 'DELETE_TRANSFORMATION',
      resource: 'TransformationPreset',
      resourceId: preset?._id || id,
      details: { title: preset?.title || id },
    });
    res.json({ success: true, message: 'Transformation deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
