import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchAttendanceForStudents = async (studentList) => {
  try {
    const attendancePromises = studentList.map((student) =>
      fetchStudentAttendance(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      if (attendancePercentage) {
        updatedAttendanceData[studentId] = attendancePercentage;
      }
    });
    return updatedAttendanceData;
  } catch (error) {
    console.error("Error fetching attendances:", error);
    toast.error("Error fetching attendances.", {
      description:
        error.response?.data?.message ||
        "An error occurred while fetching attendances.",
    });
    throw error;
  }
};

export const fetchStudentAttendance = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/${studentId}`);
    if (response.data.success) {
      const attendanceRecords = response.data.data;
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const attendancePercentage = (
        (presentCount / totalClasses) *
        100
      ).toFixed(2);

      return { studentId, attendancePercentage };
    }
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    toast.error("Error fetching student attendance.", {
      description:
        error.response?.data?.message ||
        "An error occurred while fetching student attendance.",
    });
    throw error;
  }
};

export const getAttendanceForStudent = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/${studentId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance for student:", error);
    return toast.error("Error fetching attendance for student.", {
      description:
        error.response?.data?.message ||
        "An error occurred while fetching attendance for student.",
    });
  }
};
