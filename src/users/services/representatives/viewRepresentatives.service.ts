import { TFunction } from 'i18next';
import prisma from '../../../_core/prisma.pg';
import { HttpException } from '../../../_common/exceptions/httpException';
import { handlePrismaError } from '../../../_common/exceptions/prismaErrorHandler';
import { ReadRepresentativesDto } from '../../dtos/representatives/readRepresentatives.dto';

export const viewRepresentativesService = async (
  t: TFunction,
  uuid: string,
): Promise<ReadRepresentativesDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID is required');
  }

  const usersData = await prisma.users.findUnique({
    where: {
      uuid: uuid,
      type: 'representative',
    },
  });

  if (!usersData) {
    throw new HttpException(404, 'Representante não encontrado');
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
};
