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
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);

// User routes
router.get("/", getUsers);
router.get("/:userId", getUser);

export default router;