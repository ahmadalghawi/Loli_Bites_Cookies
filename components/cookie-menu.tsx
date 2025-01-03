"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CookieType {
  name: string;
  image: string;
  sizes: {
    mini?: {
      pieces: number[];
      prices: number[];
    };
    original?: {
      pieces: number[];
      prices: number[];
    };
  };
}

const cookieTypes: CookieType[] = [
  {
    name: "Classic Cookies",
    image: "/images/classic-cookie.png",
    sizes: {
      mini: {
        pieces: [7, 15, 24],
        prices: [3, 6, 10],
      },
      original: {
        pieces: [1, 5, 12],
        prices: [1, 4.50, 10],
      },
    },
  },
  {
    name: "Chocolate Cookies",
    image: "/images/chocolate-cookie.png",
    sizes: {
      mini: {
        pieces: [7, 15, 24],
        prices: [3, 6, 10],
      },
      original: {
        pieces: [1, 5, 12],
        prices: [1, 4.50, 10],
      },
    },
  },
  {
    name: "Red Velvet Cookies",
    image: "/images/red-velvet-cookie.png",
    sizes: {
      mini: {
        pieces: [7, 15, 24],
        prices: [3, 6, 10],
      },
      original: {
        pieces: [1, 5, 12],
        prices: [1, 4.50, 10],
      },
    },
  },
  {
    name: "Pistachio Cookies",
    image: "/images/pistachio-cookie.png",
    sizes: {
      mini: {
        pieces: [7, 15, 24],
        prices: [3, 6, 10],
      },
      original: {
        pieces: [1, 5, 12],
        prices: [1, 4.50, 10],
      },
    },
  },
  {
    name: "Cookies Cardamon and Rose Water",
    image: "/images/cardamon-cookie.png",
    sizes: {
      mini: {
        pieces: [7, 15, 24],
        prices: [3, 6, 10],
      },
      original: {
        pieces: [1, 5, 12],
        prices: [1, 4.50, 10],
      },
    },
  },
  {
    name: "Cookies Walnuts and Cinnamon",
    image: "/images/walnut-cookie.png",
    sizes: {
      mini: {
        pieces: [7, 15, 24],
        prices: [3, 6, 10],
      },
      original: {
        pieces: [1, 5, 12],
        prices: [1, 4.50, 10],
      },
    },
  },
];

export function CookieMenu() {
  return (
    <section className="py-16 bg-[#FDF6F0]">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl text-[#B5915F] text-center font-dancing mb-16"
        >
          menu
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cookieTypes.map((cookie, index) => (
            <motion.div
              key={cookie.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src={cookie.image}
                  alt={cookie.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-[#B5915F] text-xl font-semibold mb-4">
                {cookie.name}
              </h3>
              <div className="flex justify-around text-[#8B4513]">
                <div>
                  <p className="font-semibold mb-2">Mini (25g)</p>
                  {cookie.sizes.mini?.pieces.map((piece, idx) => (
                    <p key={idx} className="text-sm">
                      {piece}pc ➜ {cookie.sizes.mini?.prices[idx]}jd
                    </p>
                  ))}
                </div>
                <div>
                  <p className="font-semibold mb-2">Original (50g)</p>
                  {cookie.sizes.original?.pieces.map((piece, idx) => (
                    <p key={idx} className="text-sm">
                      {piece}pc ➜ {cookie.sizes.original?.prices[idx]}jd
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}