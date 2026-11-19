import AuditLog from '../models/AuditLog.js';

export const logAuditEvent = async ({ req, action, resource, resourceId = '', details = {} }) => {
  try {
    const userId = req.user?._id || null;
    const username = req.user?.username || 'Anonymous/System';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    await AuditLog.create({
      userId,
      username,
      action,
      resource,
      resourceId: String(resourceId),
      details,
      ipAddress,
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit log:', err.message);
  }
};
