import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';
import { useBookingStore } from '../../store/bookingStore';
import { BrowseStackParamList, TabParamList } from '../../navigation/types';

const TODAY = new Date().toISOString().split('T')[0];

export function BookingConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BrowseStackParamList>>();
  const { lastBooking } = useBookingStore();

  const handleViewBookings = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'BrowseRooms',
          },
        ],
      }),
    );
    // Navigate to My Bookings tab
    navigation
      .getParent<BottomTabNavigationProp<TabParamList>>()
      ?.navigate('MyBookings');
  };

  const handleBrowseMore = () => {
    navigation.navigate('BrowseRooms');
  };

  if (!lastBooking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No booking found.</Text>
          <Pressable onPress={handleBrowseMore} style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse Rooms</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isToday = lastBooking.date === TODAY;
  const dateLabel = isToday ? 'Today' : 'Tomorrow';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.successCheckmark}>✓</Text>
          </View>
          <View style={styles.ring1} />
          <View style={styles.ring2} />
        </View>

        <Text style={styles.confirmTitle}>Booking Confirmed!</Text>
        <Text style={styles.confirmSubtitle}>
          Your room has been successfully reserved. See you there!
        </Text>

        {/* Booking details card */}
        <View style={styles.detailsCard}>
          {/* Room info */}
          <View style={styles.roomHeader}>
            <Text style={styles.bookingRoomName}>{lastBooking.room.name}</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
          <Text style={styles.bookingBuilding}>📍 {lastBooking.room.building}</Text>

          <View style={styles.cardDivider} />

          {/* Date & Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{dateLabel} · {lastBooking.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>🕐</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {lastBooking.startTime} – {lastBooking.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>⏱️</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>1 hour</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailIconText}>🔖</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Booking ID</Text>
              <Text style={[styles.detailValue, styles.bookingId]}>
                #{lastBooking.id.replace('booking-', '').slice(-8)}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Reminder note */}
          <View style={styles.reminderBox}>
            <Text style={styles.reminderText}>
              💡 Please arrive 5 minutes before your booking time. Present this confirmation if asked.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleViewBookings}
            style={({ pressed }) => [styles.primaryAction, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel="View my bookings"
          >
            <Text style={styles.primaryActionText}>View My Bookings</Text>
          </Pressable>

          <Pressable
            onPress={handleBrowseMore}
            style={({ pressed }) => [styles.secondaryAction, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Book another room"
          >
            <Text style={styles.secondaryActionText}>Book Another Room</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    gap: Spacing.base,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: Spacing.base,
    paddingTop: Spacing.xxxl,
  },
  errorText: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
  },
  browseButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.semibold,
  },

  // Success animation
  successIconContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  ring1: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.success,
    opacity: 0.3,
  },
  ring2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.success,
    opacity: 0.15,
  },
  successCheckmark: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },

  confirmTitle: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: Typography.letterSpacing.tight,
    marginBottom: Spacing.sm,
  },
  confirmSubtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },

  detailsCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  bookingRoomName: {
    flex: 1,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: Typography.size.xs,
    color: Colors.successDark,
    fontWeight: Typography.weight.semibold,
  },
  bookingBuilding: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconText: {
    fontSize: 18,
  },
  detailLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
  },
  detailValue: {
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.semibold,
    marginTop: 1,
  },
  bookingId: {
    fontFamily: undefined,
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
  },
  reminderBox: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  reminderText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * Typography.lineHeight.relaxed,
  },

  actions: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  primaryActionText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  secondaryAction: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  secondaryActionText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
});
