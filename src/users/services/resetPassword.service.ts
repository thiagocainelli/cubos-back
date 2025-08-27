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
  userUuid: string,
  resetPasswordDto: ResetPasswordDto,
): Promise<ReadUsersDto | undefined> => {
  if (!userUuid) {
    throw new HttpException(400, 'UUID do usuário é obrigatório');
  }
  if (!isUUID(userUuid)) {
    throw new HttpException(400, 'UUID do usuário inválido');
  }

  const user = await prisma.users.findUnique({
    where: { uuid: userUuid, deletedAt: null },
  });

  if (!user) {
    throw new HttpException(404, 'Usuário não encontrado');
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
