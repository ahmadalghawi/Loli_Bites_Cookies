"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import Link from "next/link";
import { Info } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
}

export function ProductCard({ product, isAdmin = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          {product.isOnSale && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-500">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <p className="mt-2 font-bold">
          ${product.price.toFixed(2)}
          {product.isOnSale && (
            <span className="ml-2 text-sm text-red-500 font-normal">
              Save {product.discountPercentage}%
            </span>
          )}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {isAdmin ? (
          <Button 
            variant="destructive"
            className="w-full"
          >
            Remove
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link href={`/cookies/${product.id}`}>
                <Info className="mr-2 h-4 w-4" />
                More Info
              </Link>
            </Button>
            <AddToCartButton product={product} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}