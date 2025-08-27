// Prisma
import prisma from '../../prisma.pg';

// HttpException
import { HttpException } from '../../../_common/exceptions/httpException';

// Utils
import {
  generateJwtToken,
  generateRefreshJwtToken,
  verifyRefreshJwtToken,
} from '../../../_common/utils/jwt.utils';

// DTOs
import { ReadLoginResponseDto } from '../dtos/readLoginResponse.dto';
import { ReadUsersDto } from '../../../users/dtos/readUsers.dto';

import { RefreshTokenAuthDto } from '../dtos/refresh-token-auth.dto';

export const refreshTokenService = async (
  refreshTokenAuthDto: RefreshTokenAuthDto,
): Promise<ReadLoginResponseDto | undefined> => {
  if (!refreshTokenAuthDto.refreshToken) {
    throw new HttpException(401, 'Token inválido');
  }

  const decoded = verifyRefreshJwtToken(refreshTokenAuthDto.refreshToken);
  const userUuid = decoded.sub as string;

  if (!userUuid) {
    throw new HttpException(401, 'Token inválido');
  }

  const usersData = await prisma.users.findUnique({ where: { uuid: userUuid } });

  if (!usersData) {
    throw new HttpException(404, 'Usuário não encontrado');
  }

  const token = generateJwtToken({ sub: usersData.uuid });
  const refreshToken = generateRefreshJwtToken({ sub: usersData.uuid });

  if (!token || !refreshToken) {
    throw new HttpException(500, 'Erro ao gerar token');
  }

  return <ReadLoginResponseDto>{
    token: token,
    refreshToken: refreshToken,
    usersData: <ReadUsersDto>{
      uuid: usersData.uuid,
      name: usersData.name,
      email: usersData.email,
      type: usersData.type,
      createdAt: usersData.createdAt,
      updatedAt: usersData.updatedAt,
      deletedAt: usersData.deletedAt,
    },
  };
};
