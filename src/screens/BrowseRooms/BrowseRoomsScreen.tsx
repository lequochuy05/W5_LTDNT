import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, BorderRadius } from '../../constants';
import { Room } from '../../types';
import { useRooms } from '../../features/rooms/useRooms';
import { useFilterStore } from '../../store/filterStore';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { RoomCard } from '../../components/RoomCard/RoomCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { BrowseStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<BrowseStackParamList, 'BrowseRooms'>;

export function BrowseRoomsScreen() {
  const navigation = useNavigation<NavProp>();
  const { data: rooms = [], isLoading, isError, refetch } = useRooms();

  const { searchQuery, selectedType, setSearchQuery, setSelectedType } = useFilterStore();
  const { numColumns, cardWidth, horizontalPadding } = useResponsiveLayout();

  // Filter + search logic
  const filteredRooms = useMemo(() => {
    let result = rooms;

    // Filter by type/status
    if (selectedType === 'available') {
      result = result.filter((r) => r.status === 'available');
    } else if (selectedType !== 'all') {
      result = result.filter((r) => r.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q),
      );
    }

    return result;
  }, [rooms, selectedType, searchQuery]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetails', { roomId: room.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Room>) => (
      <RoomCard room={item} onPress={handleRoomPress} cardWidth={numColumns > 1 ? cardWidth : undefined} />
    ),
    [handleRoomPress, numColumns, cardWidth],
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.screenTitle}>Study Rooms</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredRooms.length}</Text>
          </View>
        </View>
        <Text style={styles.screenSubtitle}>Find and book your perfect study space</Text>

        <View style={styles.searchContainer}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <FilterBar selected={selectedType} onSelect={setSelectedType} />

        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </Text>
        </View>
      </View>
    ),
    [filteredRooms.length, searchQuery, setSearchQuery, selectedType, setSelectedType],
  );

  const ListEmpty = useMemo(() => {
    if (isLoading) return null;
    if (isError) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateEmoji}>⚠️</Text>
          <Text style={styles.stateTitle}>Unable to load rooms</Text>
          <Text style={styles.stateSubtitle}>Check your connection and try again.</Text>
          <Pressable
            onPress={() => refetch()}
            style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateEmoji}>🔍</Text>
        <Text style={styles.stateTitle}>No rooms found</Text>
        <Text style={styles.stateSubtitle}>Try changing your filters or search query.</Text>
      </View>
    );
  }, [isLoading, isError, refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {ListHeader}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading rooms…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        // Key forces FlatList re-mount when numColumns changes
        key={`rooms-${numColumns}`}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  listHeader: {
    paddingBottom: Spacing.base,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  screenTitle: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  countBadge: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  countText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  screenSubtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.base,
    marginTop: 4,
    marginBottom: Spacing.base,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  resultsRow: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  resultsText: {
    fontSize: Typography.size.sm,
    color: Colors.textTertiary,
    fontWeight: Typography.weight.medium,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  loadingText: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
  stateContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.section,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  stateEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  stateTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * Typography.lineHeight.normal,
  },
  retryButton: {
    marginTop: Spacing.base,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.semibold,
    fontSize: Typography.size.base,
  },
});
