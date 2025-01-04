import { User as SupabaseUser } from "@supabase/supabase-js";

export interface AppUser extends SupabaseUser {
  name?: string;
  phoneNumber?: string;
  postCode?: string;
  creditCard?: string;
  city?: string;
  address?: string;
  role?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
  nutritionFacts: {
    servingSize: string;
    calories: string;
    totalFat: string;
    saturatedFat: string;
    cholesterol: string;
    sodium: string;
    totalCarbohydrates: string;
    dietaryFiber: string;
    sugars: string;
    protein: string;
  };
  isOnSale: boolean;
  discountPercentage?: number;
  category: string;
  stockLevel: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  image_bucket_id?: string;
}

export interface ProductFormData extends Omit<Product, 'id' | 'created_at' | 'updated_at' | 'image_bucket_id'> {}