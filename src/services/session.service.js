import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createSession = async (sessionData) => {
  // Simulate API call
  try {
    console.log(API_URL);
    const response = await axios.post(
      `${API_URL}/session/create-session`,
      sessionData
    );
    if (response.data.success) {
      console.log("Session created successfully:", response.data.data);
      toast.success("Session created successfully!");
      return response.data.data;
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error(error?.response?.data?.message);
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export const updateSession = async (sessionData) => {
  //   // Simulate API call
  try {
    const response = await axios.patch(
      `${API_URL}/session/update-session`,
      sessionData
    );
    if (response.data.success) {
      const updatedSession = response.data.data;
      console.log(updatedSession);
      toast.success("Session updated successfully!");
      return updatedSession;
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
};

export const deleteSessionById = async (session) => {
  // Simulate API call
  try {
    const response = await axios.delete(
      `${API_URL}/session/delete-session/${session._id}`
    );
    if (response.data.success) {
      toast.success("Session deleted successfully!");
      return true;
    } else {
      toast.error("Failed to delete session.", {
        description:
          response.data.message ||
          "An error occurred while deleting the session.",
      });
    }
  } catch (error) {
    toast.error("Error deleting session.", {
      description: "An error occurred while deleting the session.",
    });
    console.error("Error deleting session:", error);
    throw error;
  }
};

// export const getClass = async (id) => {
//   // Simulate API call
//   try {
//     const response = await axios.get(`${API_URL}/class/get-class/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching class:", error);
//     throw error;
//   }
// };

export const getAllSessions = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/session`);
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      toast.error("Failed to fetch sessions.", {
        description:
          response.data.message || "An error occurred while fetching sessions.",
      });
    }
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw error;
  }
};
