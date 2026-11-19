import rateLimit from 'express-rate-limit';

// Standard rate limiter for public API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for enquiry submissions (Spam protection)
export const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many enquiry submissions from this IP. Please wait an hour before submitting again, or contact us directly via phone.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for review submissions
export const reviewLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 8,
  message: {
    success: false,
    message: 'Too many review attempts from this connection. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for login attempts (Brute force protection)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. For security, this account is temporarily paused. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
