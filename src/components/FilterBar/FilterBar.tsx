import React from 'react';
import { Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { FilterType } from '../../types';

interface FilterOption {
  label: string;
  value: FilterType;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: '✅ Available', value: 'available' },
  { label: '🔬 Labs', value: 'lab' },
  { label: '📚 Study Rooms', value: 'study-room' },
  { label: '📖 Library', value: 'library' },
];

interface FilterBarProps {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

export function FilterBar({ selected, onSelect }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      accessibilityRole="menu"
      accessibilityLabel="Room type filter"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = selected === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={({ pressed }) => [
              styles.pill,
              isActive && styles.pillActive,
              pressed && styles.pillPressed,
            ]}
            accessibilityRole="menuitem"
            accessibilityLabel={`Filter by ${option.label}`}
            accessibilityState={{ selected: isActive }}
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm - 1,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillPressed: {
    opacity: 0.75,
  },
  pillText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
    fontWeight: Typography.weight.semibold,
  },
});
