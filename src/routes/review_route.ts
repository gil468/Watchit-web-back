import express from "express";
const router = express.Router();
import ReviewController from "../controllers/review_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: The Reviews API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      Review:
 *        type: object
 *        properties:
 *          movieTitle:
 *            type: string
 *            description: The movie title
 *          description:
 *            type: string
 *            description: The comment description
 *          score:
 *             type: Integer
 *             description: The movie score by reviewr
 *          reviewImgUrl:
 *            type: string
 *            description: The review Image Url
 *          author:
 *            type: string
 *            description: The review user Id
 *          timeStamp:
 *            type: string
 *            description: The review upload time
 *          likes:
 *            type: array
 *            description: The review likes array
 *          comments:
 *            type: array
 *            description: The review comments array
 *          isLiked:
 *            type: boolean
 *            description: The review is liked by the connected user
 *          likesCount:
 *            type: number 
 *            description: The review likes count
 *        example:
 *          description: 'This is a great movie'
 *          author: '123456'
 *          reviewId: '123456'
 *          timeStamp: '2024-01-01T00:00:00.000Z'
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.get("/", authMiddleware, ReviewController.get.bind(ReviewController));

/**
 * @swagger
 * /reviews/connectedUser:
 *   get:
 *     summary: Get reviews by the connected user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reviews by the connected user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/connectedUser",
  authMiddleware,
  ReviewController.getByConnectedUser.bind(ReviewController)
);

/**
 * @swagger
 * /reviews/id/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to retrieve
 *     responses:
 *       200:
 *         description: Review data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       404:
 *         description: Review not found
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/id/:id",
  authMiddleware,
  ReviewController.getById.bind(ReviewController)
);

/**
 * @swagger
 * /reviews/like/{id}:
 *   get:
 *     summary: Like a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to like
 *     responses:
 *       200:
 *         description: Review liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       404:
 *         description: Review not found
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/like/:id",
  authMiddleware,
  ReviewController.like.bind(ReviewController)
);

/**
 * @swagger
 * /reviews/unlike/{id}:
 *   get:
 *     summary: Unlike a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to unlike
 *     responses:
 *       200:
 *         description: Review unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       404:
 *         description: Review not found
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/unlike/:id",
  authMiddleware,
  ReviewController.unlike.bind(ReviewController)
);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: The review was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Some parameters are missing or invalid
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.post("/", authMiddleware, ReviewController.post.bind(ReviewController));

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: The review was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Some parameters are missing or invalid
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       404:
 *         description: Review not found
 *       500:
 *         description: Unexpected error
 */

router.put(
  "/:id",
  authMiddleware,
  ReviewController.putById.bind(ReviewController)
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: The review was successfully deleted
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       404:
 *         description: Review not found
 *       500:
 *         description: Unexpected error
 */

router.delete(
  "/:id",
  authMiddleware,
  ReviewController.deleteById.bind(ReviewController)
);

export default router;
