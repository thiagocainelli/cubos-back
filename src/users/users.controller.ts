import { Request, Response } from 'express';
import { UsersService } from './users.service';

export const listUsers = async (_req: Request, _res: Response): Promise<void> => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const page = Number(_req.query.page || 1);
  const itemsPerPage = Number(_req.query.itemsPerPage || 20);
  const search = _req.query.search as string;
  const type = _req.query.type as string;
  const active = _req.query.active !== undefined ? _req.query.active === 'true' : undefined;

  //
  const response = await UsersService.list(
    t,
    usersReq,
    page,
    itemsPerPage,
    search,
    type,
    active,
  );

  _res.json(response);
};

export const createUsers = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Body da requisição
  const createUsersDto = _req.body;

  //
  const response = await UsersService.create(t, usersReq, createUsersDto);

  _res.status(201).json(response);
};

export const updateUsers = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const userUuid = _req.query.uuid as string;

  // Body da requisição
  const updateUsersDto = _req.body;

  //
  const response = await UsersService.update(t, usersReq, userUuid, updateUsersDto);

  _res.json(response);
};

export const viewUsers = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const userUuid = _req.query.uuid as string;

  //
  const response = await UsersService.view(t, usersReq, userUuid);

  _res.json(response);
};

export const updatePassword = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const userUuid = _req.query.uuid as string;

  // Body da requisição
  const updatePasswordDto = _req.body;

  //
  const response = await UsersService.updatePassword(t, usersReq, userUuid, updatePasswordDto);

  _res.status(200).json(response);
};

export const resetPassword = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const userUuid = _req.query.uuid as string;

  // Body da requisição
  const resetPasswordDto = _req.body;

  const response = await UsersService.resetPassword(t, usersReq, userUuid, resetPasswordDto);

  _res.status(200).json(response);
};

export const deleteUsers = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const userUuid = _req.query.uuid as string;

  //
  const response = await UsersService.delete(t, usersReq, userUuid);

  _res.status(200).json(response);
};

export const listDeletedUsers = async (_req: Request, _res: Response): Promise<void> => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const page = Number(_req.query.page || 1);
  const itemsPerPage = Number(_req.query.itemsPerPage || 20);
  const search = _req.query.search as string;
  const type = _req.query.type as string;

  //
  const response = await UsersService.listDeleted(t, usersReq, page, itemsPerPage, search, type);

  _res.json(response);
};

export const findUserByEmail = async (_req: Request, _res: Response): Promise<void> => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Query da requisição
  const email = _req.query.email as string;

  //
  const response = await UsersService.findByEmail(t, usersReq, email);

  _res.json(response);
};
