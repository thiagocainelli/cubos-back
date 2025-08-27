import { TFunction } from 'i18next';
import prisma from '../../../_core/prisma.pg';
import { HttpException } from '../../../_common/exceptions/httpException';
import { handlePrismaError } from '../../../_common/exceptions/prismaErrorHandler';
import { ListRepresentativesDto } from '../../dtos/representatives/listRepresentatives.dto';
import { ReadRepresentativesDto } from '../../dtos/representatives/readRepresentatives.dto';

export const listRepresentativesService = async (
  t: TFunction,
  page: number,
  itemsPerPage: number,
  search?: string,
): Promise<ListRepresentativesDto | undefined> => {
  if (!page) {
    throw new HttpException(400, 'Page is required');
  }
  if (!itemsPerPage) {
    throw new HttpException(400, 'Items per page is required');
  }

  const skip = Number((page - 1) * itemsPerPage);
  const take = Number(itemsPerPage);

  const whereClause: any = {
    AND: [{ type: 'representative' }, { deletedAt: null }],
  };

  if (search) {
    whereClause.AND.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { documentNumber: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  try {
    const total = await prisma.users.count({ where: whereClause });
    const usersList = await prisma.users.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: whereClause,
      skip: skip,
      take: take,
    });

    return <ListRepresentativesDto>{
      data: usersList.map(
        (usersData) =>
          <ReadRepresentativesDto>{
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
          },
      ),
      total: total,
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
