import { Request, Response } from 'express';
import { StorageService } from './storage.service';

export const createStorage = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Body da requisição
  const createStorageDto = _req.body;

  // Arquivo enviado via multer
  const file = _req.file;

  if (!file) {
    return _res.status(400).json({ message: 'Arquivo é obrigatório' });
  }

  //
  const response = await StorageService.create(t, usersReq, createStorageDto, file);

  _res.status(201).json(response);
};

export const createStorageChatFile = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Arquivo enviado via multer
  const file = _req.file;

  if (!file) {
    return _res.status(400).json({ message: 'Arquivo é obrigatório' });
  }

  //
  const response = await StorageService.createChatFile(t, usersReq, file);

  _res.status(201).json(response);
};

export const viewStorage = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const storageUuid = _req.query.uuid as string;

  //
  const response = await StorageService.view(t, usersReq, storageUuid);

  _res.json(response);
};

export const deleteStorage = async (_req: Request, _res: Response) => {
  const t = _req.t;

  const usersReq = _req.usersReq;
  const storageUuid = _req.query.uuid as string;

  //
  const response = await StorageService.delete(t, usersReq, storageUuid);

  _res.status(200).json(response);
};

export const downloadStorage = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;
  const storageUuid = _req.query.uuid as string;

  const response = await StorageService.downloadArchiveOrder(t, usersReq, storageUuid);

  if (response) {
    _res.setHeader('Content-Type', response.mimeType);
    _res.setHeader('Content-Disposition', `attachment; filename="${response.fileName}"`);
    _res.setHeader('Content-Length', response.fileBuffer.length.toString());

    _res.send(response.fileBuffer);
  } else {
    _res.status(404).json({ message: 'Arquivo não encontrado' });
  }
};
