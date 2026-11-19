import User from '../models/User.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// GET /api/admin/users - Get all admin users (Super Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id - Get single user by ID (Super Admin only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users - Create new admin user (Super Admin only)
export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = 'admin', isActive = true } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check for duplicate username or email
    const existing = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existing) {
      const field = existing.username === cleanUsername ? 'Username' : 'Email';
      return res.status(409).json({
        success: false,
        message: `${field} is already in use by another administrator.`,
      });
    }

    const passwordHash = await User.hashPassword(password);

    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: ['superadmin', 'admin', 'staff'].includes(role) ? role : 'admin',
      isActive: Boolean(isActive),
    });

    await logAuditEvent({
      req,
      action: 'CREATE_USER',
      resource: 'User',
      resourceId: newUser._id,
      details: { username: newUser.username, email: newUser.email, role: newUser.role },
    });

    res.status(201).json({
      success: true,
      message: `Administrator "${newUser.username}" created successfully.`,
      data: {
        _id: newUser._id,
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id - Update user details (Super Admin only)
export const updateUser = async (req, res, next) => {
  try {
    const { username, email, role, isActive } = req.body;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Protect against self-deactivation or demoting own superadmin status
    if (req.user._id.equals(targetUser._id)) {
      if (isActive === false) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own active super administrator account.',
        });
      }
      if (role && role !== 'superadmin') {
        return res.status(400).json({
          success: false,
          message: 'You cannot demote your own super administrator role.',
        });
      }
    }

    if (username && username.trim().toLowerCase() !== targetUser.username) {
      const cleanUsername = username.trim().toLowerCase();
      const existing = await User.findOne({ username: cleanUsername, _id: { $ne: targetUser._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Username is already taken.' });
      }
      targetUser.username = cleanUsername;
    }

    if (email && email.trim().toLowerCase() !== targetUser.email) {
      const cleanEmail = email.trim().toLowerCase();
      const existing = await User.findOne({ email: cleanEmail, _id: { $ne: targetUser._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already taken.' });
      }
      targetUser.email = cleanEmail;
    }

    if (role && ['superadmin', 'admin', 'staff'].includes(role)) {
      // If demoting from superadmin, ensure at least one other active superadmin remains
      if (targetUser.role === 'superadmin' && role !== 'superadmin') {
        const otherSuperCount = await User.countDocuments({
          role: 'superadmin',
          isActive: true,
          _id: { $ne: targetUser._id },
        });
        if (otherSuperCount === 0) {
          return res.status(400).json({
            success: false,
            message: 'Cannot demote the last remaining active Super Administrator.',
          });
        }
      }
      targetUser.role = role;
    }

    if (typeof isActive === 'boolean') {
      if (targetUser.role === 'superadmin' && !isActive) {
        const otherSuperCount = await User.countDocuments({
          role: 'superadmin',
          isActive: true,
          _id: { $ne: targetUser._id },
        });
        if (otherSuperCount === 0) {
          return res.status(400).json({
            success: false,
            message: 'Cannot deactivate the last remaining active Super Administrator.',
          });
        }
      }
      targetUser.isActive = isActive;
    }

    await targetUser.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: targetUser._id,
      details: { username: targetUser.username, role: targetUser.role, isActive: targetUser.isActive },
    });

    res.json({
      success: true,
      message: `User "${targetUser.username}" updated successfully.`,
      data: {
        _id: targetUser._id,
        id: targetUser._id,
        username: targetUser.username,
        email: targetUser.email,
        role: targetUser.role,
        isActive: targetUser.isActive,
        updatedAt: targetUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/password - Super Admin changes/resets password for an admin user
export const changeUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Administrator user not found.',
      });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    // Hash the new password
    const newHash = await User.hashPassword(newPassword.trim());
    targetUser.passwordHash = newHash;
    await targetUser.save();

    await logAuditEvent({
      req,
      action: 'ADMIN_CHANGED_PASSWORD',
      resource: 'User',
      resourceId: targetUser._id,
      details: {
        targetUser: targetUser.username,
        changedBy: req.user.username,
      },
    });

    res.json({
      success: true,
      message: `Password for "${targetUser.username}" was updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id - Delete admin user (Super Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent deleting self
    if (req.user._id.equals(targetUser._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    // Prevent deleting the last superadmin
    if (targetUser.role === 'superadmin') {
      const superCount = await User.countDocuments({ role: 'superadmin' });
      if (superCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only Super Administrator account.',
        });
      }
    }

    await User.findByIdAndDelete(targetUser._id);

    await logAuditEvent({
      req,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: targetUser._id,
      details: { username: targetUser.username, role: targetUser.role },
    });

    res.json({
      success: true,
      message: `User "${targetUser.username}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
