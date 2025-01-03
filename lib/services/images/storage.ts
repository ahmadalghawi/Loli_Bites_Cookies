import { supabase } from '@/lib/supabase';
import { ImageMetadata } from './types';

export async function saveImageMetadata(metadata: ImageMetadata) {
  const { error } = await supabase
    .from('product_images')
    .insert([metadata]);

  if (error) throw error;
}

export async function getImageMetadata(url: string): Promise<ImageMetadata | null> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('url', url)
    .single();

  if (error) return null;
  return data;
}