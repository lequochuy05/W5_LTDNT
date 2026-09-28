import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { TimeSlot } from '../../types';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

export function TimeSlotPicker({
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoading,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={styles.loadingText}>Loading slots…</Text>
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No time slots available for this date.</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const isSelected = slot.id === selectedSlotId;
        const isOccupied = slot.status === 'occupied';

        return (
          <Pressable
            key={slot.id}
            onPress={() => !isOccupied && onSelectSlot(slot)}
            disabled={isOccupied}
            style={({ pressed }) => [
              styles.slot,
              isSelected && styles.slotSelected,
              isOccupied && styles.slotOccupied,
              !isOccupied && !isSelected && pressed && styles.slotPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${slot.startTime} to ${slot.endTime}, ${slot.status}`}
            accessibilityState={{
              selected: isSelected,
              disabled: isOccupied,
            }}
            hitSlop={{ top: 4, bottom: 4 }}
          >
            <View style={styles.slotTimeRow}>
              <Text
                style={[
                  styles.slotTime,
                  isSelected && styles.slotTimeSelected,
                  isOccupied && styles.slotTimeOccupied,
                ]}
              >
                {slot.startTime} – {slot.endTime}
              </Text>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.slotStatus,
                isSelected && styles.slotStatusSelected,
                isOccupied && styles.slotStatusOccupied,
              ]}
            >
              {isOccupied ? 'Occupied' : isSelected ? 'Selected' : 'Available'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  slot: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.slotAvailable,
    borderWidth: 1.5,
    borderColor: Colors.slotAvailableBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  slotSelected: {
    backgroundColor: Colors.slotSelected,
    borderColor: Colors.slotSelected,
  },
  slotOccupied: {
    backgroundColor: Colors.slotOccupied,
    borderColor: Colors.slotOccupiedBorder,
    opacity: 0.7,
  },
  slotPressed: {
    opacity: 0.8,
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotTime: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.successDark,
  },
  slotTimeSelected: {
    color: Colors.slotSelectedText,
  },
  slotTimeOccupied: {
    color: Colors.error,
  },
  checkmark: {
    fontSize: Typography.size.sm,
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
  slotStatus: {
    marginTop: 2,
    fontSize: Typography.size.xs,
    color: Colors.successDark,
    fontWeight: Typography.weight.medium,
  },
  slotStatusSelected: {
    color: Colors.slotSelectedText,
  },
  slotStatusOccupied: {
    color: Colors.error,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});
