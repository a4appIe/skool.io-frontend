import usePeriodStore from "@/store/usePeriodStore";
import { API_URL } from "@/utils/constants";
import axios from "axios";
import { toast } from "sonner";

export async function createPeriod(formData) {
  try {
    const response = await axios.post(
      `${API_URL}/period/create-period`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Upload response:", response.data);
    if (response.data?.success) {
      toast.success("Class periods created successfully!");
    }
  } catch (error) {
    toast.error("Failed to upload class periods");
    throw error;
  }
}

export async function getAllPeriods() {
  try {
    const response = await axios.get(`${API_URL}/period/`);
    if (response.data?.success) {
      usePeriodStore.getState().setPeriods(response.data.data);
    }
    return response.data.data;
  } catch (error) {
    toast.error("Failed to retrieve class periods");
    throw error;
  }
}
