import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma.pg';
import { ReadUsersDto } from '../../users/dtos/readUsers.dto';
import { verifyJwtToken } from '../../_common/utils/jwt.utils';
import { HttpException } from '../../_common/exceptions/httpException';

// Middleware de autenticação
export const authenticateJWT = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = _req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpException(401, 'Token inválido');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJwtToken(token);
    const userUuid = decoded.sub as string;

    if (!userUuid) {
      throw new HttpException(401, 'Token inválido ou expirado');
    }

    const usersData = await prisma.users.findUnique({
      where: { uuid: userUuid, deletedAt: null },
    });

    if (!usersData) {
      throw new HttpException(401, 'Usuário não encontrado ou foi deletado');
    }

    _req.usersReq = <ReadUsersDto>{
      uuid: usersData.uuid,
      name: usersData.name,
      email: usersData.email,
      type: usersData.type,
      createdAt: usersData.createdAt,
      updatedAt: usersData.updatedAt,
      deletedAt: usersData.deletedAt,
    };

    next();
  } catch (err) {
    if (err instanceof HttpException) {
      throw err;
    }
    throw new HttpException(401, 'Token inválido ou expirado');
  }
};
