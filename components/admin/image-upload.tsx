"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { uploadProductImage } from '@/lib/services/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { STORAGE_CONFIG, STORAGE_ERRORS } from '@/lib/config/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        
        const file = acceptedFiles[0];
        const imageUrl = await uploadProductImage(file, ({ progress }) => {
          setUploadProgress(progress);
        });
        
        onChange(imageUrl);
      } catch (error) {
        console.error('Upload failed:', error);
        onError?.(error instanceof Error ? error.message : STORAGE_ERRORS.UPLOAD_FAILED);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': STORAGE_CONFIG.ALLOWED_FILE_TYPES,
    },
    maxFiles: 1,
    maxSize: STORAGE_CONFIG.MAX_FILE_SIZE,
  });

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors',
          isDragActive
            ? 'border-primary/50 bg-primary/5'
            : 'border-muted-foreground/25'
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="relative h-40 w-40">
            <Image
              src={value}
              alt="Product image"
              fill
              className="rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
            <Upload className="mb-2 h-4 w-4" />
            <span className="text-center">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image here, or click to select'}
            </span>
            <span className="mt-2 text-xs text-muted-foreground">
              Max file size: {STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80">
            <Progress value={uploadProgress} className="w-1/2 mb-2" />
            <span className="text-sm">{Math.round(uploadProgress)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}