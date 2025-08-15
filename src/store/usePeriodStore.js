import { create } from "zustand";

const usePeriodStore = create((set, get) => ({
  periods: [],

  // Add a new period
  addPeriod: (newPeriod) => {
    set((state) => ({
      periods: [...state.periods, newPeriod],
    }));
  },

  // Edit a period by ID
  updatePeriod: (id, updatedPeriod) => {
    set((state) => ({
      periods: state.periods.map((period) =>
        period._id === id ? { ...period, ...updatedPeriod } : period
      ),
    }));
    console.log(get().periods);
  },

  // Delete a period by ID
  deletePeriod: (id) => {
    set((state) => ({
      periods: state.periods.filter((period) => period._id !== id),
    }));
  },

  // Set all periods (e.g., from an API)
  setPeriods: (periods) => {
    set({ periods });
  },

  // Get all periods
  getPeriods: () => {
    return get().periods;
  },

  // Get a single period by ID
  getPeriodById: (id) => {
    return get().periods.find((period) => period._id === id);
  },
}));

export default usePeriodStore;
