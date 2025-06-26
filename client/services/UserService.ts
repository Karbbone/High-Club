import { fetcher } from '@/services/fetcher';
import type { User } from '@/types/IUser';
import type { Booking } from '@/types/IBooking';
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetcher<{success: string, data: User}>('/users/1'),
  });
}

export function useUserBooking() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: () => fetcher<{success: string, data: Booking[]}>('/user/1/bookings'),
  });
}