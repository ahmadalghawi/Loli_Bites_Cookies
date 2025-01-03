import { STORAGE_CONFIG, STORAGE_ERRORS } from '../config/storage';

export async function validateImage(file: File): Promise<void> {
  // Check file size
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    throw new Error(STORAGE_ERRORS.FILE_TOO_LARGE);
  }

  // Check file type
  if (!STORAGE_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(STORAGE_ERRORS.INVALID_TYPE);
  }

  // Check image dimensions
  const dimensions = await getImageDimensions(file);
  if (dimensions.width > STORAGE_CONFIG.MAX_DIMENSION || 
      dimensions.height > STORAGE_CONFIG.MAX_DIMENSION) {
    throw new Error(STORAGE_ERRORS.DIMENSION_TOO_LARGE);
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
}

export function generateFileName(file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}