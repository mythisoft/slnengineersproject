import TrustMetric from '../models/TrustMetric.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const DEFAULT_TRUST_METRICS_DATA = [
  {
    value: '40+ Yrs',
    label: 'Continuous Contracting Practice',
    icon: 'Calendar',
    color: '#0284c7',
    order: 1,
    isActive: true,
  },
  {
    value: '3 Generations',
    label: 'Lineage & Family Trust',
    icon: 'Users',
    color: '#0284c7',
    order: 2,
    isActive: true,
  },
  {
    value: '1,450+',
    label: 'Projects Waterproofed',
    icon: 'Building2',
    color: '#0284c7',
    order: 3,
    isActive: true,
  },
  {
    value: 'Up to 10 Yrs',
    label: 'Written Warranty Options',
    icon: 'ShieldCheck',
    color: '#0284c7',
    order: 4,
    isActive: true,
  },
  {
    value: 'IS 1346 & IS 3067',
    label: 'Certified Standards',
    icon: 'Shield',
    color: '#0284c7',
    order: 5,
    isActive: true,
  },
  {
    value: 'Fosroc, Sika & Dr. Fixit',
    label: 'Chemical Matrix',
    icon: 'FlaskConical',
    color: '#0284c7',
    order: 6,
    isActive: true,
  },
  {
    value: 'Thermal Moisture',
    label: 'Diagnostic Surveys',
    icon: 'Search',
    color: '#0284c7',
    order: 7,
    isActive: true,
  },
  {
    value: 'QR-Code Verified',
    label: 'Warranty Handover',
    icon: 'QrCode',
    color: '#0284c7',
    order: 8,
    isActive: true,
  },
];

// Helper to auto-seed default metrics if database is empty
const seedIfEmpty = async () => {
  const count = await TrustMetric.countDocuments();
  if (count === 0) {
    await TrustMetric.insertMany(DEFAULT_TRUST_METRICS_DATA);
    return true;
  }
  return false;
};

// GET /api/trust-metrics (Public: active metrics sorted by order)
export const getPublicTrustMetrics = async (req, res, next) => {
  try {
    await seedIfEmpty();
    const metrics = await TrustMetric.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({
      success: true,
      count: metrics.length,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/trust-metrics (Admin: all metrics sorted by order)
export const getAdminTrustMetrics = async (req, res, next) => {
  try {
    await seedIfEmpty();
    const metrics = await TrustMetric.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({
      success: true,
      count: metrics.length,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/trust-metrics (Admin: create new metric)
export const createTrustMetric = async (req, res, next) => {
  try {
    const { value, label, icon, color, order, isActive } = req.body;

    if (!value || typeof value !== 'string' || !value.trim()) {
      return res.status(400).json({ success: false, message: 'Metric value is required (e.g. 40+ Yrs).' });
    }
    if (!label || typeof label !== 'string' || !label.trim()) {
      return res.status(400).json({ success: false, message: 'Metric label is required (e.g. Continuous Contracting Practice).' });
    }

    const metricOrder = order !== undefined && Number.isFinite(Number(order))
      ? Number(order)
      : (await TrustMetric.countDocuments()) + 1;

    const metric = await TrustMetric.create({
      value: value.trim(),
      label: label.trim(),
      icon: typeof icon === 'string' && icon.trim() ? icon.trim() : 'ShieldCheck',
      color: typeof color === 'string' && color.trim() ? color.trim() : '#0284c7',
      order: metricOrder,
      isActive: isActive !== false,
    });

    await logAuditEvent({
      req,
      action: 'CREATE_TRUST_METRIC',
      resource: 'TrustMetric',
      resourceId: metric._id,
      details: { value: metric.value, label: metric.label },
    });

    res.status(201).json({
      success: true,
      message: 'Trust metric created successfully.',
      data: metric,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/trust-metrics/:id (Admin: update existing metric)
export const updateTrustMetric = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, label, icon, color, order, isActive } = req.body;

    const metric = await TrustMetric.findById(id);
    if (!metric) {
      return res.status(404).json({ success: false, message: 'Trust metric not found.' });
    }

    if (value !== undefined) {
      if (typeof value !== 'string' || !value.trim()) {
        return res.status(400).json({ success: false, message: 'Metric value cannot be empty.' });
      }
      metric.value = value.trim();
    }

    if (label !== undefined) {
      if (typeof label !== 'string' || !label.trim()) {
        return res.status(400).json({ success: false, message: 'Metric label cannot be empty.' });
      }
      metric.label = label.trim();
    }

    if (icon !== undefined) {
      metric.icon = typeof icon === 'string' && icon.trim() ? icon.trim() : 'ShieldCheck';
    }

    if (color !== undefined) {
      metric.color = typeof color === 'string' && color.trim() ? color.trim() : '#0284c7';
    }

    if (order !== undefined && Number.isFinite(Number(order))) {
      metric.order = Number(order);
    }

    if (isActive !== undefined) {
      metric.isActive = Boolean(isActive);
    }

    await metric.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_TRUST_METRIC',
      resource: 'TrustMetric',
      resourceId: metric._id,
      details: { value: metric.value, label: metric.label, isActive: metric.isActive },
    });

    res.json({
      success: true,
      message: 'Trust metric updated successfully.',
      data: metric,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/trust-metrics/:id (Admin: delete metric)
export const deleteTrustMetric = async (req, res, next) => {
  try {
    const { id } = req.params;
    const metric = await TrustMetric.findById(id);
    if (!metric) {
      return res.status(404).json({ success: false, message: 'Trust metric not found.' });
    }

    await TrustMetric.findByIdAndDelete(id);

    await logAuditEvent({
      req,
      action: 'DELETE_TRUST_METRIC',
      resource: 'TrustMetric',
      resourceId: id,
      details: { value: metric.value, label: metric.label },
    });

    res.json({
      success: true,
      message: 'Trust metric deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/trust-metrics/init-defaults (Admin: reset to 8 default metrics)
export const initDefaultTrustMetrics = async (req, res, next) => {
  try {
    await TrustMetric.deleteMany({});
    const inserted = await TrustMetric.insertMany(DEFAULT_TRUST_METRICS_DATA);

    await logAuditEvent({
      req,
      action: 'RESET_TRUST_METRICS',
      resource: 'TrustMetric',
      resourceId: 'all',
      details: { count: inserted.length },
    });

    res.json({
      success: true,
      message: 'Reset to 8 standard trust metrics successfully.',
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
