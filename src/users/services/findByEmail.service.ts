import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { isEmail } from 'class-validator';

export const findByEmailUsersService = async (email: string): Promise<ReadUsersDto | undefined> => {
  try {
    if (!email) {
      throw new HttpException(400, 'Email é obrigatório');
    }
    if (!isEmail(email)) {
      throw new HttpException(400, 'Email inválido');
    }

    const usersData = await prisma.users.findUnique({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (!usersData) {
      throw new HttpException(404, 'Usuário não encontrado');
    }

    return <ReadUsersDto>{
      uuid: usersData.uuid,
      name: usersData.name,
      email: usersData.email,
      type: usersData.type,
      createdAt: usersData.createdAt,
      updatedAt: usersData.updatedAt,
      deletedAt: usersData.deletedAt,
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
