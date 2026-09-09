import { api } from './api';

export interface EvidenceRecord {
  _id: string;
  title: string;
  product: string;
  uri1: string;
  uri2?: string;
  uri3?: string;
  uri4?: string;
  uri5?: string;
  uri6?: string;
  createdAt?: string;
}

export interface GetAllImagesResponse {
  message: string;
  images: EvidenceRecord[];
}

export const evidenceService = {
  async getAllEvidence(): Promise<EvidenceRecord[]> {
    try {
      const res = await api.get<GetAllImagesResponse>('/api/image/all');
      return res.images || [];
    } catch {
      return [];
    }
  },

  async uploadEvidence(files: File[], productId?: string, title?: string): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    if (productId) formData.append('product', productId);
    if (title) formData.append('title', title);
    return api.uploadMultipart('/api/image/upload', formData);
  },
};
