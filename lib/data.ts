import { BannerContent, Product } from "./types";

export const defaultBanner: BannerContent = {
  title: "Black Friday Sale! 🎉",
  description: "Get amazing discounts on selected cookies - Limited Time Only!",
  isActive: true,
};

export let bannerContent: BannerContent = { ...defaultBanner };

export function updateBanner(newContent: BannerContent) {
  bannerContent = newContent;
}

export const cookies: Product[] = [
  {
    id: "1",
    name: "Classic Chocolate Chip",
    description: "Soft and chewy cookies loaded with premium chocolate chips",
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    ingredients: [
      "Premium chocolate chips",
      "Unbleached flour",
      "Brown sugar",
      "Butter",
      "Free-range eggs",
      "Pure vanilla extract",
      "Baking soda",
      "Sea salt"
    ],
    nutritionFacts: {
      servingSize: "1 cookie (30g)",
      calories: "140",
      totalFat: "7g",
      saturatedFat: "4g",
      cholesterol: "20mg",
      sodium: "110mg",
      totalCarbohydrates: "19g",
      dietaryFiber: "1g",
      sugars: "12g",
      protein: "2g"
    },
    isOnSale: true,
    discountPercentage: 20
  },
  {
    id: "2",
    name: "Double Chocolate",
    description: "Rich chocolate cookies with dark chocolate chunks",
    price: 3.49,
    imageUrl: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a",
    ingredients: [
      "Dark chocolate chunks",
      "Cocoa powder",
      "Unbleached flour",
      "Brown sugar",
      "Butter",
      "Free-range eggs",
      "Pure vanilla extract",
      "Baking soda",
      "Sea salt"
    ],
    nutritionFacts: {
      servingSize: "1 cookie (35g)",
      calories: "160",
      totalFat: "8g",
      saturatedFat: "5g",
      cholesterol: "20mg",
      sodium: "115mg",
      totalCarbohydrates: "21g",
      dietaryFiber: "2g",
      sugars: "14g",
      protein: "2g"
    },
    isOnSale: false,
    discountPercentage: 0
  },
  {
    id: "3",
    name: "Oatmeal Raisin",
    description: "Hearty oatmeal cookies with plump raisins",
    price: 2.79,
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e",
    ingredients: [
      "Rolled oats",
      "Plump raisins",
      "Unbleached flour",
      "Brown sugar",
      "Butter",
      "Free-range eggs",
      "Pure vanilla extract",
      "Cinnamon",
      "Baking soda",
      "Sea salt"
    ],
    nutritionFacts: {
      servingSize: "1 cookie (30g)",
      calories: "130",
      totalFat: "5g",
      saturatedFat: "3g",
      cholesterol: "15mg",
      sodium: "95mg",
      totalCarbohydrates: "20g",
      dietaryFiber: "1g",
      sugars: "10g",
      protein: "2g"
    },
    isOnSale: true,
    discountPercentage: 15
  }
];