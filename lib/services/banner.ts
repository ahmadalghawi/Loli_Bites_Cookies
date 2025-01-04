"use client";

import { supabase } from '@/lib/supabase';
import { BannerContent } from '@/lib/types';

export async function getBanner(): Promise<BannerContent | null> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error fetching banner:', error);
    return null;
  }
}

export async function updateBanner(banner: BannerContent): Promise<void> {
  try {
    // First get the banner ID if not provided
    if (!banner.id) {
      const { data, error } = await supabase
        .from('banners')
        .select('id')
        .single();
      
      if (error) throw error;
      banner.id = data.id;
    }

    const { error } = await supabase
      .from('banners')
      .update({
        title: banner.title,
        description: banner.description,
        is_active: banner.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', banner.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
}