// Prisma
import prisma from '../../prisma.pg';

// HttpException
import { HttpException } from '../../../_common/exceptions/httpException';

// Utils
import { comparePassword } from '../../../_common/utils/crypto.utils';
import { generateJwtToken, generateRefreshJwtToken } from '../../../_common/utils/jwt.utils';

// DTOs
import { ReadLoginResponseDto } from '../dtos/readLoginResponse.dto';
import { ReadUsersDto } from '../../../users/dtos/readUsers.dto';
import { LoginDto } from '../dtos/login.dto';

export const loginService = async (
  loginDto: LoginDto,
): Promise<ReadLoginResponseDto | undefined> => {
  const usersData = await prisma.users.findUnique({ where: { email: loginDto.email } });

  if (!usersData) {
    throw new HttpException(404, 'Usuário não encontrado');
  }

  if (!usersData.password) {
    throw new HttpException(401, 'Credenciais inválidas');
  }

  const passwordMatch = comparePassword(loginDto.password, usersData.password);

  if (!passwordMatch) {
    throw new HttpException(401, 'Credenciais inválidas');
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
