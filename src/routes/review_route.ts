import express from "express";
const router = express.Router();
import ReviewController from "../controllers/review_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/reviews", ReviewController.get.bind(ReviewController));

router.get("/review:id", ReviewController.getById.bind(ReviewController));

router.post(
  "/review",
  authMiddleware,
  ReviewController.post.bind(ReviewController)
);

router.put(
  "/review:id",
  authMiddleware,
  ReviewController.putById.bind(ReviewController)
);

router.delete(
  "/review:id",
  authMiddleware,
  ReviewController.deleteById.bind(ReviewController)
);

export default router;
