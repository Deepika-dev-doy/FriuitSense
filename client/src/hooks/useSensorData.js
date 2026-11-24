import { useCallback, useEffect, useState } from "react";
import {
  getLatestSensorData,
  getSensorHistory,
} from "../services/sensorApi";

export function useSensorData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [latestResult, historyResult] = await Promise.all([
        getLatestSensorData(),
        getSensorHistory(100),
      ]);
      setLatest(latestResult);
      setHistory(historyResult.feeds || []);
      setLastFetched(new Date());
    } catch (requestError) {
      const message =
        requestError.response?.data?.error ||
        requestError.message ||
        "Unable to retrieve sensor data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 20000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return { latest, history, loading, error, lastFetched, refresh };
}
