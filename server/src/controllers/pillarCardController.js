import PillarCard from '../models/PillarCard.js';
import Discipline from '../models/Discipline.js';
import GlimpseSetting from '../models/GlimpseSetting.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const DEFAULT_PILLAR_CARDS = [
  {
    pillarId: 'painting',
    pillarName: 'Interior & Exterior Painting',
    imageUrl: '/uploads/pillar-painting.jpg',
    accentColor: '#0077c8',
    order: 1,
    isActive: true,
  },
  {
    pillarId: 'waterproofing',
    pillarName: 'Waterproofing Solutions',
    imageUrl: '/uploads/pillar-waterproofing.jpg',
    accentColor: '#0284c7',
    order: 2,
    isActive: true,
  },
  {
    pillarId: 'repairs',
    pillarName: 'Building Repairs & Restoration',
    imageUrl: '/uploads/pillar-restoration.jpg',
    accentColor: '#ea580c',
    order: 3,
    isActive: true,
  },
  {
    pillarId: 'false-ceiling',
    pillarName: 'False Ceiling & Interior Work',
    imageUrl: '/uploads/pillar-false-ceiling.jpg',
    accentColor: '#eab308',
    order: 4,
    isActive: true,
  },
];

// Helper to auto-seed default pillar cards if collection is empty
const ensureDefaultsSeeded = async () => {
  try {
    const count = await PillarCard.countDocuments();
    if (count === 0) {
      await PillarCard.insertMany(DEFAULT_PILLAR_CARDS);
    }
  } catch (err) {
    console.error('Error auto-seeding default pillar cards:', err);
  }
};

// GET /api/pillar-cards (Public)
export const getPublicPillarCards = async (req, res) => {
  try {
    await ensureDefaultsSeeded();
    const cards = await PillarCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: cards.length > 0 ? cards : DEFAULT_PILLAR_CARDS,
    });
  } catch (error) {
    console.error('getPublicPillarCards error:', error);
    res.json({
      success: true,
      data: DEFAULT_PILLAR_CARDS,
    });
  }
};

// GET /api/admin/pillar-cards (Admin)
export const getAdminPillarCards = async (req, res) => {
  try {
    await ensureDefaultsSeeded();
    const cards = await PillarCard.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error('getAdminPillarCards error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pillar cards' });
  }
};

// POST /api/admin/pillar-cards (Admin)
export const createPillarCard = async (req, res) => {
  try {
    const { pillarId, pillarName, imageUrl, accentColor, order, isActive } = req.body;

    if (!pillarId || !pillarName || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'pillarId, pillarName, and imageUrl are required.',
      });
    }

    const card = await PillarCard.create({
      pillarId: pillarId.toLowerCase().trim(),
      pillarName: pillarName.trim(),
      imageUrl: imageUrl.trim(),
      accentColor: accentColor || '#0284c7',
      order: Number(order) || 0,
      isActive: isActive !== false,
    });

    await logAuditEvent({
      userId: req.user?._id,
      userEmail: req.user?.email || 'admin@slnengineers.com',
      action: 'CREATE',
      resourceType: 'PillarCard',
      resourceId: card._id,
      description: `Created horizontal pillar card for "${card.pillarName}"`,
      req,
    });

    res.status(201).json({
      success: true,
      data: card,
      message: 'Pillar card created successfully',
    });
  } catch (error) {
    console.error('createPillarCard error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create pillar card' });
  }
};

// PUT /api/admin/pillar-cards/:id (Admin)
export const updatePillarCard = async (req, res) => {
  try {
    const { pillarId, pillarName, imageUrl, accentColor, order, isActive } = req.body;

    const card = await PillarCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Pillar card not found' });
    }

    if (pillarId) card.pillarId = pillarId.toLowerCase().trim();
    if (pillarName) card.pillarName = pillarName.trim();
    if (imageUrl) card.imageUrl = imageUrl.trim();
    if (accentColor !== undefined) card.accentColor = accentColor;
    if (order !== undefined) card.order = Number(order);
    if (isActive !== undefined) card.isActive = Boolean(isActive);

    await card.save();

    await logAuditEvent({
      userId: req.user?._id,
      userEmail: req.user?.email || 'admin@slnengineers.com',
      action: 'UPDATE',
      resourceType: 'PillarCard',
      resourceId: card._id,
      description: `Updated pillar card for "${card.pillarName}"`,
      req,
    });

    res.json({
      success: true,
      data: card,
      message: 'Pillar card updated successfully',
    });
  } catch (error) {
    console.error('updatePillarCard error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update pillar card' });
  }
};

