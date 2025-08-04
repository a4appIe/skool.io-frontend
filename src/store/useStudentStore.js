import { create } from "zustand";

const useStudentStore = create((set, get) => ({
  students: [],

  // Add a new student
  addStudent: (newStudent) => {
    set((state) => ({
      students: [...state.students, newStudent],
    }));
  },

  // Edit a student by ID
  updateStudentById: (id, updatedStudent) => {
    set((state) => ({
      students: state.students.map((stu) =>
        stu._id === id ? { ...stu, ...updatedStudent } : stu
      ),
    }));
    console.log(get().students);
  },

  // Delete a student by ID
  deleteStudentById: (id) => {
    set((state) => ({
      students: state.students.filter((stu) => stu._id !== id),
    }));
  },

  // Set all students (e.g., from an API)
  setStudents: (students) => {
    set({ students });
  },

  // Get all students
  getStudents: () => {
    return get().students;
  },

  // Get a single student by ID
  getStudentById: (id) => {
    return get().students.find((stu) => stu._id === id);
  },
}));

export default useStudentStore;
