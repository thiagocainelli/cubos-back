import { TFunction } from 'i18next';

// Validator
import { isUUID } from 'class-validator';

// Utils
import { comparePassword, encryptPassword } from '../../_common/utils/crypto.utils';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// Prisma
import prisma from '../../_core/prisma.pg';

// DTOs
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto';

export const updatePasswordService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  userUuid: string,
  updatePasswordDto: UpdatePasswordDto,
): Promise<ReadUsersDto | undefined> => {
  if (!userUuid) {
    throw new HttpException(400, 'User UUID is required');
  }
  if (!isUUID(userUuid)) {
    throw new HttpException(400, 'Invalid user UUID');
  }

  const user = await prisma.users.findUnique({
    where: { uuid: userUuid },
    select: { password: true },
  });

  if (!user || !user.password) {
    throw new HttpException(404, 'User not found');
  }

  // Verify if current password matches
  const isPasswordValid = comparePassword(updatePasswordDto.currentPassword, user.password);
  if (!isPasswordValid) {
    throw new HttpException(401, 'Current password is incorrect');
  }

  // Encrypt new password
  const encryptedPassword = encryptPassword(updatePasswordDto.newPassword);

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
