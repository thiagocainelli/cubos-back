import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ReadUserForDecoratorDto } from '../../users/dtos/read-user-for-decorator.dto';

export const login = async (_req: Request, _res: Response) => {
  const loginDto = _req.body;
  const response = await AuthService.login(loginDto);

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
    createdAt: usersReq.createdAt,
    updatedAt: usersReq.updatedAt,
    deletedAt: usersReq.deletedAt,
  };

  _res.status(200).json(usersData);
};

export const refreshToken = async (_req: Request, _res: Response): Promise<void> => {
  const refreshTokenAuthDto = _req.body;
  const response = await AuthService.refreshToken(refreshTokenAuthDto);

  _res.status(201).json(response);
};

export const register = async (_req: Request, _res: Response) => {
  const registerDto = _req.body;
  const response = await AuthService.register(registerDto);

  _res.status(201).json(response);
};
