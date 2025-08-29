import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';
import prisma from '../../_core/prisma.pg';
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { CreateUsersDto } from '../dtos/createUsers.dto';
import { encryptPassword } from '../../_common/utils/crypto.utils';

export const createUsersService = async (
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
      },
    });

    if (!usersData) {
      throw new HttpException(400, 'Erro ao criar usuário');
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
