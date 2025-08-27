import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';

// DTOs
import { ListUsersDto } from '../dtos/listUsers.dto';
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { Prisma } from '../../../prisma-outputs/postgres-client';
import { UserTypeEnum } from '../enum/userType.enum';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

export const listDeletedUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  page: number,
  itemsPerPage: number,
  search?: string,
  type?: string,
): Promise<ListUsersDto | undefined> => {
  try {
    if (!page) {
      throw new HttpException(400, 'Page is required');
    }
    if (!itemsPerPage) {
      throw new HttpException(400, 'Items per page is required');
    }

    const skip = Number((page - 1) * itemsPerPage);
    const take = Number(itemsPerPage);

    const whereClause: Prisma.UsersWhereInput = {
      AND: [],
      deletedAt: {
        not: null,
      },
    };
    whereClause.AND = [];

    if (search) {
      whereClause.AND.push({
        OR: [
          { name: { contains: search || '', mode: 'insensitive' } },
          { email: { contains: search || '', mode: 'insensitive' } },
          //
        ],
      });
    }

    if (type && Object.values(UserTypeEnum).includes(type as UserTypeEnum)) {
      whereClause.AND.push({
        type: type as UserTypeEnum,
      });
    }

    const total = await prisma.users.count({
      where: whereClause,
    });

    const usersList = await prisma.users.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: whereClause,
      skip: skip,
      take: take,
    });

    return <ListUsersDto>{
      data: usersList.map(
        (usersData) =>
          <ReadUsersDto>{
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
          },
      ),
      total,
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
