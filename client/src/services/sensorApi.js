import axios from "axios";

const sensorApi = axios.create({
  baseURL: "/api",
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
