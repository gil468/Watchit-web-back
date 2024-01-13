import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/posts", PostController.get.bind(PostController));

router.get("/post:id", PostController.getById.bind(PostController));

router.post("/post", authMiddleware, PostController.post.bind(PostController));

router.put(
  "/post:id",
  authMiddleware,
  PostController.putById.bind(PostController)
);

router.delete(
  "/post:id",
  authMiddleware,
  PostController.deleteById.bind(PostController)
);

export default router;
