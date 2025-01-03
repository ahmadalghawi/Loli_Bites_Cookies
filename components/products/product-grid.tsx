"use client";

import { useState, useCallback } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { getProducts } from '@/lib/services/products';

interface ProductGridProps {
  filter?: 'all' | 'sale';
}

export function ProductGrid({ filter = 'all' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView();

  const loadProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { products: newProducts, total } = await getProducts(page, 9, filter);
      
      setProducts(prev => {
        const combined = [...prev, ...newProducts];
        // Remove duplicates based on ID
        return Array.from(new Map(combined.map(item => [item.id, item])).values());
      });
      
      setHasMore(products.length + newProducts.length < total);
      if (newProducts.length > 0) {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter, page, loading, hasMore]);

  // Reset when filter changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [filter]);

  // Initial load
  useEffect(() => {
    if (page === 1) {
      loadProducts();
    }
  }, [loadProducts, page]);

  // Load more when scrolling
  useEffect(() => {
    if (inView) {
      loadProducts();
    }
  }, [inView, loadProducts]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={() => {
            setError(null);
            setPage(1);
            loadProducts();
          }}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {filter === 'sale' ? 'No products on sale' : 'No products available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="flex justify-center p-4">
        {loading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more products...
          </Button>
        )}
      </div>
    </div>
  );
}