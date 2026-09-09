import { api } from './api';

export interface ProductItem {
  _id?: string;
  name: string;
  price: number;
}

export interface CreateProductResponse {
  message: string;
  data: ProductItem;
}

export interface GetProductsResponse {
  message: string;
  data: ProductItem[];
}

export const productService = {
  async createProduct(name: string, price: number): Promise<ProductItem> {
    const res = await api.post<CreateProductResponse>('/api/product/post', {
      name,
      price,
    });
    return res.data;
  },

  async getProducts(): Promise<ProductItem[]> {
    try {
      const res = await api.get<GetProductsResponse>('/api/product/get');
      return res.data || [];
    } catch (e) {
      console.warn('Failed to fetch products from /api/product/get:', e);
      return [];
    }
  },
};
