import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

export async function fetchTasks() {
  const response = await api.get("/tasks");
  return response.data.data;
}

export async function createTask(task) {
  const response = await api.post("/tasks", task);
  return response.data.data;
}

export async function updateTask(id, task) {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data.data;
}

export async function updateTaskStatus(id, status) {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data.data;
}

export async function deleteTask(id) {
  const response = await api.delete(`/tasks/${id}`);
  return response.data.data;
}

export function getErrorMessage(error) {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (axios.isAxiosError(error) && error.request) {
    return "Could not reach the server. Check that the API is running and try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
