import express from "express";
const router = express.Router();
import ReviewController from "../controllers/review_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", ReviewController.get.bind(ReviewController));

router.get("/:id", ReviewController.getById.bind(ReviewController));

router.get("/user/:id", ReviewController.getByUserId.bind(ReviewController));

router.post("/", authMiddleware, ReviewController.post.bind(ReviewController));

router.put(
  "/:id",
  authMiddleware,
  ReviewController.putById.bind(ReviewController)
);

router.delete(
  "/:id",
  authMiddleware,
  ReviewController.deleteById.bind(ReviewController)
);

export default router;
