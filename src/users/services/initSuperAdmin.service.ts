import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';
import prisma from '../../_core/prisma.pg';
import { UserTypeEnum } from '../enum/userType.enum';
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
      where: { email: emailSuperAdmin.toLowerCase(), deletedAt: null },
    });

    const encryptedPassword = encryptPassword(passwordSuperAdmin);

    const superAdminData = {
      name: 'Super Admin',
      email: emailSuperAdmin.toLowerCase(),
      type: UserTypeEnum.superAdmin,
    };

    let user: Users | null;

    if (existingUser) {
      user = await prisma.users.update({
        where: { email: superAdminData.email },
        data: {
          name: superAdminData.name,
          password: encryptedPassword,
          type: superAdminData.type,
        },
      });
    } else {
      user = await prisma.users.create({
        data: {
          ...superAdminData,
          password: encryptedPassword,
        },
      });
    }
  } catch (error) {
    handlePrismaError(error);
  }
};
