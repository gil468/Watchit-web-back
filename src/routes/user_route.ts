import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/users", authMiddleware, UserController.get.bind(UserController));

router.get(
  "/user:id",
  authMiddleware,
  UserController.getById.bind(UserController)
);

router.post("/user", authMiddleware, UserController.post.bind(UserController));

router.put(
  "/user:id",
  authMiddleware,
  UserController.putById.bind(UserController)
);

router.delete(
  "/user:id",
  authMiddleware,
  UserController.deleteById.bind(UserController)
);

export default router;
