import express from "express";
const router = express.Router();
import ReviewController from "../controllers/review_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", authMiddleware, ReviewController.get.bind(ReviewController));

router.get(
  "/connectedUser",
  authMiddleware,
  ReviewController.getByConnectedUser.bind(ReviewController)
);

router.get(
  "/id/:id",
  authMiddleware,
  ReviewController.getById.bind(ReviewController)
);

router.get(
  "/like/:id",
  authMiddleware,
  ReviewController.like.bind(ReviewController)
);

router.get(
  "/unlike/:id",
  authMiddleware,
  ReviewController.unlike.bind(ReviewController)
);

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
