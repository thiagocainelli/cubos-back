import express from 'express';
import multer from 'multer';
import {
  createStorage,
  viewStorage,
  deleteStorage,
  createStorageChatFile,
  downloadStorage,
} from './storage.controller';

// Middlewares
import { authenticateJWT } from '../_core/middlewares/auth.middleware';
import { auditAfterAuthMiddleware } from '../_core/middlewares/auditRequest.middleware';
import { auditResponseMiddleware } from '../_core/middlewares/auditResponse.middleware';

const router = express.Router();

// Configuração do multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens e PDFs
    cb(null, true);
    // if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Apenas imagens e PDFs são permitidos'));
    // }
  },
});

/**
 * @swagger
 * tags:
 *   name: Storage
 *   description: Gerenciamento de arquivos no storage
 */

/**
 * @swagger
 * /api/v1/storage/create:
 *   post:
 *     summary: Criar um novo arquivo no storage
 *     tags: [Storage]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo a ser enviado (imagem ou PDF)
 *               type:
 *                 type: string
 *                 description: Tipo do arquivo (opcional)
 *                 example: "profile-image"
 *     responses:
 *       201:
 *         description: Arquivo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadStorageDto'
 */
router.post(
  '/create',
  authenticateJWT,
  auditAfterAuthMiddleware,
  auditResponseMiddleware,
  upload.single('file'),
  createStorage,
);

router.post(
  '/create-chat-file',
  authenticateJWT,
  auditAfterAuthMiddleware,
  auditResponseMiddleware,
  upload.single('file'),
  createStorageChatFile,
);

/**
 * @swagger
 * /api/v1/storage/view:
 *   get:
 *     summary: Obter detalhes de um arquivo no storage
 *     tags: [Storage]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Identificador único do arquivo
 *     responses:
 *       200:
 *         description: Detalhes do arquivo obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadStorageDto'
 */
router.get('/view', authenticateJWT, viewStorage);

/**
 * @swagger
 * /api/v1/storage/download:
 *   get:
 *     summary: Download de um arquivo do storage
 *     tags: [Storage]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Identificador único do arquivo
 *     responses:
 *       200:
 *         description: Arquivo baixado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Arquivo não encontrado
 */
router.get('/download-archive-order', authenticateJWT, downloadStorage);

/**
 * @swagger
 * /api/v1/storage/delete:
 *   delete:
 *     summary: Excluir um arquivo do storage
 *     tags: [Storage]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Identificador único do arquivo
 *     responses:
 *       200:
 *         description: Arquivo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadStorageDto'
 */
router.delete(
  '/delete',
  authenticateJWT,
  auditAfterAuthMiddleware,
  auditResponseMiddleware,
  deleteStorage,
);

export default router;
