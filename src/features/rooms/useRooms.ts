import { useQuery } from '@tanstack/react-query';
import { roomsService } from '../../services/roomsService';

export const ROOMS_QUERY_KEY = ['rooms'] as const;
export const ROOM_QUERY_KEY = (id: string) => ['room', id] as const;
export const SLOTS_QUERY_KEY = (roomId: string, date: string) =>
  ['slots', roomId, date] as const;

export function useRooms() {
  return useQuery({
    queryKey: ROOMS_QUERY_KEY,
    queryFn: () => roomsService.getRooms(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ROOM_QUERY_KEY(id),
    queryFn: () => roomsService.getRoomById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTimeSlots(roomId: string, date: string) {
  return useQuery({
    queryKey: SLOTS_QUERY_KEY(roomId, date),
    queryFn: () => roomsService.getTimeSlots(roomId, date),
    enabled: !!roomId && !!date,
    staleTime: 1000 * 60 * 2,
  });
}
