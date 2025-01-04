import { Hero } from "@/components/hero";
import { SalesBanner } from "@/components/sales-banner";
import { ProductTabs } from "@/components/products/product-tabs";
import { CookieMenu } from "@/components/cookie-menu";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <Hero />
      <SalesBanner />
      
      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Cookie Collection</h2>
          <p className="text-lg text-muted-foreground">
            Discover our handcrafted cookies made with love and premium ingredients
          </p>
        </section>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductTabs />
        </Suspense>
        <CookieMenu />
      </div>
    </div>
  );
}