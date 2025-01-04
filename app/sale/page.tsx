"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getProducts } from "@/lib/services/products";
import { ProductCard } from "@/components/products/product-card";
import { Loader2 } from "lucide-react";

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaleProducts() {
      try {
        const { products } = await getProducts(1, 100, 'sale');
        setProducts(products);
      } catch (error) {
        console.error('Error loading sale products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSaleProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Special Offers</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No items currently on sale. Check back soon!
        </p>
      )}
    </div>
  );
}