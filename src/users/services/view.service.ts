import prisma from '../../_core/prisma.pg';
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { isUUID } from 'class-validator';

export const viewUsersService = async (uuid: string): Promise<ReadUsersDto | undefined> => {
  try {
    if (!uuid) {
      throw new HttpException(400, 'UUID do usuário é obrigatório');
    }
    if (!isUUID(uuid)) {
      throw new HttpException(400, 'UUID do usuário inválido');
    }

    const usersData = await prisma.users.findUnique({
      where: {
        uuid: uuid,
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
