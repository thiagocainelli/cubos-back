import { TFunction } from 'i18next';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// Prisma
import prisma from '../../_core/prisma.pg';

// DTO
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { CreateUsersDto } from '../dtos/createUsers.dto';
import { UserRoleEnum } from '../enum/userType.enum';

// Utils
import { encryptPassword } from '../../_common/utils/crypto.utils';
import { generateRandomPassword } from '../../_common/utils/generateRandomPassword';

export const createUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  createUsersDto: CreateUsersDto,
): Promise<ReadUsersDto | undefined> => {
  const checkUser = await prisma.users.findUnique({
    where: {
      email: createUsersDto.email,
    },
  });

  const checkEmail = await prisma.users.findUnique({
    where: {
      email: createUsersDto.email,
    },
  });

  if (checkUser) {
    throw new HttpException(400, 'Email já cadastrado');
  }

  if (checkEmail) {
    throw new HttpException(400, 'Já existe um usuário com este email');
  }

  const encryptedPassword = encryptPassword(createUsersDto.password);

  try {
    const usersData = await prisma.users.create({
      data: {
        ...createUsersDto,
        password: encryptedPassword,
        role: UserRoleEnum[createUsersDto.type],
      },
    });

    if (!usersData) {
      throw new HttpException(400, 'Erro ao criar usuário');
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
