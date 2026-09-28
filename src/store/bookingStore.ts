import { create } from 'zustand';
import { TimeSlot, Room, Booking } from '../types';

interface BookingStore {
  // Selection state
  selectedRoom: Room | null;
  selectedSlot: TimeSlot | null;
  selectedDate: string;

  // Last confirmed booking
  lastBooking: Booking | null;

  // Actions
  setSelectedRoom: (room: Room | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setSelectedDate: (date: string) => void;
  setLastBooking: (booking: Booking | null) => void;
  clearSelection: () => void;
}

const todayISO = new Date().toISOString().split('T')[0];

export const useBookingStore = create<BookingStore>((set) => ({
  selectedRoom: null,
  selectedSlot: null,
  selectedDate: todayISO,
  lastBooking: null,

  setSelectedRoom: (room) => set({ selectedRoom: room, selectedSlot: null }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setSelectedDate: (date) => set({ selectedDate: date, selectedSlot: null }),
  setLastBooking: (booking) => set({ lastBooking: booking }),
  clearSelection: () =>
    set({ selectedRoom: null, selectedSlot: null, lastBooking: null }),
}));
