import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createNewNotice = async (notice) => {
  // Simulate API call
  try {
    console.log(API_URL);
    const response = await axios.post(
      `${API_URL}/notice/create-notice`,
      notice
    );
    if (response.data.success) {
      console.log("Notice created successfully:", response.data.data);
      toast.success("Notice created successfully!");
    } else {
      toast.error("Failed to create notice.", {
        description:
          response.data.message ||
          "An error occurred while creating the notice.",
      });
    }
  } catch (error) {
    console.error("Error creating notice:", error);
    toast.error("Error creating notice.", {
      description: "An error occurred while creating the notice.",
    });
    throw error;
  }
};

export const updateNoticeById = async (id, notice) => {
  // Simulate API call
  try {
    const response = await axios.patch(
      `${API_URL}/notice/update-notice/${id}`,
      notice
    );
    if (response.data.success) {
      const updatedNotice = response.data.data;
      console.log(updatedNotice);
      toast.success("Notice updated successfully!", {
        description: `Notice ${notice.title} has been updated.`,
      });
      return updatedNotice;
    } else {
      toast.error("Failed to update notice.", {
        description:
          response.data.message ||
          "An error occurred while updating the notice.",
      });
    }
  } catch (error) {
    toast.error("Error updating notice.", {
      description: "An error occurred while updating the notice.",
    });
    throw error;
  }
};

export const deleteNoticeById = async (notice) => {
  // Simulate API call
  console.log(notice);
  try {
    const response = await axios.delete(
      `${API_URL}/notice/delete-notice/${notice._id}`
    );
    if (response.data.success) {
      toast.success("Notice deleted successfully!", {
        description: `Notice with title ${notice.title} has been deleted.`,
      });
    } else {
      toast.error("Failed to delete notice.", {
        description:
          response.data.message ||
          "An error occurred while deleting the notice.",
      });
    }
    return response.data.success;
  } catch (error) {
    toast.error("Error deleting notice.", {
      description: "An error occurred while deleting the notice.",
    });
    console.error("Error deleting notice:", error);
    throw error;
  }
};

export const getNotices = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/notice/notices`);
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      toast.error("Failed to fetch notices.", {
        description:
          response.data.message || "An error occurred while fetching notices.",
      });
    }
  } catch (error) {
    console.error("Error fetching all notices:", error);
    throw error;
  }
};
