import { fetcher } from '@/services/fetcher';
import type { User } from '@/types/IUser';
import type { Booking } from '@/types/IBooking';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetcher<{success: string, data: User}>('/users/1'),
  });
}

export function useUserBooking() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      const response = await api.get<{success: string, data: Booking[]}>(`/user/${user?.id}/bookings`);
      return response.data;
    },
    enabled: !!user?.id,
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