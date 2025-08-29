// Prisma
import prisma from '../../prisma.pg';

// HttpException
import { HttpException } from '../../../_common/exceptions/httpException';

// Utils
import { encryptPassword } from '../../../_common/utils/crypto.utils';

// DTOs
import { ReadUsersDto } from '../../../users/dtos/readUsers.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserTypeEnum } from '../../../users/enum/userType.enum';

export const registerService = async (
  registerDto: RegisterDto,
): Promise<ReadUsersDto | undefined> => {
  const existingUser = await prisma.users.findUnique({
    where: { email: registerDto.email },
  });

  if (existingUser) {
    throw new HttpException(400, 'Usuário já existente no sistema. Por favor, tente outro email.');
  }

  if (!registerDto.password) {
    throw new HttpException(400, 'Senha não informada. Por favor, tente novamente.');
  }

  const hashedPassword = encryptPassword(registerDto.password);

  const usersData = await prisma.users.create({
    data: {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      type: UserTypeEnum.users,
    },
  });

  return <ReadUsersDto>{
    uuid: usersData.uuid,
    name: usersData.name,
    email: usersData.email,
    type: usersData.type,
    createdAt: usersData.createdAt,
    updatedAt: usersData.updatedAt,
    deletedAt: usersData.deletedAt,
  };
};
