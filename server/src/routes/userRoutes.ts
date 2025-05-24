import { Router } from "express";
import { 
  getUsers, 
  getUser, 
  getCurrentUser,
  registerUser, 
  loginUser, 
  logoutUser 
} from "../controllers/userController";

const router = Router();

// Auth routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.get("/auth/me", getCurrentUser);

// User routes
router.get("/", getUsers);
router.get("/:userId", getUser);

export default router;