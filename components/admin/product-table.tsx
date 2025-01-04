"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { MoreHorizontal, Download } from "lucide-react";
import { ProductDialog } from "./product-dialog";

interface ProductTableProps {
  products: Product[];
  onUpdate: (product: Product) => Promise<void>;
  onDelete: (ids: string[]) => Promise<void>;
}

export function ProductTable({ products, onUpdate, onDelete }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key && (a[sortConfig.key] ?? '') < (b[sortConfig.key] ?? '')) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if ((a[sortConfig.key] ?? '') > (b[sortConfig.key] ?? '')) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = useCallback((key: keyof Product) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds((current) => 
      current.length === sortedProducts.length ? [] : sortedProducts.map((p) => p.id)
    );
  }, [sortedProducts]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((current) => 
      current.includes(id) 
        ? current.filter((i) => i !== id)
        : [...current, id]
    );
  }, []);

  const exportToCsv = useCallback(() => {
    const headers = [
      "ID",
      "Name",
      "Description",
      "Price",
      "Category",
      "Stock Level",
      "Status",
      "Created Date",
      "Last Modified",
    ];

    const csvData = sortedProducts.map((product) => [
      product.id,
      product.name,
      product.description,
      product.price,
      product.category,
      product.stockLevel,
      product.status,
      formatDate(product.created_at),
      formatDate(product.updated_at),
    ]);

    const csv = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.csv";
    link.click();
  }, [sortedProducts]);

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search products..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={exportToCsv}
            disabled={sortedProducts.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => onDelete(selectedIds)}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === sortedProducts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("stockLevel")}
              >
                Stock
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Created
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("updated_at")}
              >
                Modified
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => handleSelect(product.id)}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <div className="relative h-10 w-10">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stockLevel}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(product.created_at)}</TableCell>
                <TableCell>{formatDate(product.updated_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {setEditingProduct(product),document.body.style.pointerEvents = 'none';}}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete([product.id])}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Dialog */}
      <ProductDialog
        product={editingProduct}
        open={editingProduct ? true : false}
        onOpenChange={(open) => {!open && setEditingProduct(null),document.body.style.pointerEvents = 'auto';}}
        onSubmit={async (data) => {
          if (editingProduct) {
            await onUpdate({ ...editingProduct, ...data });
            setEditingProduct(null);
          }
        }}
      />
    </div>
  );
}