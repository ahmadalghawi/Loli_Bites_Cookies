import { supabase } from '@/lib/supabase';
import { STORAGE_CONFIG, STORAGE_ERRORS } from '../config/storage';
import { validateImage, generateFileName } from '../utils/image';

export interface UploadProgress {
  progress: number;
}

export async function uploadProductImage(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    // Validate image before upload
    await validateImage(file);

    // Generate unique file name
    const fileName = generateFileName(file);
    const filePath = `products/${fileName}`;

    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_CONFIG.BUCKET_NAME);
    
    if (!bucketExists) {
      throw new Error(STORAGE_ERRORS.BUCKET_NOT_FOUND);
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteProductImage(url: string): Promise<void> {
  try {
    // Extract file path from URL
    const path = url.split('/').slice(-2).join('/');
    
    const { error } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}