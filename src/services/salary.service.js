import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createSalary = async (salary) => {
  // Simulate API call
  try {
    console.log(API_URL);
    const response = await axios.post(
      `${API_URL}/salary/create-salary`,
      salary
    );
    if (response.data.success) {
      console.log("Salary created successfully:", response.data.data);
      toast.success("Salary created successfully!", {
        description: `Salary ${response.data.data.name} has been created.`,
      });
      return response.data.data;
    } else {
      toast.error("Failed to create salary.", {
        description:
          response.data.message ||
          "An error occurred while creating the salary.",
      });
    }
  } catch (error) {
    console.error("Error creating salary:", error);
    toast.error("Error creating salary.", {
      description: "An error occurred while creating the salary.",
    });
    throw error;
  }
};

export const updateSalaryById = async (id, salary) => {
  // Simulate API call
  try {
    const response = await axios.patch(
      `${API_URL}/salary/update-salary/${id}`,
      salary
    );
    if (response.data.success) {
      const updatedSalary = response.data.data;
      console.log(updatedSalary);
      toast.success("Salary updated successfully!", {
        description: `Salary ${updatedSalary.name} has been updated.`,
      });
      return updatedSalary;
    } else {
      toast.error("Failed to update salary.", {
        description:
          response.data.message ||
          "An error occurred while updating the salary.",
      });
    }
  } catch (error) {
    toast.error("Error updating salary.", {
      description: "An error occurred while updating the salary.",
    });
    throw error;
  }
};

export const deleteSalaryById = async (salary) => {
  // Simulate API call
  try {
    const response = await axios.delete(
      `${API_URL}/salary/delete-salary/${salary._id}`
    );
    console.log(response)
    if (response.data.success) {
      toast.success("Salary deleted successfully!", {
        description: `Salary ${salary.name} has been deleted.`,
      });
      return true;
    } else {
      toast.error("Failed to delete salary.", {
        description:
          response.data.message ||
          "An error occurred while deleting the salary.",
      });
    }
  } catch (error) {
    toast.error("Error deleting salary.", {
      description: "An error occurred while deleting the salary.",
    });
    console.error("Error deleting salary:", error);
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

export const getAllSalaries = async () => {
  // Simulate API call
  try {
    console.log("Fetching salary")
    const response = await axios.get(`${API_URL}/salary`);
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      toast.error("Failed to fetch salaries.", {
        description:
          response.data.message || "An error occurred while fetching salaries.",
      });
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.error("Error fetching all salaries:", error);
    throw error;
  }
};
