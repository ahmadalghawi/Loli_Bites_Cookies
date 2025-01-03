// Storage configuration and constants
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'product-images',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['.jpg', '.jpeg', '.png', '.webp'],
  MAX_DIMENSION: 2048, // Max width/height in pixels
  MIME_TYPES: {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  }
};

export const STORAGE_ERRORS = {
  FILE_TOO_LARGE: 'File size exceeds 5MB limit',
  INVALID_TYPE: 'Invalid file type. Only JPEG, PNG and WebP images are allowed',
  UPLOAD_FAILED: 'Failed to upload image',
  DIMENSION_TOO_LARGE: 'Image dimensions exceed maximum allowed size',
  BUCKET_NOT_FOUND: 'Storage bucket not found. Please ensure the bucket is properly configured.',
};