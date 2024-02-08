import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";
/**
 * @swagger
 * tags:
 *     name: Auth
 *     description: The Authentication API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Some parameters are missing or invalid
 *       500:
 *         description: Unexpected error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Sign in with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google user token.
 *     responses:
 *       200:
 *         description: The user was successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Some parameters are missing or invalid
 *       500:
 *         description: Unexpected error
 */

router.post("/google", authController.googleSignin);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Some parameters are missing or invalid
 *       500:
 *         description: Unexpected error
 */

router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The user was successfully logged out
 *       500:
 *         description: Unexpected error
 */

router.get("/logout", authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh authentication token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The authentication token was successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or expired token
 *       500:
 *         description: Unexpected error
 */

router.get("/refresh", authController.refresh);

export default router;
