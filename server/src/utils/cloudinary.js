import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to cwd

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'vqifqntv',
  api_key: process.env.CLOUDINARY_API_KEY || '815783325292386',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'vMzIIqvXJQ8zi9x0HPXmCdgfXy4',
  secure: true,
});

/**
 * Check if Cloudinary credentials are fully provided
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL
  );
};

/**
 * Upload a local file to Cloudinary
 * @param {string} filePath - Path to local file
 * @param {object} options - Optional cloudinary upload parameters
 * @returns {Promise<object>} Upload result with secure_url, public_id, etc.
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: options.folder || 'sln_waterproofing',
        resource_type: options.resource_type || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};

/**
 * Delete a resource from Cloudinary by public ID
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.warn(`[Cloudinary] Failed to delete ${publicId}:`, error.message);
    return null;
  }
};

/**
 * Universal upload handler that uploads to Cloudinary when configured,
 * and seamlessly falls back to the local /uploads path if offline or anything fails.
 */
export const handleUploadToCloudinaryOrLocal = async (file, folder = 'sln_waterproofing') => {
  if (!file) return null;
  const localUrl = `/uploads/${file.filename}`;

  if (!isCloudinaryConfigured()) {
    return localUrl;
  }

  try {
    const isVideo = file.mimetype?.startsWith('video');
    const result = await uploadToCloudinary(file.path, {
      folder,
      resource_type: isVideo ? 'video' : 'auto',
    });
    if (result?.secure_url) {
      return result.secure_url;
    }
  } catch (err) {
    console.warn(`[Cloudinary] Upload to cloud failed for ${file.originalname}, falling back to local:`, err.message);
  }

  return localUrl;
};

export default cloudinary;
