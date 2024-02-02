import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", authMiddleware, UserController.get.bind(UserController));

router.get("/:id", authMiddleware, UserController.getById.bind(UserController));

router.post("/", authMiddleware, UserController.post.bind(UserController));

router.put("/:id", authMiddleware, UserController.putById.bind(UserController));

router.delete(
  "/:id",
  authMiddleware,
  UserController.deleteById.bind(UserController)
);

export default router;
