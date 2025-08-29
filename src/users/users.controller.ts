import { Request, Response } from 'express';
import { UsersService } from './users.service';

export const createUsers = async (_req: Request, _res: Response) => {
  const createUsersDto = _req.body;
  const response = await UsersService.create(createUsersDto);

  _res.status(201).json(response);
};

export const viewUsers = async (_req: Request, _res: Response) => {
  const userUuid = _req.query.uuid as string;
  const response = await UsersService.view(userUuid);

  _res.json(response);
};
