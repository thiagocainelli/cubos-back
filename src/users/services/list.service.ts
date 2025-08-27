import { TFunction } from 'i18next';

// Prisma
import prisma from '../../_core/prisma.pg';
import { Prisma } from '../../../prisma-outputs/postgres-client';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ListUsersDto } from '../dtos/listUsers.dto';
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { UserTypeEnum } from '../enum/userType.enum';
import { isBoolean } from 'class-validator';

export const listUsersService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  page: number,
  itemsPerPage: number,
  search?: string,
  type?: string,
  active?: boolean,
): Promise<ListUsersDto | undefined> => {
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
    deletedAt: null,
    NOT: {
      type: UserTypeEnum.representative,
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

  if (isBoolean(active)) {
    whereClause.AND.push({
      active: active,
    });
  }

  try {
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
      data: usersList.map((usersData) => {
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
      }),
      total: total,
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
