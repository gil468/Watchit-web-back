import express from "express";
const router = express.Router();
import MovieController from "../controllers/movie_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 * name: Movies
 * description: The Files API
 */

/**
 * @swagger
 * /movies/search/{search}:
 *   get:
 *     summary: Search for a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term for the movie
 *     responses:
 *       200:
 *         description: Search results matching criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/search/:search",
  authMiddleware,
  MovieController.search.bind(MovieController)
);

/**
 * @swagger
 * /movies/{movieId}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie to retrieve
 *     responses:
 *       200:
 *         description: Movie data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/:movieId",
  authMiddleware,
  MovieController.getById.bind(MovieController)
);

export default router;
