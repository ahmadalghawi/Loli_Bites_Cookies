import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>
      
      <div className="relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[600px] text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Handcrafted Cookies
              <br />
              Baked with Love
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Experience the perfect blend of premium ingredients and traditional recipes
              in every bite of our artisanal cookies.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="#collection">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}