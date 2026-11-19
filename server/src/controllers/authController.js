import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'sln_engineers_secure_jwt_secret_key_2026_three_generations',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Auto-seed default Super Admin and Admin accounts if they do not exist
export const ensureDefaultUsers = async () => {
  try {
    const defaultPasswordHash = await User.hashPassword('Admin@12345');

    // 1. Super Admin (Full complete access to all modules)
    let superAdmin = await User.findOne({ username: 'superadmin' });
    if (!superAdmin) {
      const emailTaken = await User.findOne({ email: 'superadmin@slnengineers.com' });
      if (emailTaken) {
        emailTaken.username = 'superadmin';
        emailTaken.role = 'superadmin';
        if (!emailTaken.passwordHash) emailTaken.passwordHash = defaultPasswordHash;
        emailTaken.isActive = true;
        await emailTaken.save();
      } else {
        await User.create({
          username: 'superadmin',
          email: 'superadmin@slnengineers.com',
          passwordHash: defaultPasswordHash,
          role: 'superadmin',
          isActive: true,
        });
      }
      console.log('✅ [Auth] Super Admin user created (superadmin / Admin@12345)');
    }

    // 2. Also ensure slnsuperadmin exists as superadmin
    let slnSuperAdmin = await User.findOne({ username: 'slnsuperadmin' });
    if (!slnSuperAdmin) {
      await User.create({
        username: 'slnsuperadmin',
        email: 'slnsuperadmin@slnengineers.com',
        passwordHash: defaultPasswordHash,
        role: 'superadmin',
        isActive: true,
      }).catch(() => null);
    }

    // 3. Admin (Dashboard and Enquiry pipeline ONLY)
    let adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const emailTaken = await User.findOne({ email: 'admin@slnengineers.com' });
      if (emailTaken) {
        emailTaken.username = 'admin';
        emailTaken.role = 'admin';
        if (!emailTaken.passwordHash) emailTaken.passwordHash = defaultPasswordHash;
        emailTaken.isActive = true;
        await emailTaken.save();
      } else {
        await User.create({
          username: 'admin',
          email: 'admin@slnengineers.com',
          passwordHash: defaultPasswordHash,
          role: 'admin',
          isActive: true,
        });
      }
      console.log('✅ [Auth] Admin user created (admin / Admin@12345) — Dashboard & Enquiries only');
    }

    // 4. Also ensure slnadmin has role: 'admin'
    let slnAdmin = await User.findOne({ username: 'slnadmin' });
    if (!slnAdmin) {
      await User.create({
        username: 'slnadmin',
        email: 'slnadmin@slnengineers.com',
        passwordHash: defaultPasswordHash,
        role: 'admin',
        isActive: true,
      }).catch(() => null);
    }
  } catch (err) {
    console.warn('[Auth] ensureDefaultUsers error:', err.message);
  }
};

// POST /api/admin/auth/login
export const adminLogin = async (req, res, next) => {
  try {
    await ensureDefaultUsers();
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username/email and password.',
      });
    }

    const cleanId = identifier.toLowerCase().trim();

    let user = await User.findOne({
      $or: [{ email: cleanId }, { username: cleanId }],
    });

    // Fallback: match by role/alias for convenience
    if (!user && (cleanId === 'admin' || cleanId === 'slnadmin')) {
      user = await User.findOne({
        $or: [{ username: 'admin' }, { username: 'slnadmin' }, { role: 'admin' }],
      });
    }

    if (!user && (cleanId === 'superadmin' || cleanId === 'slnsuperadmin')) {
      user = await User.findOne({
        $or: [{ username: 'superadmin' }, { username: 'slnsuperadmin' }, { role: 'superadmin' }],
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your administrator account has been deactivated.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    // Set secure HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user;
    await logAuditEvent({
      req,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      details: { role: user.role, username: user.username },
    });

    res.json({
      success: true,
      message: 'Login successful. Welcome to SLN Management Portal.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/auth/logout
export const adminLogout = async (req, res, next) => {
  try {
    if (req.user) {
      await logAuditEvent({
        req,
        action: 'LOGOUT',
        resource: 'User',
        resourceId: req.user._id,
        details: { username: req.user.username },
      });
    }

    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/auth/me
export const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
