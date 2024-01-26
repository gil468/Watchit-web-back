import express from "express";
const router = express.Router();
import MovieController from "../controllers/movie_controller";

router.get("/search/:search", MovieController.search.bind(MovieController));

router.get("/:id", MovieController.getById.bind(MovieController));

export default router;
