import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { isUUID } from 'class-validator';

export const viewUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  uuid: string,
): Promise<ReadUsersDto | undefined> => {
  try {
    if (!uuid) {
      throw new HttpException(400, 'UUID is required');
    }
    if (!isUUID(uuid)) {
      throw new HttpException(400, 'Invalid UUID');
    }

    const usersData = await prisma.users.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!usersData) {
      throw new HttpException(404, 'Usuário não encontrado');
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
