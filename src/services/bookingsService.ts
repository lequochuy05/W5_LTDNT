import { Booking, TimeSlot, Room } from '../types';

// In-memory store for demo bookings
let bookings: Booking[] = [];

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface CreateBookingPayload {
  room: Room;
  slot: TimeSlot;
  userId: string;
}

export const bookingsService = {
  async getBookings(userId: string): Promise<Booking[]> {
    await delay(400);
    return bookings.filter((b) => b.userId === userId);
  },

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    await delay(700);

    // Check for conflicts
    const conflict = bookings.find(
      (b) =>
        b.roomId === payload.room.id &&
        b.date === payload.slot.date &&
        b.startTime === payload.slot.startTime &&
        b.status === 'confirmed',
    );
    if (conflict) {
      throw new Error('This time slot has already been booked.');
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomId: payload.room.id,
      room: payload.room,
      slotId: payload.slot.id,
      slot: payload.slot,
      userId: payload.userId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      date: payload.slot.date,
      startTime: payload.slot.startTime,
      endTime: payload.slot.endTime,
    };

    bookings = [...bookings, newBooking];
    return newBooking;
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await delay(400);
    bookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b,
    );
  },
};
