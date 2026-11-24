import {
  fetchLatestReading,
  fetchHistory,
} from "../services/thingspeakService.js";

export async function getLatest(_request, response) {
  try {
    const reading = await fetchLatestReading();
    response.json(reading);
  } catch (error) {
    response.status(error.statusCode || 502).json({
      error: error.message,
    });
  }
}

export async function getHistory(request, response) {
  try {
    const results = Number(request.query.results) || 100;
    const safeResults = Math.min(Math.max(results, 1), 8000);
    const history = await fetchHistory(safeResults);
    response.json({ count: history.length, feeds: history });
  } catch (error) {
    response.status(error.statusCode || 502).json({
      error: error.message,
    });
  }
}
