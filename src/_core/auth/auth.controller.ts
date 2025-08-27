import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ReadUserForDecoratorDto } from '../../users/dtos/read-user-for-decorator.dto';

export const login = async (_req: Request, _res: Response) => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Body da requisição
  const loginDto = _req.body;

  //
  const response = await AuthService.login(t, usersReq, loginDto);

  _res.status(201).json(response);
};

export const verifyToken = async (_req: Request, _res: Response): Promise<void> => {
  const usersReq = (_req as any).usersReq;

  if (!usersReq) {
    _res.status(401).json({ message: 'Invalid token' });
    return;
  }

  const usersData: ReadUserForDecoratorDto = {
    uuid: usersReq.uuid,
    name: usersReq.name,
    email: usersReq.email,
    type: usersReq.type,
    active: usersReq.active,
    profileImage: usersReq.profileImage,
    createdAt: usersReq.createdAt,
    updatedAt: usersReq.updatedAt,
    deletedAt: usersReq.deletedAt,
  };

  _res.status(200).json(usersData);
};

export const refreshToken = async (_req: Request, _res: Response): Promise<void> => {
  const t = _req.t;
  const usersReq = _req.usersReq;

  // Body da requisição
  const refreshTokenAuthDto = _req.body;

  //
  const response = await AuthService.refreshToken(t, usersReq, refreshTokenAuthDto);

  _res.status(201).json(response);
};
