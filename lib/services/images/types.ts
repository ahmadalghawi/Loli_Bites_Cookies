export interface ImageMetadata {
  url: string;
  width?: number;
  height?: number;
  format?: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageValidationResult {
  isValid: boolean;
  metadata?: ImageMetadata;
  error?: string;
}