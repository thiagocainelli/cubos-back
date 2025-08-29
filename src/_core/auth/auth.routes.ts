import { Router } from 'express';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { login, refreshToken, register, verifyToken } from './auth.controller';

import { LoginDto } from './dtos/login.dto';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { RefreshTokenAuthDto } from './dtos/refresh-token-auth.dto';
import { RegisterDto } from './dtos/register.dto';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Auth]
 *     security: [] # Remove JWT requirement for login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       201:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadLoginResponseDto'
 */
router.post('/login', validationMiddleware(LoginDto), login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: [] # Remove JWT requirement for register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUsersDto'
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário já existente no sistema. Por favor, tente outro email."
 */
router.post('/register', validationMiddleware(RegisterDto), register);

/**
 * @swagger
 * /api/v1/auth/verify-token:
 *   get:
 *     summary: Verify if the JWT token is valid
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUserForDecoratorDto'
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 */
router.get('/verify-token', authenticateJWT, verifyToken);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh the JWT access token using a refresh token
 *     tags: [Auth]
 *     security: [] # Remove JWT requirement for refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenAuthDto'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadLoginResponseDto'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 */
router.post('/refresh-token', validationMiddleware(RefreshTokenAuthDto), refreshToken);

export default router;
