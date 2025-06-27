// hooks/useBookings.ts
import { fetcher } from '@/services/fetcher';
import { api } from '@/services/api';
import type { Booking } from '@/types/IBooking';
import { useQuery, useMutation } from '@tanstack/react-query';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings');
      return response.data;
    },
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

// Interface pour la création d'une réservation (format backend)
interface CreateBookingData {
  datetime: string;
  user_id: number;
  event_id: number;
  purchases: {
    product_id: number;
    quantity: number;
  }[];
  guests: {
    email: string;
    purchases: {
      product_id: number;
      quantity: number;
    }[];
  }[];
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      const response = await api.post<{ success: boolean; data: Booking }>('/bookings', bookingData);
      return response.data;
    },
  });
}