import { create } from "zustand";

const useClassStore = create((set, get) => ({
  classes: [],

  // Add a new class
  addClass: (newClass) => {
    set((state) => ({
      classes: [...state.classes, newClass],
    }));
  },

  // Edit a class by ID
  updateClass: (id, updatedClass) => {
    set((state) => ({
      classes: state.classes.map((cls) =>
        cls._id === id ? { ...cls, ...updatedClass } : cls
      ),
    }));
    console.log(get().classes);
  },

  // Delete a class by ID
  deleteClass: (id) => {
    set((state) => ({
      classes: state.classes.filter((cls) => cls._id !== id),
    }));
  },

  // Set all classes (e.g., from an API)
  setClasses: (classes) => {
    set({ classes });
  },

  // Get all classes
  getClasses: () => {
    return get().classes;
  },

  // Get a single class by ID
  getClassById: (id) => {
    return get().classes.find((cls) => cls._id === id);
  },
}));

export default useClassStore;
