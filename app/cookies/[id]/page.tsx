"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function CookieDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .eq("status", "active")
          .single();

        if (error || !data) {
          notFound();
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = product.isOnSale && product.discountPercentage 
    ? product.price - (product.price * product.discountPercentage / 100)
    : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cookies
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          {product.isOnSale && product.discountPercentage && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-500">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-lg object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold">
              {formatPrice(discountedPrice)}
            </span>
            {product.isOnSale && product.discountPercentage && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <p className="text-muted-foreground capitalize">{product.category}</p>
            </div>

            {product.stockLevel > 0 ? (
              <p className="text-sm text-green-600">
                In Stock ({product.stockLevel} available)
              </p>
            ) : (
              <p className="text-sm text-red-600">Out of Stock</p>
            )}

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}