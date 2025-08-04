import { create } from "zustand";

const useSubjectStore = create((set, get) => ({
  subjects: [],

  // Add a new subject
  addSubject: (newSubject) => {
    set((state) => ({
      subjects: [...state.subjects, newSubject],
    }));
  },

  // Edit a subject by ID
  updateSubject: (id, updatedSubject) => {
    set((state) => ({
      subjects: state.subjects.map((subj) =>
        subj._id === id ? { ...subj, ...updatedSubject } : subj
      ),
    }));
    console.log(get().subjects);
  },

  // Delete a subject by ID
  deleteSubject: (id) => {
    set((state) => ({
      subjects: state.subjects.filter((subj) => subj._id !== id),
    }));
  },

  // Set all subjects (e.g., from an API)
  setSubjects: (subjects) => {
    set({ subjects });
  },

  // Get all subjects
  getSubjects: () => {
    return get().subjects;
  },

  // Get a single subject by ID
  getSubjectById: (id) => {
    return get().subjects.find((subj) => subj._id === id);
  },
}));

export default useSubjectStore;
