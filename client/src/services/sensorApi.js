import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = configuredBaseUrl
  ?.replace(/\/$/, "")
  .replace(/\/api$/, "");
const baseURL = normalizedBaseUrl
  ? `${normalizedBaseUrl}/api`
  : "https://friuitsense-backend.onrender.com/api";

const sensorApi = axios.create({
  baseURL,
  timeout: 20000,
});

export async function getLatestSensorData() {
  const response = await sensorApi.get("/sensor-data/latest");
  return response.data;
}

export async function getSensorHistory(results = 100) {
  const response = await sensorApi.get("/sensor-data/history", {
    params: { results },
  });
  return response.data;
}
