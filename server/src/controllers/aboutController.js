import AboutContent, { DEFAULT_ABOUT_CONTENT } from '../models/AboutContent.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// Get public about content
export const getPublicAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = await AboutContent.create(DEFAULT_ABOUT_CONTENT);
    }
    return res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching public about content:', error);
    return res.json({ success: true, data: DEFAULT_ABOUT_CONTENT });
  }
};

// Get admin about content
export const getAdminAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = await AboutContent.create(DEFAULT_ABOUT_CONTENT);
    }
    return res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching admin about content:', error);
    return res.json({ success: true, data: DEFAULT_ABOUT_CONTENT });
  }
};

// Update about content
export const updateAboutContent = async (req, res) => {
  try {
    const updateData = req.body;
    let content = await AboutContent.findOne();

    if (!content) {
      content = await AboutContent.create({ ...DEFAULT_ABOUT_CONTENT, ...updateData });
    } else {
      Object.assign(content, updateData);
      await content.save();
    }

    try {
      await logAuditEvent({
        req,
        action: 'UPDATE_ABOUT_CONTENT',
        resource: 'AboutContent',
        resourceId: content._id,
        details: { updatedSections: Object.keys(updateData) },
      });
    } catch (auditErr) {
      console.warn('[AuditLog] Non-fatal audit log warning:', auditErr.message);
    }

    return res.json({ success: true, message: 'About Us page content updated successfully.', data: content });
  } catch (error) {
    console.error('Error updating about content:', error);
    return res.status(500).json({ success: false, message: 'Server error updating about content: ' + error.message });
  }
};

// Reset about content to defaults
export const resetAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();

    if (!content) {
      content = await AboutContent.create(DEFAULT_ABOUT_CONTENT);
    } else {
      Object.assign(content, DEFAULT_ABOUT_CONTENT);
      await content.save();
    }

    try {
      await logAuditEvent({
        req,
        action: 'RESET_ABOUT_CONTENT',
        resource: 'AboutContent',
        resourceId: content._id,
        details: { action: 'RESET_TO_DEFAULTS' },
      });
    } catch (auditErr) {
      console.warn('[AuditLog] Non-fatal audit log warning:', auditErr.message);
    }

    return res.json({ success: true, message: 'About page restored to factory defaults.', data: content });
  } catch (error) {
    console.error('Error resetting about content:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting about content: ' + error.message });
  }
};
