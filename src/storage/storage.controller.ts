import { Request, Response } from 'express';
import { StorageService } from './storage.service';

export const createStorage = async (_req: Request, _res: Response) => {
  const usersReq = _req.usersReq;
  const createStorageDto = _req.body;
  const file = _req.file;

  if (!file) {
    return _res.status(400).json({ message: 'Arquivo é obrigatório' });
  }

  const response = await StorageService.create(createStorageDto, file);

  _res.status(201).json(response);
};

export const viewStorage = async (_req: Request, _res: Response) => {
  const storageUuid = _req.query.uuid as string;
  const response = await StorageService.view(storageUuid);

  _res.json(response);
};

export const deleteStorage = async (_req: Request, _res: Response) => {
  const storageUuid = _req.query.uuid as string;
  const response = await StorageService.delete(storageUuid);

  _res.status(200).json(response);
};
