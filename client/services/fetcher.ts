// client/services/fetcher.ts
import { api } from '@/services/api';

export const fetcher = async <T>(endpoint: string): Promise<T> => {
  const response = await api.get<T>(endpoint);
  return response.data;
};