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

// Interface pour la réponse des tickets d'un booking
interface BookingTicketsResponse {
  success: boolean;
  data: {
    booking: {
      id: number;
      datetime: string;
      event: any;
    };
    tickets: any[];
    isBookingOwner: boolean;
  };
}

export function useBookingTickets(userId: number, bookingId: number) {
  return useQuery({
    queryKey: ['booking-tickets', userId, bookingId],
    queryFn: () => fetcher<BookingTicketsResponse>(`/users/${userId}/tickets/${bookingId}`),
    enabled: !!userId && !!bookingId,
  });
}