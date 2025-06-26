import { fetcher } from '@/services/fetcher';
import type { Ticket } from '@/types/ITicket';
import { useQuery } from '@tanstack/react-query';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => fetcher<{success: string, data: Ticket[]}>('/tickets/1'),
  });
}