import { Request, Response } from 'express';
import { RepresentativesService } from './representatives.service';

export const listRepresentatives = async (_req: Request, _res: Response): Promise<void> => {
  const t = _req.t;
  // Query da requisição
  const page = Number(_req.query.page || 1);
  const itemsPerPage = Number(_req.query.itemsPerPage || 20);
  const search = _req.query.search as string;

  const response = await RepresentativesService.list(
    t,
    page,
    itemsPerPage,
    search,
  );

  _res.json(response);
};

export const createRepresentatives = async (_req: Request, _res: Response) => {
  const t = _req.t;
  // Body da requisição
  const createRepresentativesDto = _req.body;

  const response = await RepresentativesService.create(t, createRepresentativesDto);

  _res.status(201).json(response);
};

export const updateRepresentatives = async (_req: Request, _res: Response) => {
  const t = _req.t;
  // Query da requisição
  const representativeUuid = _req.query.uuid as string;
  // Body da requisição
  const updateRepresentativesDto = _req.body;

  const response = await RepresentativesService.update(t, representativeUuid, updateRepresentativesDto);

  _res.json(response);
};

export const viewRepresentatives = async (_req: Request, _res: Response) => {
  const t = _req.t;
  // Query da requisição
  const representativeUuid = _req.query.uuid as string;

  const response = await RepresentativesService.view(t, representativeUuid);

  _res.json(response);
};

export const deleteRepresentatives = async (_req: Request, _res: Response) => {
  const t = _req.t;
  // Query da requisição
  const representativeUuid = _req.query.uuid as string;

  const response = await RepresentativesService.delete(t, representativeUuid);

  _res.status(200).json(response);
}; 