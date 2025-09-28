import useStudentStore from "@/store/useStudentStore";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const registerStudent = async (studentData) => {
  const { addStudent } = useStudentStore.getState();
  console.log(studentData);
  try {
    const response = await axios.post(
      `${API_URL}/student/register-student`,
      studentData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      addStudent(response.data.data);
      toast.success("Student registered successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    toast.error("Error while registering student", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error registering student:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const loginSchool = async (schoolData) => {
  const { login } = useStudentStore.getState();
  try {
    const response = await axios.post(
      `${API_URL}/school/login-school`,
      schoolData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    const token = response.headers.get("Authorization");
    if (response.data.success) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      login(response.data.data);
      toast.success("School logged in successfully!", {
        description: response.data.message,
      });
      return response.data;
    }
  } catch (error) {
    toast.error("Error while logging in", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error logging in school:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllStudents = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/student/students`);
    console.log(response);
    if (response.data.success) {
      return (response.data.data);
    } else {
      toast.error("Failed to fetch students.", {
        description:
          response.data.message || "An error occurred while fetching students.",
      });
    }
  } catch (error) {
    console.error("Error fetching all students:", error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  const { updateStudentById } = useStudentStore.getState();
  try {
    console.log(studentData);
    const response = await axios.patch(
      `${API_URL}/student/update-student/${id}`,
      studentData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      updateStudentById(id, response.data.data);
      toast.success("Student updated successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    toast.error("Error while updating student", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error updating student:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteStudent = async (id) => {
  const { deleteStudentById } = useStudentStore.getState();
  try {
    const response = await axios.delete(
      `${API_URL}/student/delete-student/${id}`
    );
    console.log(response);
    if (response.data.success) {
      deleteStudentById(id);
      return toast.success("Student deleted successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error(
      "Error deleting student:",
      error.response?.data || error.message
    );
    return toast.error("Error while deleting student", {
      description: error.response?.data?.message || error.message,
    });
  }
};

export const getStudent = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/student/${id}`);
    console.log(response);
    if (response.data.success) {
      return response.data.data;
    } else {
      return toast.error("Failed to fetch student.", {
        description:
          response.data.message || "An error occurred while fetching student.",
      });
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    return toast.error("Failed to fetch student.", {
      description:
        error.response.data.message ||
        "An error occurred while fetching student.",
    });
  }
};
