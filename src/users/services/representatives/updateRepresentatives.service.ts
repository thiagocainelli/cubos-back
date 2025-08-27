import { TFunction } from 'i18next';
import { isUUID } from 'class-validator';
import prisma from '../../../_core/prisma.pg';
import { HttpException } from '../../../_common/exceptions/httpException';
import { handlePrismaError } from '../../../_common/exceptions/prismaErrorHandler';
import { ReadRepresentativesDto } from '../../dtos/representatives/readRepresentatives.dto';
import { UpdateRepresentativesDto } from '../../dtos/representatives/updateRepresentatives.dto';
import { UserRoleEnum } from '../../enum/userType.enum';

export const updateRepresentativesService = async (
  t: TFunction,
  uuid: string,
  updateRepresentativesDto: UpdateRepresentativesDto,
): Promise<ReadRepresentativesDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID is required');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'Invalid UUID');
  }

  const checkUser = await prisma.users.findUnique({
    where: {
      email: updateRepresentativesDto.email,
    },
  });

  if (checkUser && checkUser.uuid !== uuid) {
    throw new HttpException(400, 'Email já cadastrado');
  }

  try {
    const usersData = await prisma.users.update({
      where: { uuid },
      data: {
        ...updateRepresentativesDto,
        role: UserRoleEnum.representative,
        type: 'representative',
      },
    });

    if (!usersData) {
      throw new HttpException(400, 'Erro ao atualizar representante');
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
