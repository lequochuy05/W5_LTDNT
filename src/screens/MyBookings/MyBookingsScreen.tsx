import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ListRenderItemInfo,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';
import { Booking, BookingStatus } from '../../types';
import { useBookings, useCancelBooking } from '../../features/bookings/useBookings';

const TODAY = new Date().toISOString().split('T')[0];

type Tab = 'upcoming' | 'past';

function formatDate(dateStr: string): string {
  if (dateStr === TODAY) return 'Today';
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  if (dateStr === tomorrow) return 'Tomorrow';
  return dateStr;
}

function getStatusStyle(status: BookingStatus) {
  switch (status) {
    case 'confirmed':
      return { bg: Colors.successLight, text: Colors.successDark, dot: Colors.success };
    case 'cancelled':
      return { bg: Colors.errorLight, text: Colors.error, dot: Colors.error };
    case 'completed':
      return { bg: Colors.surfaceAlt, text: Colors.textSecondary, dot: Colors.textTertiary };
  }
}

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
  const statusStyle = getStatusStyle(booking.status);

  return (
    <View style={styles.bookingCard}>
      {/* Left accent */}
      <View style={[styles.cardAccent, { backgroundColor: statusStyle.dot }]} />

      <View style={styles.cardBody}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.bookingRoomName} numberOfLines={1}>
              {booking.room.name}
            </Text>
            <Text style={styles.bookingBuilding} numberOfLines={1}>
              📍 {booking.room.building}
            </Text>
          </View>
          <View style={[styles.bookingStatusBadge, { backgroundColor: statusStyle.bg }]}>
            <View style={[styles.bookingStatusDot, { backgroundColor: statusStyle.dot }]} />
            <Text style={[styles.bookingStatusText, { color: statusStyle.text }]}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.cardMeta}>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>📅 {formatDate(booking.date)}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              🕐 {booking.startTime} – {booking.endTime}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {booking.room.type === 'lab' ? '🔬' : booking.room.type === 'library' ? '📚' : '📖'}{' '}
              {booking.room.type === 'lab'
                ? 'Lab'
                : booking.room.type === 'library'
                ? 'Library'
                : 'Study Room'}
            </Text>
          </View>
        </View>

        {/* Cancel button */}
        {booking.status === 'confirmed' && (
          <Pressable
            onPress={() => onCancel(booking.id)}
            style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.75 }]}
            accessibilityRole="button"
            accessibilityLabel={`Cancel booking for ${booking.room.name}`}
            hitSlop={{ top: 4, bottom: 4 }}
          >
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const { data: bookings = [], isLoading, refetch } = useBookings();
  const { mutateAsync: cancelBooking } = useCancelBooking();

  const upcoming = bookings.filter(
    (b) => b.status === 'confirmed' && b.date >= TODAY,
  );
  const past = bookings.filter(
    (b) => b.status !== 'confirmed' || b.date < TODAY,
  );

  const displayedBookings = activeTab === 'upcoming' ? upcoming : past;

  const handleCancel = useCallback(
    async (bookingId: string) => {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          { text: 'Keep Booking', style: 'cancel' },
          {
            text: 'Cancel Booking',
            style: 'destructive',
            onPress: async () => {
              await cancelBooking(bookingId);
            },
          },
        ],
      );
    },
    [cancelBooking],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Booking>) => (
      <BookingCard booking={item} onCancel={handleCancel} />
    ),
    [handleCancel],
  );

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{activeTab === 'upcoming' ? '📭' : '📋'}</Text>
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming'
          ? 'Browse the rooms and book your first study space!'
          : 'Your completed bookings will appear here.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Manage your room reservations</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['upcoming', 'past'] as Tab[]).map((tab) => {
          const count = tab === 'upcoming' ? upcoming.length : past.length;
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityLabel={`${tab} bookings, ${count}`}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {count > 0 && (
                <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
                  <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedBookings}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm - 2,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabCount: {
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabCountText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
  },
  tabCountTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Booking card
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    ...Shadow.sm,
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardTitleGroup: {
    flex: 1,
    gap: 2,
  },
  bookingRoomName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
  },
  bookingBuilding: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  bookingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  bookingStatusDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  bookingStatusText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  metaChip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  metaChipText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontSize: Typography.size.xs,
    color: Colors.error,
    fontWeight: Typography.weight.semibold,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * Typography.lineHeight.normal,
  },
});
