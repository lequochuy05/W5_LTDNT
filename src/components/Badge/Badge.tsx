import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { RoomType, RoomStatus } from '../../types';

interface BadgeProps {
  variant: 'type' | 'status';
  value: RoomType | RoomStatus;
}

const TYPE_LABELS: Record<RoomType, string> = {
  lab: 'Lab',
  'study-room': 'Study Room',
  library: 'Library',
};

const TYPE_STYLES: Record<RoomType, { bg: string; text: string }> = {
  lab: { bg: Colors.badgeLab, text: Colors.badgeLabText },
  'study-room': { bg: Colors.badgeStudy, text: Colors.badgeStudyText },
  library: { bg: Colors.badgeLibrary, text: Colors.badgeLibraryText },
};

const STATUS_STYLES: Record<RoomStatus, { bg: string; text: string; dot: string }> = {
  available: { bg: Colors.successLight, text: Colors.successDark, dot: Colors.success },
  occupied: { bg: Colors.errorLight, text: Colors.error, dot: Colors.error },
};

export function Badge({ variant, value }: BadgeProps) {
  if (variant === 'type') {
    const type = value as RoomType;
    const style = TYPE_STYLES[type];
    return (
      <View style={[styles.badge, { backgroundColor: style.bg }]}>
        <Text style={[styles.badgeText, { color: style.text }]}>{TYPE_LABELS[type]}</Text>
      </View>
    );
  }

  const status = value as RoomStatus;
  const style = STATUS_STYLES[status];
  return (
    <View style={[styles.badge, styles.statusBadge, { backgroundColor: style.bg }]}>
      <View style={[styles.dot, { backgroundColor: style.dot }]} />
      <Text style={[styles.badgeText, { color: style.text }]}>
        {status === 'available' ? 'Available' : 'Occupied'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusBadge: {
    gap: 5,
  },
  badgeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
});
