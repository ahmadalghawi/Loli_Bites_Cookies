import { ImageValidationResult, ImageMetadata } from './types';

const VALID_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

export async function validateImageUrl(url: string): Promise<ImageValidationResult> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      return { isValid: false, error: 'Invalid image URL' };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return { isValid: false, error: 'URL does not point to an image' };
    }

    const format = contentType.split('/')[1];
    if (!VALID_FORMATS.includes(format)) {
      return { isValid: false, error: 'Unsupported image format' };
    }

    // Get image dimensions
    const metadata: ImageMetadata = {
      url,
      format,
      sourceUrl: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Load image to get dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    metadata.width = img.naturalWidth;
    metadata.height = img.naturalHeight;

    return { isValid: true, metadata };
  } catch (error) {
    return { isValid: false, error: 'Failed to validate image URL' };
  }
}