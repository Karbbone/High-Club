// hooks/useBookings.ts
import { fetcher } from '@/services/fetcher';
import type { Booking } from '@/types/IBooking';
import { useQuery } from '@tanstack/react-query';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => fetcher<Booking[]>('/bookings'),
  });
}

export function useHello() {
  return useQuery({
    queryKey: [''],
    queryFn: () => fetcher<{
      hello: string;
    }>('/'),
  });
}