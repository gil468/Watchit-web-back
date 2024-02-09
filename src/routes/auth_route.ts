import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *     name: Auth
 *     description: The Authentication API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          fullName:
 *            type: string
 *            description: The user full name
 *          email:
 *             type: string
 *             description: The user email
 *          password:
 *            type: string
 *            description: The user password
 *          imgUrl:
 *            type: string
 *            description: The user profile image url
 *        example:
 *          fullName: 'Bob Smith'
 *          email: 'bob@gmail.com'
 *          password: '123456'
 *          imgUrl: 'https://www.google.com/image.png'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *           accessToken: '123cd123x1xx1'
 *           refreshToken: '134r2134cr1x3c'
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
 *             $ref: '#/components/schemas/User'
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The acess & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
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
 *     description: need to provide the refresh token in the auth header
 *     security:
 *        - bearerAuth: []
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
*                $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Unauthorized, invalid or expired token
 *       500:
 *         description: Unexpected error
 */

router.get("/refresh", authController.refresh);

export default router;
