export type RoomType = 'study-room' | 'lab' | 'library';
export type RoomStatus = 'available' | 'occupied';
export type SlotStatus = 'available' | 'occupied';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Room {
  id: string;
  name: string;
  building: string;
  location: string;
  capacity: number;
  type: RoomType;
  image: string;
  status: RoomStatus;
  facilities: string[];
  floor?: string;
  description?: string;
}

export interface TimeSlot {
  id: string;
  roomId: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  date: string;      // "2026-09-28"
  status: SlotStatus;
}

export interface Booking {
  id: string;
  roomId: string;
  room: Room;
  slotId: string;
  slot: TimeSlot;
  userId: string;
  status: BookingStatus;
  createdAt: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  faculty: string;
  avatarUrl?: string;
}

export type FilterType = 'all' | 'available' | 'lab' | 'study-room' | 'library';

export interface FilterState {
  searchQuery: string;
  selectedType: FilterType;
  selectedBuilding: string | null;
  capacityMin: number;
}
