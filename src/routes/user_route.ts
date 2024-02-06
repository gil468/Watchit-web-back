import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

router.get(
  "/connected",
  authMiddleware,
  UserController.getConnected.bind(UserController)
);

router.get("/:id", authMiddleware, UserController.getById.bind(UserController));

router.post("/", authMiddleware, UserController.post.bind(UserController));

router.put("/", authMiddleware, UserController.putById.bind(UserController));

export default router;
