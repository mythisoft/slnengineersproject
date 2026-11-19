import ContactContent, { DEFAULT_CONTACT_CONTENT } from '../models/ContactContent.js';
import CompanySettings from '../models/CompanySettings.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// Get public contact content
export const getPublicContactContent = async (req, res) => {
  try {
    let content = await ContactContent.findOne();
    if (!content) {
      content = await ContactContent.create(DEFAULT_CONTACT_CONTENT);
    }
    return res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching public contact content:', error);
    return res.json({ success: true, data: DEFAULT_CONTACT_CONTENT });
  }
};

// Get admin contact content
export const getAdminContactContent = async (req, res) => {
  try {
    let content = await ContactContent.findOne();
    if (!content) {
      content = await ContactContent.create(DEFAULT_CONTACT_CONTENT);
    }
    return res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching admin contact content:', error);
    return res.json({ success: true, data: DEFAULT_CONTACT_CONTENT });
  }
};

// Update contact content
export const updateContactContent = async (req, res) => {
  try {
    const updateData = req.body;
    let content = await ContactContent.findOne();

    if (!content) {
      content = await ContactContent.create({ ...DEFAULT_CONTACT_CONTENT, ...updateData });
    } else {
      Object.assign(content, updateData);
      await content.save();
    }

    // Synchronize to CompanySettings so Header, Footer, and other site pages stay fully updated
    try {
      const companySettingsUpdate = {};
      if (updateData.hotlines) {
        if (updateData.hotlines.helpline !== undefined) companySettingsUpdate.phone = updateData.hotlines.helpline;
        if (updateData.hotlines.emergencyPhone !== undefined) companySettingsUpdate.emergencyPhone = updateData.hotlines.emergencyPhone;
        if (updateData.hotlines.email !== undefined) companySettingsUpdate.email = updateData.hotlines.email;
        if (updateData.hotlines.whatsapp !== undefined) companySettingsUpdate.whatsappNumber = updateData.hotlines.whatsapp;
        if (updateData.hotlines.whatsappDefaultMessage !== undefined) companySettingsUpdate.whatsappDefaultMessage = updateData.hotlines.whatsappDefaultMessage;
      }
      if (updateData.headquarters) {
        if (updateData.headquarters.street !== undefined) companySettingsUpdate['address.street'] = updateData.headquarters.street;
        if (updateData.headquarters.area !== undefined) companySettingsUpdate['address.area'] = updateData.headquarters.area;
        if (updateData.headquarters.city !== undefined) companySettingsUpdate['address.city'] = updateData.headquarters.city;
        if (updateData.headquarters.state !== undefined) companySettingsUpdate['address.state'] = updateData.headquarters.state;
        if (updateData.headquarters.pincode !== undefined) companySettingsUpdate['address.pincode'] = updateData.headquarters.pincode;
      }

      if (Object.keys(companySettingsUpdate).length > 0) {
        await CompanySettings.findOneAndUpdate(
          {},
          { $set: companySettingsUpdate },
          { new: true, upsert: true }
        );
      }
    } catch (syncErr) {
      console.warn('Failed to sync contact content to CompanySettings:', syncErr.message);
    }

    try {
      await logAuditEvent({
        req,
        action: 'UPDATE_CONTACT_CONTENT',
        resource: 'ContactContent',
        resourceId: content._id,
        details: { updatedSections: Object.keys(updateData) },
      });
    } catch (auditErr) {
      console.warn('[AuditLog] Non-fatal audit log warning:', auditErr.message);
    }

    return res.json({
      success: true,
      message: 'Contact page content updated successfully.',
      data: content,
    });
  } catch (error) {
    console.error('Error updating contact content:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating contact content: ' + error.message,
    });
  }
};

// Reset contact content to official defaults
export const resetContactContent = async (req, res) => {
  try {
    let content = await ContactContent.findOne();
    if (!content) {
      content = await ContactContent.create(DEFAULT_CONTACT_CONTENT);
    } else {
      Object.assign(content, DEFAULT_CONTACT_CONTENT);
      await content.save();
    }

    try {
      await CompanySettings.findOneAndUpdate(
        {},
        {
          $set: {
            phone: DEFAULT_CONTACT_CONTENT.hotlines.helpline,
            emergencyPhone: DEFAULT_CONTACT_CONTENT.hotlines.emergencyPhone,
            email: DEFAULT_CONTACT_CONTENT.hotlines.email,
            whatsappNumber: DEFAULT_CONTACT_CONTENT.hotlines.whatsapp,
            'address.street': DEFAULT_CONTACT_CONTENT.headquarters.street,
            'address.area': DEFAULT_CONTACT_CONTENT.headquarters.area,
            'address.city': DEFAULT_CONTACT_CONTENT.headquarters.city,
            'address.state': DEFAULT_CONTACT_CONTENT.headquarters.state,
            'address.pincode': DEFAULT_CONTACT_CONTENT.headquarters.pincode,
          },
        },
        { new: true, upsert: true }
      );
    } catch (syncErr) {
      console.warn('Failed to sync reset to CompanySettings:', syncErr.message);
    }

    try {
      await logAuditEvent({
        req,
        action: 'RESET_CONTACT_CONTENT',
        resource: 'ContactContent',
        resourceId: content._id,
        details: { resetToDefaults: true },
      });
    } catch (auditErr) {
      console.warn('[AuditLog] Non-fatal audit log warning:', auditErr.message);
    }

    return res.json({
      success: true,
      message: 'Contact page content has been reset to official SLN engineering defaults.',
      data: content,
    });
  } catch (error) {
    console.error('Error resetting contact content:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error resetting contact content: ' + error.message,
    });
  }
};
