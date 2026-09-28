import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';
import { Room } from '../../types';
import { Badge } from '../Badge/Badge';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
  cardWidth?: number;
}

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function RoomCard({ room, onPress, cardWidth }: RoomCardProps) {
  return (
    <Pressable
      onPress={() => onPress(room)}
      style={({ pressed }) => [
        styles.card,
        cardWidth ? { width: cardWidth } : styles.cardFull,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, ${room.building}, ${room.status}`}
      accessibilityHint="Tap to view room details and book"
    >
      {/* Room Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          contentFit="cover"
          placeholder={BLURHASH}
          transition={300}
          accessibilityLabel={`Photo of ${room.name}`}
        />
        {/* Status badge overlay */}
        <View style={styles.statusBadgeOverlay}>
          <Badge variant="status" value={room.status} />
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Name row */}
        <View style={styles.nameRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
          <Badge variant="type" value={room.type} />
        </View>

        {/* Building */}
        <Text style={styles.building} numberOfLines={1}>
          📍 {room.building}
        </Text>

        {/* Capacity + floor row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>👥 {room.capacity} seats</Text>
          </View>
          {room.floor && (
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>Floor {room.floor}</Text>
            </View>
          )}
        </View>

        {/* Facilities */}
        {room.facilities.length > 0 && (
          <Text style={styles.facilities} numberOfLines={1}>
            {room.facilities.slice(0, 3).join(' · ')}
            {room.facilities.length > 3 ? ` +${room.facilities.length - 3}` : ''}
          </Text>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* View Details Button */}
        <Pressable
          onPress={() => onPress(room)}
          style={({ pressed }) => [
            styles.viewButton,
            room.status === 'occupied' && styles.viewButtonOccupied,
            pressed && styles.viewButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${room.name}`}
          hitSlop={{ top: 4, bottom: 4 }}
        >
          <Text style={[
            styles.viewButtonText,
            room.status === 'occupied' && styles.viewButtonTextOccupied,
          ]}>
            {room.status === 'available' ? 'View Details & Book' : 'View Details'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  cardFull: {
    flex: 1,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  statusBadgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  roomName: {
    flex: 1,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  building: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  facilities: {
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    marginTop: 2,
  },
  viewButtonOccupied: {
    backgroundColor: Colors.surfaceAlt,
  },
  viewButtonPressed: {
    opacity: 0.85,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  viewButtonTextOccupied: {
    color: Colors.textSecondary,
  },
});
