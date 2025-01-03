"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { bannerContent } from "@/lib/data";

export function SalesBanner() {
  if (!bannerContent.isActive) return null;

  return (
    <div className="bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between text-primary-foreground">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">{bannerContent.title}</h2>
            <p className="text-lg opacity-90">{bannerContent.description}</p>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/?show=sale">Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}