import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

export const registerSchool = async (schoolData) => {
  try {
    const response = await axios.post(
      `${API_URL}/school/register-school`,
      schoolData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    if (response.data.success) {
      toast.success("School registered successfully!", {
        description: response.data.message,
      });
    }
  } catch (error) {
    toast.error("Error while registering school", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error registering school:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const loginSchool = async (schoolData) => {
  const login = useAuthStore.getState().login;
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

export const getSchool = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/school`,
    );
    console.log(response);
    if (response.data.success) {
      return response.data?.data;
    }
  } catch (error) {
    toast.error("Error while fetching school data", {
      description: error.response?.data?.message || error.message,
    });
    console.error(
      "Error fetching in school:",
      error.response?.data || error.message
    );
    throw error;
  }
};


