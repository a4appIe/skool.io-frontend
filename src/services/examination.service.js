import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createExamination = async (data) => {
  // Simulate API call
  try {
    console.log(API_URL);
    const response = await axios.post(
      `${API_URL}/examination/create-examination`,
      data
    );
    if (response.data.success) {
      console.log("Examination created successfully:", response.data.data);
      toast.success("Examination created successfully!");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Failed to create examination.");
    }
  } catch (error) {
    console.error("Error creating examination:", error);
    toast.error(
      error?.response?.data?.message || "Error creating examination."
    );
    throw error;
  }
};

// export const updateExaminationById = async (id, data) => {
//   // Simulate API call
//   try {
//     const response = await axios.patch(
//       `${API_URL}/examination/update-examination/${id}`,
//       data
//     );
//     if (response.data.success) {
//       const updatedExamination = response.data.data;
//       console.log(updatedExamination);
//       toast.success("Examination updated successfully!");
//       return updatedExamination;
//     } else {
//       toast.error(response.data.message || "Failed to update examination.");
//     }
//   } catch (error) {
//     toast.error(error.response.data.message || "Error updating examination.");
//     throw error;
//   }
// };

export const deleteExaminationById = async (id) => {
  // Simulate API call
  try {
    const response = await axios.delete(
      `${API_URL}/examination/delete-examination/${id}`
    );
    if (response.data.success) {
      toast.success(
        response.data.message || "Examination deleted successfully!"
      );
      return true;
    } else {
      toast.error(response.data.message || "Failed to delete examination.");
    }
  } catch (error) {
    toast.error("Error deleting examination.", {
      description: "An error occurred while deleting the examination.",
    });
    console.error("Error deleting examination:", error);
    throw error;
  }
};

export const getExamination = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/examination/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching class:", error);
    throw error;
  }
};

export const getAllExaminations = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/examination/`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching examinations:", error);
    throw error;
  }
};

export const updateExaminationStatus = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(
      `${API_URL}/examination/update-status/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching examinations:", error);
    throw error;
  }
};

export const uploadDatesheet = async (examId, classId, file) => {
  try {
    const formData = new FormData();
    formData.append("datesheet", file);

    const response = await axios.post(
      `${API_URL}/examination/upload-datesheet/${examId}/${classId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success("Datesheet uploaded successfully!");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Failed to upload datesheet.");
    }
  } catch (error) {
    console.error("Error uploading datesheet:", error);
    toast.error(error?.response?.data?.message || "Error uploading datesheet.");
    throw error;
  }
};

export const downloadDatesheet = async (examId, classId) => {
  try {
    const response = await axios.get(
      `${API_URL}/examination/download-datesheet/${examId}/${classId}`,
      {
        responseType: "blob", // Important for file downloads
      }
    );

    // Create a URL for the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `datesheet_${classId}.pdf`); // or whatever file name you want
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Datesheet downloaded successfully!");
  } catch (error) {
    console.error("Error downloading datesheet:", error);
    toast.error(
      error?.response?.data?.message || "Error downloading datesheet."
    );
    throw error;
  }
};
