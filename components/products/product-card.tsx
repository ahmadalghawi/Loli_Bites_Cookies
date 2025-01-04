"use client";

import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/components/add-to-cart-button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    description,
    price,
    imageUrl,
    isOnSale,
    discountPercentage,
  } = product;

  const discountedPrice = isOnSale && discountPercentage 
    ? price - (price * discountPercentage / 100)
    : price;

  return (
    <Card className="group overflow-hidden">
      <Link href={`/cookies/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          {isOnSale && discountPercentage && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-500">
              {discountPercentage}% OFF
            </Badge>
          )}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/cookies/${id}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:underline">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {formatPrice(discountedPrice)}
          </span>
          {isOnSale && discountPercentage && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 ">
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}