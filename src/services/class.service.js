import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createClass = async (classData) => {
  // Simulate API call
  try {
    console.log(API_URL);
    const response = await axios.post(
      `${API_URL}/class/create-class`,
      classData
    );
    if (response.data.success) {
      console.log("Class created successfully:", response.data.data);
      toast.success("Class created successfully!", {
        description: `Class ${response.data.data.className} has been created.`,
      });
      return response.data.data;
    } else {
      toast.error("Failed to create class.", {
        description:
          response.data.message ||
          "An error occurred while creating the class.",
      });
    }
  } catch (error) {
    console.error("Error creating class:", error);
    toast.error("Error creating class.", {
      description: "An error occurred while creating the class.",
    });
    throw error;
  }
};

export const updateClassById = async (id, classData) => {
  // Simulate API call
  try {
    const response = await axios.patch(
      `${API_URL}/class/update-class/${id}`,
      classData
    );
    if (response.data.success) {
      const updatedClass = response.data.data;
      console.log(updatedClass);
      toast.success("Class updated successfully!", {
        description: `Class ${updatedClass.className} has been updated.`,
      });
      return updatedClass;
    } else {
      toast.error("Failed to update class.", {
        description:
          response.data.message ||
          "An error occurred while updating the class.",
      });
    }
  } catch (error) {
    toast.error("Error updating class.", {
      description: "An error occurred while updating the class.",
    });
    throw error;
  }
};

export const deleteClassById = async (cls) => {
  // Simulate API call
  try {
    const response = await axios.delete(
      `${API_URL}/class/delete-class/${cls._id}`
    );
    if (response.data.success) {
      toast.success("Class deleted successfully!", {
        description: `Class with class name ${cls.className} has been deleted.`,
      });
      return true;
    } else {
      toast.error("Failed to delete class.", {
        description:
          response.data.message ||
          "An error occurred while deleting the class.",
      });
    }
  } catch (error) {
    toast.error("Error deleting class.", {
      description: "An error occurred while deleting the class.",
    });
    console.error("Error deleting class:", error);
    throw error;
  }
};

export const getClass = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/class/${id}`);
    if (response.data.success) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      toast.error("Failed to fetch class.", {
        description:
          response.data.message || "An error occurred while fetching class.",
      });
    }
  } catch (error) {
    console.error("Error fetching class:", error);
    throw error;
  }
};

export const getAllClasses = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/class`);
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      toast.error("Failed to fetch classes.", {
        description:
          response.data.message || "An error occurred while fetching classes.",
      });
    }
  } catch (error) {
    console.error("Error fetching all classes:", error);
    throw error;
  }
};
