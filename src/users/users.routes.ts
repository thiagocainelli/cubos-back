import { Router } from 'express';
import { validationMiddleware } from '../_core/middlewares/validation.middleware';

// Controllers
import {
  listUsers,
  createUsers,
  updateUsers,
  viewUsers,
  updatePassword,
  deleteUsers,
  findUserByEmail,
  resetPassword,
} from './users.controller';

// Middlewares
import { authenticateJWT } from '../_core/middlewares/auth.middleware';

// DTOs
import { CreateUsersDto } from './dtos/createUsers.dto';
import { UpdateUsersDto } from './dtos/updateUsers.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * /api/v1/users/list:
 *   get:
 *     summary: Find all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: true
 *         description: Page number for pagination
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           default: 20
 *         required: true
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term for filtering users by name or email
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         required: false
 *         description: Filter users by type (admin, user)
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter users by active status
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListUsersDto'
 */
router.get('/list', authenticateJWT, listUsers);

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
 * /api/v1/users/update:
 *   put:
 *     summary: Update an existing user
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsersDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUsersDto'
 */
router.put('/update', authenticateJWT, validationMiddleware(UpdateUsersDto), updateUsers);

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

/**
 * @swagger
 * /api/v1/users/change-password:
 *   put:
 *     summary: Update user password
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 50
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.put(
  '/change-password',
  authenticateJWT,
  validationMiddleware(UpdatePasswordDto),
  updatePassword,
);

/**
 * @swagger
 * /api/v1/users/reset-password:
 *   put:
 *     summary: Reset user password
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 9
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.put(
  '/reset-password',
  authenticateJWT,
  validationMiddleware(ResetPasswordDto),
  resetPassword,
);

/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Soft delete a user
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
 *         description: User successfully soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUsersDto'
 */
router.delete('/delete', authenticateJWT, deleteUsers);

/**
 * @swagger
 * /api/v1/users/by-email:
 *   get:
 *     summary: Find user by email
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: User email address
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadUsersDto'
 *       404:
 *         description: User not found
 */
router.get('/by-email', authenticateJWT, findUserByEmail);

export default router;
