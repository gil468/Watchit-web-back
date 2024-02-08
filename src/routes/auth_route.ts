import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";
/**
 * @swagger
 * tags:
 * name: Auth
 * description: The Authentication API
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

router.post("/google", authController.googleSignin);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/refresh", authController.refresh);

export default router;
