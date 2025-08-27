import { Request, Response } from 'express';
import { MoviesService } from './movies.service';

export const listMovies = async (_req: Request, _res: Response): Promise<void> => {
  const page = Number(_req.query.page || 1);
  const itemsPerPage = Number(_req.query.itemsPerPage || 20);
  const search = _req.query.search as string;
  const situation = _req.query.situation as string;
  const genre = _req.query.genre as string;

  const response = await MoviesService.list(page, itemsPerPage, search, situation, genre);

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

export const findMoviesByGenre = async (_req: Request, _res: Response): Promise<void> => {
  const genre = _req.query.genre as string;
  const response = await MoviesService.findByGenre(genre);

  _res.json(response);
};

export const findMoviesBySituation = async (_req: Request, _res: Response): Promise<void> => {
  const situation = _req.query.situation as string;
  const response = await MoviesService.findBySituation(situation);

  _res.json(response);
};

export const updateMovieRating = async (_req: Request, _res: Response) => {
  const movieUuid = _req.query.uuid as string;
  const updateRatingDto = _req.body;

  const response = await MoviesService.updateRating(movieUuid, updateRatingDto);

  _res.json(response);
};
