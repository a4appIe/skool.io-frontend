import { create } from "zustand";

const useTeacherStore = create((set, get) => ({
  teachers: [],

  // Add a new teacher
  addTeacher: (newTeacher) => {
    set((state) => ({
      teachers: [...state.teachers, newTeacher],
    }));
  },

  // Edit a teacher by ID
  updateTeacherById: (id, updatedTeacher) => {
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher._id === id ? { ...teacher, ...updatedTeacher } : teacher
      ),
    }));
    console.log(get().teachers);
  },

  // Delete a teacher by ID
  deleteTeacherById: (id) => {
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher._id !== id),
    }));
  },

  // Set all teachers (e.g., from an API)
  setTeachers: (teachers) => {
    set({ teachers });
  },

  // Get all teachers
  getTeachers: () => {
    return get().teachers;
  },

  // Get a single teacher by ID
  getTeacherById: (id) => {
    return get().teachers.find((teacher) => teacher._id === id);
  },
}));

export default useTeacherStore;
