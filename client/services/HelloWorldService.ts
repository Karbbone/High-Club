// hooks/useBookings.ts
import { fetcher } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export function useHello() {
  return useQuery({
    queryKey: [''],
    queryFn: () => fetcher<{
      hello: string;
    }>('/'),
  });
}