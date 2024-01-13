import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/comments", CommentController.get.bind(CommentController));

router.get("/comment:id", CommentController.getById.bind(CommentController));

router.post(
  "/comment",
  authMiddleware,
  CommentController.post.bind(CommentController)
);

router.put(
  "/comment:id",
  authMiddleware,
  CommentController.putById.bind(CommentController)
);

router.delete(
  "/comment:id",
  authMiddleware,
  CommentController.deleteById.bind(CommentController)
);

export default router;
