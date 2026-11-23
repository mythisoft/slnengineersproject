import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to cwd

// Configure Cloudinary only with environment variables. Never hardcode credentials.
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
  try {
    const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      cloudinary.config({
        cloud_name: match[3],
        api_key: match[1],
        api_secret: match[2],
        secure: true,
      });
    }
  } catch {
    // Configuration validation is handled by isCloudinaryConfigured().
  }
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Check if Cloudinary credentials are fully provided
 */
export const isCloudinaryConfigured = () => {
  if (process.env.CLOUDINARY_URL) {
    return /^cloudinary:\/\/[^:]+:[^@]+@.+$/.test(process.env.CLOUDINARY_URL);
  }

  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - In-memory file contents
 * @param {object} options - Optional cloudinary upload parameters
 * @returns {Promise<object>} Upload result with secure_url, public_id, etc.
 */
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
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
    uploadStream.end(fileBuffer);
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
 * Upload directly from memory to Cloudinary without writing files to disk.
 */
export const uploadFileToCloudinary = async (file, folder = 'sln_waterproofing') => {
  if (!file?.buffer) throw new Error('No file buffer provided for upload');
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    const isVideo = file.mimetype?.startsWith('video');
    const result = await uploadToCloudinary(file.buffer, {
      folder,
      resource_type: isVideo ? 'video' : 'auto',
    });
    if (result?.secure_url) {
      return result.secure_url;
    }
    throw new Error('Cloudinary did not return a secure URL');
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
};

export default cloudinary;
