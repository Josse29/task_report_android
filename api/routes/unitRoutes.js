import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createUnitRS,
  deleteAllUnitRS,
  deleteUnitRSById,
  readUnitRS,
  readUnitRSById,
  readUnitRSByIdTaskDone,
  readUnitRSByIdTaskProcess,
  updateUnitRS,
} from "../controllers/unitControllers.js";
const router = express.Router();
router.get("/read-unitrs", protect, readUnitRS);
router.get("/read-unitrs-by-id/:id", protect, readUnitRSById);
router.get("/read-unitrs-by-id-task-done/:id", protect, readUnitRSByIdTaskDone);
router.get(
  "/read-unitrs-by-id-task-process/:id",
  protect,
  readUnitRSByIdTaskProcess
);
router.post("/create-unitrs", protect, createUnitRS);
router.put("/update-unitrs/:id", protect, updateUnitRS);
router.delete("/delete-unitrs/:id", protect, deleteUnitRSById);
router.delete("/delete-all-unitrs", protect, deleteAllUnitRS);
export default router;
