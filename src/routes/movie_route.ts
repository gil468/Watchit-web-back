import express from "express";
const router = express.Router();
import MovieController from "../controllers/movie_controller";
import authMiddleware from "../common/auth_middleware";

router.get(
  "/search/:search",
  // authMiddleware,
  MovieController.search.bind(MovieController)
);

router.get(
  "/:id",
  authMiddleware,
  MovieController.getById.bind(MovieController)
);

export default router;
