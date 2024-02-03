import express from "express";
const router = express.Router();
import CommentController from "../controllers/comment_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", CommentController.get.bind(CommentController));

router.get("/:id", CommentController.getById.bind(CommentController));

router.get("/review/:id", CommentController.getByReviewId.bind(CommentController));

router.post(
  "/",
  authMiddleware,
  CommentController.postComment.bind(CommentController),
  CommentController.post.bind(CommentController)
);

// router.put(
//   "/:id",
//   authMiddleware,
//   CommentController.putCommentById.bind(CommentController)
// );

// router.delete(
//   "/:id",
//   authMiddleware,
//   CommentController.deleteCommentById.bind(CommentController)
// );

export default router;
