import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { isEmail } from 'class-validator';

export const findByEmailUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  email: string,
): Promise<ReadUsersDto | undefined> => {
  try {
    if (!email) {
      throw new HttpException(400, 'Email is required');
    }
    if (!isEmail(email)) {
      throw new HttpException(400, 'Invalid email');
    }

    const usersData = await prisma.users.findUnique({
      where: {
        email: email,
      },
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
