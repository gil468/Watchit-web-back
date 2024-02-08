import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The Users API
 */

/**
 * @swagger
 * /user/connected:
 *   get:
 *     summary: Get connected user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connected user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.get(
  "/connected",
  authMiddleware,
  UserController.getConnected.bind(UserController)
);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update the current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Some parameters are missing or invalid
 *       401:
 *         description: Unauthorized, user needs to be signed in
 *       500:
 *         description: Unexpected error
 */

router.put("/", authMiddleware, UserController.putById.bind(UserController));

export default router;
