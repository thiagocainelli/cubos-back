import { Request, Response } from 'express';
import { UsersService } from './users.service';

export const listUsers = async (_req: Request, _res: Response): Promise<void> => {
  const page = Number(_req.query.page || 1);
  const itemsPerPage = Number(_req.query.itemsPerPage || 20);
  const search = _req.query.search as string;
  const type = _req.query.type as string;

  const response = await UsersService.list(page, itemsPerPage, search, type);

  _res.json(response);
};

export const createUsers = async (_req: Request, _res: Response) => {
  const createUsersDto = _req.body;
  const response = await UsersService.create(createUsersDto);

  _res.status(201).json(response);
};

export const updateUsers = async (_req: Request, _res: Response) => {
  const userUuid = _req.query.uuid as string;
  const updateUsersDto = _req.body;

  const response = await UsersService.update(userUuid, updateUsersDto);

  _res.json(response);
};

export const viewUsers = async (_req: Request, _res: Response) => {
  const userUuid = _req.query.uuid as string;
  const response = await UsersService.view(userUuid);

  _res.json(response);
};

export const updatePassword = async (_req: Request, _res: Response) => {
  const userUuid = _req.query.uuid as string;
  const updatePasswordDto = _req.body;

  const response = await UsersService.updatePassword(userUuid, updatePasswordDto);

  _res.status(200).json(response);
};

export const resetPassword = async (_req: Request, _res: Response) => {
  const userUuid = _req.query.uuid as string;
  const resetPasswordDto = _req.body;

  const response = await UsersService.resetPassword(userUuid, resetPasswordDto);

  _res.status(200).json(response);
};

export const deleteUsers = async (_req: Request, _res: Response) => {
  const userUuid = _req.query.uuid as string;
  const response = await UsersService.delete(userUuid);

  _res.status(200).json(response);
};

export const findUserByEmail = async (_req: Request, _res: Response): Promise<void> => {
  const email = _req.query.email as string;
  const response = await UsersService.findByEmail(email);

  _res.json(response);
};
