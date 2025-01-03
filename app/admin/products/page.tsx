"use client";

import { useState } from "react";
import { ProductTable } from "@/components/admin/product-table";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/admin/product-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { useProducts } from "@/hooks/use-products";

export default function ProductsPage() {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProducts } = useProducts();

  const handleAddProduct = async (data: Partial<Product>) => {
    try {
      await addProduct(data);
      setIsAddingProduct(false);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (data: Product) => {
    try {
      await updateProduct(data);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProducts = async (ids: string[]) => {
    try {
      await deleteProducts(ids);
      toast({
        title: "Success",
        description: `${ids.length} product(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete products",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsAddingProduct(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductTable
        products={products}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProducts}
      />

      <ProductDialog
        product={null}
        open={isAddingProduct}
        onOpenChange={setIsAddingProduct}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}