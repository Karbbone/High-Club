import { fetcher } from '@/services/fetcher';
import type { User } from '@/types/IUser';
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetcher<{success: string, data: User[]}>('/users/1'),
  });
}