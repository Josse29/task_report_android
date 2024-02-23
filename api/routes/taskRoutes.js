import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTaskRs,
  editTaskRs,
  getTaskRs,
  getTaskRsId,
  deleteAllTask,
  deleteIdTaskRs,
  createTaskAlreadyDone,
  replyComment,
  getTaskRsIdSupport,
  getTaskDone,
  getTaskProcess,
  getTaskDoneRsIdSupport,
  getTaskProcessRsIdSupport,
  getTaskDoneByRsId,
  getTaskProcessByRsId,
} from "../controllers/taskControllers.js";
const router = express.Router();
router.get("/get-task/", getTaskRs);
router.get("/get-task-id/:id", getTaskRsId);
router.get("/get-task-idsupport", getTaskRsIdSupport);
router.get("/get-task-done-idsupport", getTaskDoneRsIdSupport);
router.get("/get-task-done-idunitrs", getTaskDoneByRsId);
router.get("/get-task-process-idsupport", getTaskProcessRsIdSupport);
router.get("/get-task-process-idunitrs", getTaskProcessByRsId);
router.get("/get-task-done/", getTaskDone);
router.get("/get-task-process/", getTaskProcess);
router.put("/reply-comment/:id", replyComment);
router.put("/create-task-already-done/:id", protect, createTaskAlreadyDone);
router.put("/create-task/", protect, createTaskRs);
router.put("/edit-task/:id", protect, editTaskRs);
router.put("/delete-all-task/", protect, deleteAllTask);
router.put("/delete-id-task/:id", protect, deleteIdTaskRs);
export default router;
