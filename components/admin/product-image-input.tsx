"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from './image-upload';
import { ImageLinkInput } from './image-link-input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductImageInputProps {
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
}

export function ProductImageInput({ value, onChange, onError }: ProductImageInputProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <ImageUpload 
            value={value} 
            onChange={onChange}
            onError={onError}
          />
        </TabsContent>
        
        <TabsContent value="url">
          <ImageLinkInput 
            value={value}
            onChange={(url) => onChange(url)}
          />
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertDescription>
          You can either upload an image directly or provide an image URL. 
          Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP.
        </AlertDescription>
      </Alert>
    </div>
  );
}