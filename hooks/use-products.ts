"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Fetching products... from useProducts");
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function addProduct(productData: Partial<Product>) {
    try {
      // Remove any undefined or null values
      const cleanedData = Object.fromEntries(
        Object.entries(productData).filter(([_, v]) => v != null)
      );

      const { data, error } = await supabase
        .from("products")
        .insert([cleanedData])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async function updateProduct(product: Product) {
    try {
      const { id, created_at, updated_at, ...updateData } = product;
      
      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async function deleteProducts(ids: string[]) {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", ids);

      if (error) throw error;
      setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    } catch (error) {
      console.error("Error deleting products:", error);
      throw error;
    }
  }

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProducts,
  };
}