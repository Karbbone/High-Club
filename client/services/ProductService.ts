import { fetcher } from '@/services/fetcher';
import type { Product } from '@/types/IProduct';
import { useQuery } from '@tanstack/react-query';

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetcher<ProductsResponse>('/products');
      return response.data; // Retourner seulement le tableau de produits
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await fetcher<{ success: boolean; data: Product }>(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
} 