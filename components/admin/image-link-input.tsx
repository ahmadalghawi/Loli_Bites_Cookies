"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateImageUrl } from '@/lib/services/images/validation';
import { ImageMetadata } from '@/lib/services/images/types';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';

interface ImageLinkInputProps {
  value: string;
  onChange: (url: string, metadata?: ImageMetadata) => void;
}

export function ImageLinkInput({ value, onChange }: ImageLinkInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string>();

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      setError(undefined);

      const result = await validateImageUrl(inputValue);
      if (!result.isValid) {
        setError(result.error);
        return;
      }

      onChange(inputValue, result.metadata);
    } catch (error) {
      setError('Failed to validate image URL');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button 
          onClick={handleValidate}
          disabled={isValidating || !inputValue}
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Validate'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value && (
        <div className="relative w-40 h-40">
          <Image
            src={value}
            alt="Preview"
            fill
            className="rounded-lg object-cover"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2"
            onClick={() => onChange('', undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Alert>
        <AlertDescription>
          Note: This is a temporary solution for handling images. Please provide a direct URL to your image.
          Supported formats: JPG, PNG, GIF, WebP.
        </AlertDescription>
      </Alert>
    </div>
  );
}