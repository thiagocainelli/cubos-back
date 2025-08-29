import { Request, Response } from 'express';
import { MoviesService } from './movies.service';

export const listMovies = async (_req: Request, _res: Response): Promise<void> => {
  const page = Number(_req.query.page || 1);
  const itemsPerPage = Number(_req.query.itemsPerPage || 20);
  const search = _req.query.search as string;
  const situation = _req.query.situation as string;
  const genre = _req.query.genre as string;
  const startDuration = Number(_req.query.startDuration || 0);
  const endDuration = Number(_req.query.endDuration || 0);
  const releaseStart = _req.query.releaseStart;
  const releaseEnd = _req.query.releaseEnd;

  const releaseDateStart = releaseStart ? new Date(releaseStart as string) : undefined;
  const releaseDateEnd = releaseEnd ? new Date(releaseEnd as string) : undefined;

  const response = await MoviesService.list(
    page,
    itemsPerPage,
    search,
    situation,
    genre,
    startDuration,
    endDuration,
    releaseDateStart,
    releaseDateEnd,
  );

  _res.json(response);
};

export const createMovies = async (_req: Request, _res: Response) => {
  const createMoviesDto = _req.body;
  const response = await MoviesService.create(createMoviesDto);

  _res.status(201).json(response);
};

export const updateMovies = async (_req: Request, _res: Response) => {
  const movieUuid = _req.query.uuid as string;
  const updateMoviesDto = _req.body;

  const response = await MoviesService.update(movieUuid, updateMoviesDto);

  _res.json(response);
};

export const viewMovies = async (_req: Request, _res: Response) => {
  const movieUuid = _req.query.uuid as string;
  const response = await MoviesService.view(movieUuid);

  _res.json(response);
};

export const deleteMovies = async (_req: Request, _res: Response) => {
  const movieUuid = _req.query.uuid as string;
  const response = await MoviesService.delete(movieUuid);

  _res.status(200).json(response);
};
