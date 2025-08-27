import express from 'express';
import { validationMiddleware } from '../_core/middlewares/validation.middleware';

// Controllers
import {
  listRepresentatives,
  createRepresentatives,
  updateRepresentatives,
  viewRepresentatives,
  deleteRepresentatives,
} from './representatives.controller';

// Middlewares
import { authenticateJWT } from '../_core/middlewares/auth.middleware';
import { auditAfterAuthMiddleware } from '../_core/middlewares/auditRequest.middleware';
import { auditResponseMiddleware } from '../_core/middlewares/auditResponse.middleware';

// DTOs
import { CreateRepresentativesDto } from './dtos/representatives/createRepresentatives.dto';
import { UpdateRepresentativesDto } from './dtos/representatives/updateRepresentatives.dto';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Representatives
 *   description: Representatives management
 */

/**
 * @swagger
 * /api/v1/representatives/list:
 *   get:
 *     summary: Find all representatives
 *     tags: [Representatives]
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
 *         description: Search term for filtering representatives
 *     responses:
 *       200:
 *         description: List of representatives
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListRepresentativesDto'
 */
router.get('/list', authenticateJWT, listRepresentatives);

/**
 * @swagger
 * /api/v1/representatives/create:
 *   post:
 *     summary: Create a new representative
 *     tags: [Representatives]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRepresentativesDto'
 *     responses:
 *       201:
 *         description: Representative created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadRepresentativesDto'
 */
router.post(
  '/create',
  authenticateJWT,
  auditAfterAuthMiddleware,
  auditResponseMiddleware,
  validationMiddleware(CreateRepresentativesDto),
  createRepresentatives,
);

/**
 * @swagger
 * /api/v1/representatives/update:
 *   put:
 *     summary: Update an existing representative
 *     tags: [Representatives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Representative unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRepresentativesDto'
 *     responses:
 *       200:
 *         description: Representative updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadRepresentativesDto'
 */
router.put(
  '/update',
  authenticateJWT,
  auditAfterAuthMiddleware,
  auditResponseMiddleware,
  validationMiddleware(UpdateRepresentativesDto),
  updateRepresentatives,
);

/**
 * @swagger
 * /api/v1/representatives/view:
 *   get:
 *     summary: Find representative details
 *     tags: [Representatives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Representative unique identifier
 *     responses:
 *       200:
 *         description: Representative details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadRepresentativesDto'
 */
router.get('/view', authenticateJWT, viewRepresentatives);

/**
 * @swagger
 * /api/v1/representatives/delete:
 *   delete:
 *     summary: Soft delete a representative
 *     tags: [Representatives]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Representative unique identifier
 *     responses:
 *       200:
 *         description: Representative successfully soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadRepresentativesDto'
 */
router.delete(
  '/delete',
  authenticateJWT,
  auditAfterAuthMiddleware,
  auditResponseMiddleware,
  deleteRepresentatives,
);

export default router;
