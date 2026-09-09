import { api } from './api';
import { BoundingBox, ExtractedDeclaration } from '../types';

export interface OcrResponse {
  success: boolean;
  confidence: number;
  fieldConfidences?: Record<string, number>;
  extractedData: {
    productName?: string;
    brand?: string;
    manufacturer?: string;
    batchNo?: string;
    mrp?: string;
    netQuantity?: string;
    manufacturingDate?: string;
    expiryDate?: string;
    countryOfOrigin?: string;
    ingredients?: string;
    customerCare?: string;
    licenseNumber?: string;
  };
  declarations: ExtractedDeclaration[];
  boundingBoxes: BoundingBox[];
  rawText: string;
}

export const ocrService = {
  async runOcr(imageFile: File | Blob): Promise<OcrResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.uploadMultipart<OcrResponse>('/ocr', formData);
  },
};
