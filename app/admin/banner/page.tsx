"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BannerDialog } from "@/components/admin/banner-dialog";
import { useToast } from "@/components/ui/use-toast";
import { BannerContent } from "@/lib/types";
import { getBanner, updateBanner } from "@/lib/services/banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Edit, Loader2 } from "lucide-react";

export default function BannerPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentBanner, setCurrentBanner] = useState<BannerContent | null>(null);

  useEffect(() => {
    loadBanner();
  }, []);

  async function loadBanner() {
    try {
      const data = await getBanner();
      setCurrentBanner(data || {
        title: "",
        description: "",
        isActive: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banner",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateBanner = async (data: BannerContent) => {
    try {
      await updateBanner(data);
      setCurrentBanner(data);
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentBanner) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status</span>
            <Switch checked={currentBanner.isActive} disabled />
          </div>
          <div>
            <span className="font-medium">Title</span>
            <p className="mt-1 text-muted-foreground">{currentBanner.title}</p>
          </div>
          <div>
            <span className="font-medium">Description</span>
            <p className="mt-1 text-muted-foreground">
              {currentBanner.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <BannerDialog
        banner={currentBanner}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSubmit={handleUpdateBanner}
      />
    </div>
  );
}