// DELETE /api/admin/pillar-cards/:id (Admin)
export const deletePillarCard = async (req, res) => {
  try {
    const card = await PillarCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Pillar card not found' });
    }

    await PillarCard.findByIdAndDelete(req.params.id);

    await logAuditEvent({
      userId: req.user?._id,
      userEmail: req.user?.email || 'admin@slnengineers.com',
      action: 'DELETE',
      resourceType: 'PillarCard',
      resourceId: card._id,
      description: `Deleted pillar card for "${card.pillarName}"`,
      req,
    });

    res.json({
      success: true,
      message: 'Pillar card deleted successfully',
    });
  } catch (error) {
    console.error('deletePillarCard error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete pillar card' });
  }
};

// PUT /api/admin/pillar-cards/reorder (Admin)
export const reorderPillarCards = async (req, res) => {
  try {
    const { items } = req.body; // array of { _id, order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items array is required' });
    }

    const updates = items.map((item, index) => {
      const cardId = item._id || item.id;
      const newOrder = typeof item.order === 'number' ? item.order : index + 1;
      if (!cardId) return Promise.resolve(null);
      return PillarCard.findByIdAndUpdate(cardId, { order: newOrder }, { new: true });
    });

    await Promise.all(updates);
    const updatedCards = await PillarCard.find().sort({ order: 1, createdAt: 1 });

    await logAuditEvent({
      userId: req.user?._id,
      userEmail: req.user?.email || 'admin@slnengineers.com',
      action: 'UPDATE',
      resourceType: 'PillarCard',
      resourceId: 'reorder',
      description: `Reordered ${items.length} pillar cards`,
      req,
    });

    res.json({
      success: true,
      data: updatedCards,
      message: 'Pillar cards reordered successfully',
    });
  } catch (error) {
    console.error('reorderPillarCards error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to reorder pillar cards' });
  }
};

// GET /api/pillar-cards/glimpse-settings (Public)
export const getGlimpseSettings = async (req, res) => {
  try {
    let setting = await GlimpseSetting.findOne();
    if (!setting) {
      setting = await GlimpseSetting.create({
        videoUrl: '',
        durationSeconds: 3,
        isEnabled: true,
        title: 'Specialized Civil Engineering in Action',
        badgeText: 'Civil Engineering in Action • 3s Glimpse',
      });
    }
    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error('getGlimpseSettings error:', error);
    res.json({
      success: true,
      data: {
        videoUrl: '',
        durationSeconds: 3,
        isEnabled: true,
        title: 'Specialized Civil Engineering in Action',
        badgeText: 'Civil Engineering in Action • 3s Glimpse',
      },
    });
  }
};

// PUT /api/admin/pillar-cards/glimpse-settings (Admin)
export const updateGlimpseSettings = async (req, res) => {
  try {
    const { videoUrl, durationSeconds, isEnabled, title, badgeText } = req.body;
    let setting = await GlimpseSetting.findOne();
    if (!setting) {
      setting = new GlimpseSetting();
    }

    if (videoUrl !== undefined) setting.videoUrl = videoUrl;
    if (durationSeconds !== undefined) setting.durationSeconds = Number(durationSeconds) || 3;
    if (isEnabled !== undefined) setting.isEnabled = Boolean(isEnabled);
    if (title !== undefined) setting.title = title;
    if (badgeText !== undefined) setting.badgeText = badgeText;

    await setting.save();

    await logAuditEvent({
      userId: req.user?._id,
      userEmail: req.user?.email || 'admin@slnengineers.com',
      action: 'UPDATE',
      resourceType: 'GlimpseSetting',
      resourceId: setting._id,
      description: `Updated Glimpse Video settings (enabled: ${setting.isEnabled}, duration: ${setting.durationSeconds}s)`,
      req,
    });

    res.json({
      success: true,
      data: setting,
      message: 'Glimpse video settings updated successfully',
    });
  } catch (error) {
    console.error('updateGlimpseSettings error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update glimpse settings' });
  }
};
