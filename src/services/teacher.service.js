import useTeacherStore from "@/store/useTeacherStore";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const registerTeacher = async (teacherData) => {
  const { addTeacher } = useTeacherStore.getState();
  console.log(teacherData);
  try {
    const response = await axios.post(
      `${API_URL}/teacher/register-teacher`,
      teacherData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      addTeacher(response.data.data);
      toast.success("Teacher registered successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    toast.error("Error while registering teacher", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error registering teacher:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const loginSchool = async (schoolData) => {
//   const { login } = useStudentStore.getState();
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
    //   login(response.data.data);
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

export const getAllTeachers = async () => {
  const { setTeachers } = useTeacherStore.getState();
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/teacher/teachers`);
    console.log(response);
    if (response.data.success) {
      setTeachers(response.data.data);
      return response.data.data;
    } else {
      return toast.error("Failed to fetch teachers.", {
        description:
          response.data.message || "An error occurred while fetching teachers.",
      });
    }
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  const { updateTeacherById } = useTeacherStore.getState();
  try {
    console.log(teacherData);
    const response = await axios.patch(
      `${API_URL}/teacher/update-teacher/${id}`,
      teacherData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      updateTeacherById(id, response.data.data);
      toast.success("Teacher updated successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    toast.error("Error while updating teacher", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error updating teacher:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  const { deleteTeacherById } = useTeacherStore.getState();
  try {
    const response = await axios.delete(
      `${API_URL}/teacher/delete-teacher/${id}`
    );
    console.log(response);
    if (response.data.success) {
      deleteTeacherById(id);
      return toast.success("Teacher deleted successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error(
      "Error deleting teacher:",
      error.response?.data || error.message
    );
    return toast.error("Error while deleting teacher", {
      description: error.response?.data?.message || error.message,
    });
  }
};

export const getTeacher = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/teacher/${id}`);
    console.log(response);
    if (response.data.success) {
      return response.data.data;
    } else {
      return toast.error("Failed to fetch teacher.", {
        description:
          response.data.message || "An error occurred while fetching teacher.",
      });
    }
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return toast.error("Failed to fetch teacher.", {
      description:
        error.response.data.message ||
        "An error occurred while fetching teacher.",
    });
  }
};
