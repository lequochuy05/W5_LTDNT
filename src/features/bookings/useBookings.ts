import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsService, CreateBookingPayload } from '../../services/bookingsService';
import { MOCK_USER } from '../../services/mockData';

const BOOKINGS_QUERY_KEY = (userId: string) => ['bookings', userId] as const;
const USER_ID = MOCK_USER.id;

export function useBookings() {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEY(USER_ID),
    queryFn: () => bookingsService.getBookings(USER_ID),
    staleTime: 0, // Always refetch to pick up new bookings
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateBookingPayload, 'userId'>) =>
      bookingsService.createBooking({ ...payload, userId: USER_ID }),
    onSuccess: () => {
      // Invalidate bookings to trigger refetch
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY(USER_ID) });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingsService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY(USER_ID) });
    },
  });
}
