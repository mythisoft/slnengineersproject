import multer from 'multer';

// File filter (images, GIFs, and videos only, strict validation)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  const ext = (file.originalname || '').toLowerCase();
  const isAllowedExt = /\.(jpe?g|png|webp|gif|gifv|svg|mp4|webm|mov)$/i.test(ext);

  if (allowedMimeTypes.includes(file.mimetype) || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only JPG, PNG, WEBP, GIF, SVG, and MP4/WEBM files are permitted.'), false);
  }
};

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const ext = (file.originalname || '').toLowerCase();
  const isAllowedExt = /\.(jpe?g|png|webp|gif|gifv|svg)$/i.test(ext);

  if (allowedMimeTypes.includes(file.mimetype) || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only JPG, PNG, WEBP, GIF, and SVG images are permitted.'), false);
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max file size for videos & media
  },
  fileFilter,
});

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});
