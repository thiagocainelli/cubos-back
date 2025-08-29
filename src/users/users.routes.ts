import { Router } from 'express';
import { validationMiddleware } from '../_core/middlewares/validation.middleware';
import { createUsers, viewUsers } from './users.controller';
import { authenticateJWT } from '../_core/middlewares/auth.middleware';
import { CreateUsersDto } from './dtos/createUsers.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsersDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUsersDto'
 */
router.post('/create', authenticateJWT, validationMiddleware(CreateUsersDto), createUsers);

/**
 * @swagger
 * /api/v1/users/view:
 *   get:
 *     summary: Find user details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User unique identifier
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUsersDto'
 */
router.get('/view', authenticateJWT, viewUsers);

export default router;
