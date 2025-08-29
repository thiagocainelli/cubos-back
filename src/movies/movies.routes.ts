import { Router } from 'express';
import { validationMiddleware } from '../_core/middlewares/validation.middleware';
import { authenticateJWT } from '../_core/middlewares/auth.middleware';

// Controllers
import {
  listMovies,
  createMovies,
  updateMovies,
  viewMovies,
  deleteMovies,
  updateMovieRating,
} from './movies.controller';

// DTOs
import { CreateMoviesDto } from './dtos/createMovies.dto';
import { UpdateMoviesDto } from './dtos/updateMovies.dto';
import { UpdateRatingDto } from './dtos/updateRating.dto';

const router = Router();

/**
 * @swagger
 * /api/v1/movies/list:
 *   get:
 *     summary: Listar filmes
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: situation
 *         schema:
 *           type: string
 *           enum: [upcoming, released, canceled]
 *         description: Situação do filme
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Gênero do filme
 *     responses:
 *       200:
 *         description: Lista de filmes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReadMoviesDto'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationDto'
 */
router.get('/list', authenticateJWT, listMovies);

/**
 * @swagger
 * /api/v1/movies/create:
 *   post:
 *     summary: Criar novo filme
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMoviesDto'
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadMoviesDto'
 */
router.post('/create', authenticateJWT, validationMiddleware(CreateMoviesDto), createMovies);

/**
 * @swagger
 * /api/v1/movies/update/{uuid}:
 *   put:
 *     summary: Atualizar filme
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMoviesDto'
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadMoviesDto'
 */
router.put('/update', authenticateJWT, validationMiddleware(UpdateMoviesDto), updateMovies);

/**
 * @swagger
 * /api/v1/movies/view-by-uuid/{uuid}:
 *   get:
 *     summary: Visualizar filme específico
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do filme
 *     responses:
 *       200:
 *         description: Dados do filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadMoviesDto'
 */
router.get('/view-by-uuid', authenticateJWT, viewMovies);

/**
 * @swagger
 * /api/v1/movies/delete/{uuid}:
 *   delete:
 *     summary: Deletar filme
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do filme
 *     responses:
 *       200:
 *         description: Filme deletado com sucesso
 */
router.delete('/delete', authenticateJWT, deleteMovies);

/**
 * @swagger
 * /api/v1/movies/update-rating/{uuid}:
 *   put:
 *     summary: Atualizar avaliação do filme
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRatingDto'
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadMoviesDto'
 */
router.put(
  '/update-rating',
  authenticateJWT,
  validationMiddleware(UpdateRatingDto),
  updateMovieRating,
);

export default router;
