import { create } from "zustand";
import {
  fetchAttendanceForStudents,
  fetchStudentAttendance,
} from "@/services/attendance.service";

const useAttendanceStore = create((set, get) => ({
  attendanceData: {},
  isLoading: false,
  error: null,
  lastFetchedClass: null,

  setAttendances: (attendanceData) => {
    set({ attendanceData });
  },

  fetchAttendancesForClass: async (students, classId) => {
    const state = get();

    if (state.isLoading || state.lastFetchedClass === classId) {
      return state.attendanceData;
    }

    set({ isLoading: true, error: null });

    try {
      console.log(
        `📊 Fetching attendance for ${students.length} students in class ${classId}`
      );

      const attendanceData = await fetchAttendanceForStudents(students);

      set({
        attendanceData: { ...state.attendanceData, ...attendanceData },
        isLoading: false,
        lastFetchedClass: classId,
      });

      console.log(
        `✅ Successfully fetched attendance for ${
          Object.keys(attendanceData).length
        } students`
      );
      return attendanceData;
    } catch (error) {
      console.error("❌ Error in fetchAttendancesForClass:", error);
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch single student attendance
  fetchSingleStudentAttendance: async (studentId) => {
    try {
      const result = await fetchStudentAttendance(studentId);
      if (result && result.attendancePercentage) {
        const state = get();
        set({
          attendanceData: {
            ...state.attendanceData,
            [studentId]: result.attendancePercentage,
          },
        });
        return result.attendancePercentage;
      }
      return null;
    } catch (error) {
      console.error(
        `❌ Error fetching attendance for student ${studentId}:`,
        error
      );
      throw error;
    }
  },

  // Clear attendance data
  clearAttendances: () => {
    set({ attendanceData: {}, lastFetchedClass: null, error: null });
  },

  // Get attendance for a specific student
  getStudentAttendance: (studentId) => {
    const state = get();
    return state.attendanceData[studentId] || null;
  },
}));

export default useAttendanceStore;
