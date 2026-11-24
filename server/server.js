import "dotenv/config";
import express from "express";
import cors from "cors";
import sensorRoutes from "./routes/sensorRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", message: "FruitSense server is running" });
});

app.use("/api/sensor-data", sensorRoutes);

app.use((error, _request, response, _next) => {
  console.error("Unhandled server error:", error.message);
  response.status(500).json({
    error: "An unexpected server error occurred.",
  });
});

app.listen(port, () => {
  console.log(`FruitSense server listening on http://localhost:${port}`);
});
