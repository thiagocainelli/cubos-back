import { Request, Response, NextFunction } from 'express';

// Prisma
import prisma from '../prisma.pg';

// DTOs
import { ReadUsersDto } from '../../users/dtos/readUsers.dto';

// JWT
import { verifyJwtToken } from '../../_common/utils/jwt.utils';

// Exceptions
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

    const usersData = await prisma.users.findUnique({ where: { uuid: userUuid } });

    if (!usersData) {
      throw new HttpException(401, 'Usuário não encontrado');
    }

    if (!usersData.active) {
      throw new HttpException(401, 'Usuário não está ativo');
    }

    _req.usersReq = <ReadUsersDto>{
      uuid: usersData.uuid,
      IDFUNC: usersData.IDFUNC,
      name: usersData.name,
      email: usersData.email,
      type: usersData.type,
      active: usersData.active,
      profileImage: usersData.profileImage,
      createdAt: usersData.createdAt,
      updatedAt: usersData.updatedAt,
      deletedAt: usersData.deletedAt,
    };

    next();
  } catch (err) {
    throw new HttpException(401, 'Token inválido ou expirado');
  }
};
