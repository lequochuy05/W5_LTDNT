import React, { useRef } from 'react';
import { TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search rooms, buildings…',
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
      accessibilityLabel="Search bar"
    >
      {/* Search icon */}
      <Text style={styles.icon}>🔍</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        keyboardType="default"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Search input"
        accessibilityHint="Search for rooms by name, building or location"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          style={styles.clearButton}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weight.regular,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 2,
  },
  clearIcon: {
    fontSize: Typography.size.sm,
    color: Colors.textTertiary,
    fontWeight: Typography.weight.bold,
  },
});
