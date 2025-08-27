import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTO
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { isUUID } from 'class-validator';

export const deleteUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  uuid: string,
): Promise<ReadUsersDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID is required');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'Invalid UUID');
  }

  const existingUser = await prisma.users.findFirst({
    where: {
      uuid,
      deletedAt: null,
    },
  });

  if (!existingUser) {
    throw new HttpException(404, 'User not found or already deleted');
  }

  try {
    const usersData = await prisma.users.update({
      where: { uuid: uuid },
      data: { deletedAt: new Date() },
    });

    if (!usersData) {
      throw new HttpException(404, 'User not found');
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
