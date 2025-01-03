"use client";

import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

export async function getProducts(page = 1, limit = 9, filter?: 'all' | 'sale') {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Apply sale filter if needed
    if (filter === 'sale') {
      query = query.eq('isOnSale', true);
    }

    // Get total count first
    const { count } = await query;
    
    // If no results or page exceeds total pages, return empty
    if (!count || (page - 1) * limit >= count) {
      return {
        products: [],
        total: count || 0,
      };
    }

    // Get paginated results
    const { data, error } = await query
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return {
      products: data as Product[],
      total: count,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}