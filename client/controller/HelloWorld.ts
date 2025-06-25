// hooks/useBookings.ts
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/services/fetcher';

export function useHello() {
  return useQuery({
    queryKey: [''],
    queryFn: () => fetcher<{
      hello: string;
    }>('/'),
  });
}