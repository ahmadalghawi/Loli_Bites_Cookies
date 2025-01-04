"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "./product-grid";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProductTabs() {
  const searchParams = useSearchParams();
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (searchParams.get("show") === "sale") {
      setActiveTab("sale");
    }
  }, [searchParams]);

  // const handleTabChange = (value: string) => {
  //   setActiveTab(value);
  //   if (value === "sale") {
  //      // Update URL without refreshing or scrolling
  //   } else {
  //     ; // Update URL without refreshing or scrolling
  //   }
  // };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto mb-8 border-1 border-[#904731ad]">
        <TabsTrigger value="all" >All Cookies</TabsTrigger>
        <TabsTrigger value="sale">On Sale</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ProductGrid filter="all" />
      </TabsContent>
      
      <TabsContent value="sale">
        <ProductGrid filter="sale" />
      </TabsContent>
    </Tabs>
  );
}