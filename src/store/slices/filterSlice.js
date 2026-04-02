export const DEFAULT_FILTERS = {
  dateRange: 'last6',
  customStart: null,
  customEnd: null,
  category: [],
  type: 'all',
  search: '',
  sortBy: 'date',
  sortDir: 'desc',
}

export const createFilterSlice = (set) => ({
  filters: { ...DEFAULT_FILTERS },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
})
