import express from "express";
import {
  login,
  register,
  deleteAllUser,
  getAllUser,
  updateUserAdmin,
  deleteUserById,
  getIdUser,
} from "../controllers/authControllers.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();
//REGISTER
router.post("/register", protect, register);
//LOGIN
router.post("/login", login);
//DELETE ALL USER
router.delete("/delete-all-user", protect, deleteAllUser);
//DELETE BYID USER
router.delete("/delete-user-by-id/:id", protect, deleteUserById);
//GET ALL USER
router.get("/get-user-id/:id", protect, getIdUser);
//GET ALL USER
router.get("/get-all-user", protect, getAllUser);
//GET ALL USER
router.put("/update-user-admin/:id", protect, updateUserAdmin);

export default router;
