// Validator
import { isUUID } from 'class-validator';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// Prisma
import prisma from '../../_core/prisma.pg';

import { ReadUsersDto } from '../dtos/readUsers.dto';
import { UpdateUsersDto } from '../dtos/updateUsers.dto';

export const updateUsersService = async (
  uuid: string,
  updateUsersDto: UpdateUsersDto,
): Promise<ReadUsersDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID do usuário é obrigatório');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'UUID do usuário inválido');
  }

  const checkUser = await prisma.users.findUnique({
    where: {
      email: updateUsersDto.email,
      deletedAt: null,
    },
  });

  if (checkUser && checkUser.uuid !== uuid) {
    throw new HttpException(400, 'Email já cadastrado');
  }

  try {
    const usersData = await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        ...updateUsersDto,
      },
    });

    if (!usersData) {
      throw new HttpException(400, 'Erro ao atualizar usuário');
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
