import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ─── Root Stack (Browse tab inner stack) ─────────────────────────────────────
export type BrowseStackParamList = {
  BrowseRooms: undefined;
  RoomDetails: { roomId: string };
  BookingConfirmation: { bookingId: string };
};

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
export type TabParamList = {
  Browse: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

// ─── Screen Props Helpers ─────────────────────────────────────────────────────
export type BrowseRoomsScreenProps = NativeStackScreenProps<BrowseStackParamList, 'BrowseRooms'>;
export type RoomDetailsScreenProps = NativeStackScreenProps<BrowseStackParamList, 'RoomDetails'>;
export type BookingConfirmationScreenProps = NativeStackScreenProps<
  BrowseStackParamList,
  'BookingConfirmation'
>;
export type MyBookingsScreenProps = BottomTabScreenProps<TabParamList, 'MyBookings'>;
export type ProfileScreenProps = BottomTabScreenProps<TabParamList, 'Profile'>;
