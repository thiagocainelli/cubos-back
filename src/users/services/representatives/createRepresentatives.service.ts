import { TFunction } from 'i18next';

import { HttpException } from '../../../_common/exceptions/httpException';
import { handlePrismaError } from '../../../_common/exceptions/prismaErrorHandler';
import prisma from '../../../_core/prisma.pg';

import { ReadRepresentativesDto } from '../../dtos/representatives/readRepresentatives.dto';
import { CreateRepresentativesDto } from '../../dtos/representatives/createRepresentatives.dto';
import { UserRoleEnum } from '../../enum/userType.enum';
import { encryptPassword } from '../../../_common/utils/crypto.utils';

export const createRepresentativesService = async (
  t: TFunction,
  createRepresentativesDto: CreateRepresentativesDto,
): Promise<ReadRepresentativesDto | undefined> => {
  const checkUser = await prisma.users.findUnique({
    where: {
      email: createRepresentativesDto.email,
    },
  });

  const checkDocumentNumber = await prisma.users.findUnique({
    where: {
      documentNumber: createRepresentativesDto.documentNumber,
    },
  });

  const checkCode = await prisma.users.findUnique({
    where: {
      code: createRepresentativesDto.code,
    },
  });

  if (checkUser) {
    throw new HttpException(400, 'Email já cadastrado');
  }

  if (checkDocumentNumber) {
    throw new HttpException(400, 'CPF/CNPJ já cadastrado');
  }

  if (checkCode) {
    throw new HttpException(400, 'Já existe um representante com este código');
  }

  const encryptedPassword = encryptPassword(createRepresentativesDto.password);

  try {
    const usersData = await prisma.users.create({
      data: {
        ...createRepresentativesDto,
        password: encryptedPassword,
        role: UserRoleEnum.representative,
        type: 'representative',
      },
    });

    if (!usersData) {
      throw new HttpException(400, 'Erro ao criar representante');
    }

    return <ReadRepresentativesDto>{
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
      code: usersData.code,
      documentNumber: usersData.documentNumber,
      phoneNumber: usersData.phoneNumber,
      region: usersData.region,
      representativeType: usersData.representativeType,
      observations: usersData.observations,
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
