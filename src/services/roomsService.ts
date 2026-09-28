import { Room } from '../types';
import { MOCK_ROOMS, MOCK_TIME_SLOTS } from './mockData';
import type { TimeSlot } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const roomsService = {
  async getRooms(): Promise<Room[]> {
    await delay(600);
    return MOCK_ROOMS;
  },

  async getRoomById(id: string): Promise<Room | null> {
    await delay(300);
    return MOCK_ROOMS.find((r) => r.id === id) ?? null;
  },

  async getTimeSlots(roomId: string, date: string): Promise<TimeSlot[]> {
    await delay(400);
    return MOCK_TIME_SLOTS.filter((s) => s.roomId === roomId && s.date === date);
  },
};
