import { create } from 'zustand';
import { FilterState, FilterType } from '../types';

interface FilterStore extends FilterState {
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: FilterType) => void;
  setSelectedBuilding: (building: string | null) => void;
  setCapacityMin: (min: number) => void;
  resetFilters: () => void;
}

const DEFAULT_STATE: FilterState = {
  searchQuery: '',
  selectedType: 'all',
  selectedBuilding: null,
  capacityMin: 0,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...DEFAULT_STATE,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  setCapacityMin: (min) => set({ capacityMin: min }),
  resetFilters: () => set(DEFAULT_STATE),
}));
