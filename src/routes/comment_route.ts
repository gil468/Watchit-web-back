import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import authMiddleware from "../common/auth_middleware";

router.post(
  "/",
  authMiddleware,
  CommentController.post.bind(CommentController)
);

export default router;
