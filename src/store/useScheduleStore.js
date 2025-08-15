import { create } from "zustand";

const useScheduleStore = create((set, get) => ({
  schedules: [],

  // Add a new schedule
  addSchedule: (newSchedule) => {
    set((state) => ({
      schedules: [...state.schedules, newSchedule],
    }));
  },

  // Edit a schedule by ID
  updateSchedule: (id, updatedSchedule) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule._id === id ? { ...schedule, ...updatedSchedule } : schedule
      ),
    }));
  },

  // Delete a schedule by ID
  deleteSchedule: (id) => {
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule._id !== id),
    }));
  },

  // Set all schedules (e.g., from an API)
  setSchedules: (schedules) => {
    set({ schedules });
  },

  // Get all schedules
  getSchedules: () => {
    return get().schedules;
  },

  // Get a single schedule by ID
  getScheduleById: (id) => {
    return get().schedules.find((schedule) => schedule._id === id);
  },
}));

export default useScheduleStore;
