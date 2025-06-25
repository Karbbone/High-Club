// hooks/useBookings.ts
import { fetcher } from '@/services/fetcher';
import type { Event } from '@/types/IEvent';
import { useQuery } from '@tanstack/react-query';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetcher<{success: string, data: Event[]}>('/events'),
  });
}