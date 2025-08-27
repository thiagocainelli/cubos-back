import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTO
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { isUUID } from 'class-validator';

export const deleteUsersService = async (uuid: string): Promise<ReadUsersDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID é obrigatório');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'UUID inválido');
  }

  const existingUser = await prisma.users.findFirst({
    where: {
      uuid,
      deletedAt: null,
    },
  });

  if (!existingUser) {
    throw new HttpException(404, 'Usuário não encontrado ou já deletado');
  }

  try {
    const usersData = await prisma.users.update({
      where: { uuid: uuid },
      data: { deletedAt: new Date() },
    });

    if (!usersData) {
      throw new HttpException(404, 'Erro ao deletar usuário');
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
