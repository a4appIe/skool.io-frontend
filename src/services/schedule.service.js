import useScheduleStore from "@/store/useScheduleStore";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;
const { addSchedule, setSchedules, deleteSchedule, updateSchedule } =
  useScheduleStore.getState();

export const createSchedule = async (scheduleData) => {
  // Simulate API call
  console.log(scheduleData);
  try {
    console.log(scheduleData);
    const response = await axios.post(
      `${API_URL}/schedule/create-schedule`,
      scheduleData
    );
    if (response.data.success) {
      addSchedule(response.data.data);
      console.log("Schedule created successfully:", response.data.data);
      toast.success("Schedule created successfully!", {
        description: `Schedule ${response.data.data.title} has been created.`,
      });
    }
  } catch (error) {
    console.error("Error creating schedule:", error);
    toast.error("Error creating schedule.", {
      description: error.response?.data?.message || "An error occurred while creating the schedule.",
    });
    throw error;
  }
};

export const updateScheduleById = async (id, scheduleData) => {
  // Simulate API call
  console.log(id, " -----> ", scheduleData);
  try {
    const response = await axios.patch(
      `${API_URL}/schedule/update-schedule/${id}`,
      scheduleData
    );
    if (response.data.success) {
      const updatedSchedule = response.data.data;
      console.log(updatedSchedule);
      updateSchedule(id, updatedSchedule);
      toast.success("Schedule updated successfully!", {
        description: `Schedule ${updatedSchedule.title} has been updated.`,
      });
    }
  } catch (error) {
    toast.error("Error updating schedule.", {
      description: error.response?.data?.message || "An error occurred while updating the schedule.",
    });
    throw error;
  }
};

export const deleteScheduleById = async (schedule) => {
  // Simulate API call
  try {
    console.log(schedule);
    const response = await axios.delete(
      `${API_URL}/schedule/delete-schedule/${schedule.id}`
    );
    if (response.data.success) {
      deleteSchedule(schedule.id);
      toast.success("Schedule deleted successfully!", {
        description: `Schedule with title ${schedule.title} has been deleted.`,
      });
    }
  } catch (error) {
    toast.error("Error deleting schedule.", {
      description: error.response?.data?.message || "An error occurred while deleting the schedule.",
    });
    console.error("Error deleting schedule:", error);
  }
};

export const getScheduleById = async (id) => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/schedule/get-schedule/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
};

export const getAllSchedules = async () => {
  // Simulate API call
  try {
    const response = await axios.get(`${API_URL}/schedule/`);
    console.log(response);
    if (response.data.success) {
      setSchedules(response.data.data);
      return response.data.data;
    } else {
      toast.error("Failed to fetch schedules.", {
        description:
          response.data.message ||
          "An error occurred while fetching schedules.",
      });
    }
  } catch (error) {
    console.error("Error fetching all schedules:", error);
    throw error;
  }
};
