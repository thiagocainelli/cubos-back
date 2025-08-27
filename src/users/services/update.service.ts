import { TFunction } from 'i18next';

// Validator
import { isUUID } from 'class-validator';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// Prisma
import prisma from '../../_core/prisma.pg';

// DTOs e Enums
import { UserRoleEnum } from '../enum/userType.enum';
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { UpdateUsersDto } from '../dtos/updateUsers.dto';

export const updateUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  uuid: string,
  updateUsersDto: UpdateUsersDto,
): Promise<ReadUsersDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID is required');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'Invalid UUID');
  }

  const checkUser = await prisma.users.findUnique({
    where: {
      email: updateUsersDto.email,
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
        role: UserRoleEnum[updateUsersDto.type],
      },
    });

    if (!usersData) {
      throw new HttpException(400, 'Erro ao atualizar usuário');
    }

    return <ReadUsersDto>{
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
  } catch (error) {
    handlePrismaError(error);
  }
};
