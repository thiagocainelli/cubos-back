// Exceptions
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// Prisma
import prisma from '../../_core/prisma.pg';

// DTOs e Enums
import { CreateUsersDto } from '../dtos/createUsers.dto';
import { UserRoleEnum, UserTypeEnum } from '../enum/userType.enum';

// Utils
import { encryptPassword } from '../../_common/utils/crypto.utils';
import { Users } from '../../../prisma-outputs/postgres-client';

export const initSuperAdmin = async (): Promise<void> => {
  const emailSuperAdmin = process.env.DEFAULT_SUPERADMIN_EMAIL;
  const passwordSuperAdmin = process.env.DEFAULT_SUPERADMIN_PASSWORD;

  if (!emailSuperAdmin || !passwordSuperAdmin) {
    throw new HttpException(400, 'Variáveis de ambiente não configuradas');
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: { email: emailSuperAdmin.toLowerCase() },
    });

    const encryptedPassword = encryptPassword(passwordSuperAdmin);

    const superAdminData = {
      name: 'Super Admin',
      email: emailSuperAdmin.toLowerCase(),
      type: UserTypeEnum.superAdmin,
      profileImage: '',
    };

    let user: Users;

    if (existingUser) {
      user = await prisma.users.update({
        where: { email: superAdminData.email },
        data: {
          name: superAdminData.name,
          password: encryptedPassword,
          type: superAdminData.type,
          role: UserRoleEnum[superAdminData.type],
        },
      });
    } else {
      user = await prisma.users.create({
        data: {
          ...superAdminData,
          password: encryptedPassword,
          role: UserRoleEnum[superAdminData.type],
        },
      });
    }
  } catch (error) {
    handlePrismaError(error);
  }
};
