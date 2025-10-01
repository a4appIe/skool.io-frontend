import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createSubject = async (subjectData) => {
  // Simulate API call
  try {
    const response = await axios.post(
      `${API_URL}/subject/create-subject`,
      subjectData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      console.log("Subject created successfully:", response.data.data);
      toast.success("Subject created successfully!", {
        description: `Subject ${response.data.data?.subjectName} has been created.`,
      });
      return (response.data.data);
    } else {
      toast.error("Failed to create subject.", {
        description:
          response.data.message ||
          "An error occurred while creating the subject.",
      });
    }
  } catch (error) {
    console.error("Error creating subject:", error);
    toast.error("Error creating subject.", {
      description: "An error occurred while creating the subject.",
    });
    throw error;
  }
};

export const updateSubjectById = async (id, subjectData) => {
  // Simulate API call
  try {
    const response = await axios.patch(
      `${API_URL}/subject/update-subject/${id}`,
      subjectData
    );
    if (response.data.success) {
      const updatedSubject = response.data.data;
      console.log(updatedSubject);
      toast.success("Subject updated successfully!", {
        description: `Subject ${updatedSubject.subjectName} has been updated.`,
      });
      return (id, updatedSubject);
    } else {
      toast.error("Failed to update subject.", {
        description:
          response.data.message ||
          "An error occurred while updating the subject.",
      });
    }
  } catch (error) {
    toast.error("Error updating subject.", {
      description: "An error occurred while updating the subject.",
    });
    throw error;
  }
};

export const deleteSubjectById = async (subject) => {
  // Simulate API call
  try {
    const response = await axios.delete(
      `${API_URL}/subject/delete-subject/${subject._id}`
    );
    if (response.data.success) {
      toast.success("Subject deleted successfully!", {
        description: `Subject with subject name ${subject.subjectName} has been deleted.`,
      });
      return (true);
    } else {
      toast.error("Failed to delete subject.", {
        description:
          response.data.message ||
          "An error occurred while deleting the subject.",
      });
    }
  } catch (error) {
    toast.error("Error deleting subject.", {
      description: "An error occurred while deleting the subject.",
    });
    console.error("Error deleting subject:", error);
    throw error;
  }
};

export const getSubjectById = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/subject/get-subject/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subject:", error);
    throw error;
  }
};

export const getAllSubjects = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/subject/subjects`);
    console.log(response);
    if (response.data.success) {
      return (response.data.data);
    } else {
      toast.error("Failed to fetch subjects.", {
        description:
          response.data.message || "An error occurred while fetching subjects.",
      });
    }
  } catch (error) {
    console.error("Error fetching all subjects:", error);
    throw error;
  }
};
