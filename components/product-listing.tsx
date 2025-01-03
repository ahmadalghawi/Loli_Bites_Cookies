"use client";

import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface ProductListingProps {
  products: Product[];
}

export function ProductListing({ products }: ProductListingProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (searchParams.get("show") === "sale") {
      setActiveTab("sale");
    }
  }, [searchParams]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
        <TabsTrigger value="all">All Cookies</TabsTrigger>
        <TabsTrigger value="sale">On Sale</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((cookie) => (
            <ProductCard key={cookie.id} product={cookie} />
          ))}
        </section>
      </TabsContent>
      <TabsContent value="sale">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.filter(cookie => cookie.isOnSale).map((cookie) => (
            <ProductCard key={cookie.id} product={cookie} />
          ))}
        </section>
      </TabsContent>
    </Tabs>
  );
}