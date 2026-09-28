import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';
import { TimeSlot } from '../../types';
import { useRoom, useTimeSlots } from '../../features/rooms/useRooms';
import { useCreateBooking } from '../../features/bookings/useBookings';
import { useBookingStore } from '../../store/bookingStore';
import { TimeSlotPicker } from '../../components/TimeSlotPicker/TimeSlotPicker';
import { Badge } from '../../components/Badge/Badge';
import { RoomDetailsScreenProps } from '../../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BrowseStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<BrowseStackParamList>;

const TODAY = new Date().toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const DATE_OPTIONS = [
  { label: 'Today', value: TODAY },
  { label: 'Tomorrow', value: TOMORROW },
];

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function RoomDetailsScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoomDetailsScreenProps['route']>();
  const { roomId } = route.params;

  const { selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, setLastBooking } =
    useBookingStore();

  const { data: room, isLoading: roomLoading } = useRoom(roomId);
  const { data: slots = [], isLoading: slotsLoading } = useTimeSlots(roomId, selectedDate);
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBook = async () => {
    if (!room || !selectedSlot) return;

    try {
      const booking = await createBooking({ room, slot: selectedSlot });
      setLastBooking(booking);
      setSelectedSlot(null);
      navigation.navigate('BookingConfirmation', { bookingId: booking.id });
    } catch (error: any) {
      Alert.alert('Booking Failed', error?.message ?? 'Unable to complete booking.', [
        { text: 'OK' },
      ]);
    }
  };

  if (roomLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Room not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: room.image }}
            style={styles.heroImage}
            contentFit="cover"
            placeholder={BLURHASH}
            transition={400}
            accessibilityLabel={`Photo of ${room.name}`}
          />
          {/* Gradient overlay */}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Badge variant="status" value={room.status} />
            <Text style={styles.heroTitle}>{room.name}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Info Section */}
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🏢</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Building</Text>
                <Text style={styles.infoValue}>{room.building}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{room.location}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👥</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Capacity</Text>
                <Text style={styles.infoValue}>{room.capacity} seats</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🏷️</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Type</Text>
                <Badge variant="type" value={room.type} />
              </View>
            </View>
          </View>

          {/* Description */}
          {room.description && (
            <View style={[styles.card, styles.descriptionCard]}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{room.description}</Text>
            </View>
          )}

          {/* Facilities */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <View style={styles.facilitiesGrid}>
              {room.facilities.map((facility) => (
                <View key={facility} style={styles.facilityItem}>
                  <Text style={styles.facilityCheck}>✓</Text>
                  <Text style={styles.facilityText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Date selector */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.dateRow}>
              {DATE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setSelectedDate(opt.value)}
                  style={({ pressed }) => [
                    styles.datePill,
                    selectedDate === opt.value && styles.datePillActive,
                    pressed && { opacity: 0.8 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${opt.label}`}
                  accessibilityState={{ selected: selectedDate === opt.value }}
                >
                  <Text
                    style={[
                      styles.datePillText,
                      selectedDate === opt.value && styles.datePillTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.datePillDate,
                      selectedDate === opt.value && styles.datePillTextActive,
                    ]}
                  >
                    {opt.value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Time slots */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            <TimeSlotPicker
              slots={slots}
              selectedSlotId={selectedSlot?.id ?? null}
              onSelectSlot={handleSlotSelect}
              isLoading={slotsLoading}
            />
          </View>

          {/* Bottom spacing for the sticky button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Book Button */}
      <View style={styles.stickyBottom}>
        {selectedSlot && (
          <Text style={styles.selectedSlotInfo}>
            {selectedSlot.startTime} – {selectedSlot.endTime} · {selectedDate === TODAY ? 'Today' : 'Tomorrow'}
          </Text>
        )}
        <Pressable
          onPress={handleBook}
          disabled={!selectedSlot || isBooking || room.status === 'occupied'}
          style={({ pressed }) => [
            styles.bookButton,
            (!selectedSlot || room.status === 'occupied') && styles.bookButtonDisabled,
            pressed && selectedSlot && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Book this room"
          accessibilityState={{ disabled: !selectedSlot || isBooking }}
        >
          {isBooking ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.bookButtonText}>
              {room.status === 'occupied'
                ? 'Room Currently Occupied'
                : selectedSlot
                ? '📅 Confirm Booking'
                : 'Select a Time Slot'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  heroContainer: {
    position: 'relative',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 20, 50, 0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.base,
    right: Spacing.base,
    gap: Spacing.sm,
  },
  heroTitle: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.white,
    letterSpacing: Typography.letterSpacing.tight,
  },
  body: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  descriptionCard: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: Typography.letterSpacing.tight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  infoIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
  },
  infoValue: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
    marginLeft: 40,
  },
  description: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
  facilitiesGrid: {
    gap: Spacing.sm,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  facilityCheck: {
    fontSize: Typography.size.base,
    color: Colors.success,
    fontWeight: Typography.weight.bold,
    width: 20,
  },
  facilityText: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.medium,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  datePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 2,
  },
  datePillActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  datePillText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  datePillDate: {
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
  },
  datePillTextActive: {
    color: Colors.white,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.lg,
  },
  selectedSlotInfo: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: Typography.weight.medium,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: Colors.surfaceAlt,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },
});
