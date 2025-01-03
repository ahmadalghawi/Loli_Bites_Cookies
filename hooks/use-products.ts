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

  async function addProduct(product: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([{
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setProducts([data, ...products]);
      return data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async function updateProduct(product: Product) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          ...product,
          updated_at: new Date().toISOString()
        })
        .eq("id", product.id)
        .select()
        .single();

      if (error) throw error;
      setProducts(products.map((p) => (p.id === product.id ? data : p)));
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
      setProducts(products.filter((p) => !ids.includes(p.id)));
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