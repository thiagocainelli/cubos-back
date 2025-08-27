import { TFunction } from 'i18next';

// Validator
import { isUUID } from 'class-validator';

// Utils
import { encryptPassword } from '../../_common/utils/crypto.utils';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// Prisma
import prisma from '../../_core/prisma.pg';

// DTOs
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { ResetPasswordDto } from '../dtos/resetPassword.dto';

export const resetPasswordService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  userUuid: string,
  resetPasswordDto: ResetPasswordDto,
): Promise<ReadUsersDto | undefined> => {
  if (!userUuid) {
    throw new HttpException(400, 'User UUID is required');
  }
  if (!isUUID(userUuid)) {
    throw new HttpException(400, 'Invalid user UUID');
  }

  const user = await prisma.users.findUnique({
    where: { uuid: userUuid },
  });

  if (!user) {
    throw new HttpException(404, 'User not found');
  }

  // Encrypt new password
  const encryptedPassword = encryptPassword(resetPasswordDto.newPassword);

  // Update password
  try {
    const usersData = await prisma.users.update({
      where: { uuid: userUuid },
      data: { password: encryptedPassword },
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
