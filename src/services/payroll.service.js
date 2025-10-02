import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const createPayroll = async (payrollData) => {
  // Simulate API call
  try {
    console.log(API_URL);
    const response = await axios.post(
      `${API_URL}/payroll/create-payroll`,
      payrollData
    );
    if (response.data.success) {
      console.log("Payroll created successfully:", response.data.data);
      toast.success("Payroll created successfully!");
      return { data: response.data.data, success: response.data.success };;
    } else {
      toast.error("Failed to create Payroll.");
    }
  } catch (error) {
    console.error("Error creating payroll:", error);
    toast.error("Error creating payroll.", {
      description: error?.response?.data?.message,
    });
    throw error;
  }
};

// export const updateClassById = async (id, classData) => {
//   // Simulate API call
//   try {
//     const response = await axios.patch(
//       `${API_URL}/class/update-class/${id}`,
//       classData
//     );
//     if (response.data.success) {
//       const updatedClass = response.data.data;
//       console.log(updatedClass);
//       toast.success("Class updated successfully!", {
//         description: `Class ${updatedClass.className} has been updated.`,
//       });
//       return updatedClass;
//     } else {
//       toast.error("Failed to update class.", {
//         description:
//           response.data.message ||
//           "An error occurred while updating the class.",
//       });
//     }
//   } catch (error) {
//     toast.error("Error updating class.", {
//       description: "An error occurred while updating the class.",
//     });
//     throw error;
//   }
// };

// export const deleteClassById = async (cls) => {
//   // Simulate API call
//   try {
//     const response = await axios.delete(
//       `${API_URL}/class/delete-class/${cls._id}`
//     );
//     if (response.data.success) {
//       toast.success("Class deleted successfully!", {
//         description: `Class with class name ${cls.className} has been deleted.`,
//       });
//       return true;
//     } else {
//       toast.error("Failed to delete class.", {
//         description:
//           response.data.message ||
//           "An error occurred while deleting the class.",
//       });
//     }
//   } catch (error) {
//     toast.error("Error deleting class.", {
//       description: "An error occurred while deleting the class.",
//     });
//     console.error("Error deleting class:", error);
//     throw error;
//   }
// };

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

export const getAllPayrolls = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/payroll/payrolls/${id}`);
    console.log(response);
    if (response.data.success) {
      console.log(response.data.data);
      return { data: response.data.data, success: response.data.success };
    } else {
      toast.error("Failed to fetch payrolls.", {
        description:
          response.data.message || "An error occurred while fetching payrolls.",
      });
    }
  } catch (error) {
    console.error("Error fetching all payrolls:", error);
    throw error;
  }
};
