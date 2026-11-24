import express from "express";
import {
  getHistory,
  getLatest,
} from "../controllers/sensorController.js";

const router = express.Router();

router.get("/latest", getLatest);
router.get("/history", getHistory);

export default router;
