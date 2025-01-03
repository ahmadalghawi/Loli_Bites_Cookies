import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">About Sweet Bites</h1>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Sweet Bites was founded in 2020 with a simple mission: to create the most
              delicious, handcrafted cookies using only the finest ingredients.
            </p>
            <p className="text-lg text-muted-foreground">
              Our master bakers combine traditional recipes with innovative flavors,
              ensuring each cookie is baked to perfection. We source our ingredients
              from local suppliers whenever possible, supporting our community while
              maintaining the highest quality standards.
            </p>
            <p className="text-lg text-muted-foreground">
              Every cookie is made fresh daily in our kitchen, using time-honored
              techniques passed down through generations of bakers. We never use
              preservatives or artificial ingredients, ensuring you get the authentic
              taste of home-baked goodness in every bite.
            </p>
          </div>
        </div>
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1559598467-f8b76c8155d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Our Bakery"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Quality</h3>
            <p className="text-muted-foreground">
              We use only the finest ingredients and never compromise on quality.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Tradition</h3>
            <p className="text-muted-foreground">
              Our recipes are crafted with care, combining classic techniques with modern innovation.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Community</h3>
            <p className="text-muted-foreground">
              We're proud to be part of our local community and support local suppliers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}