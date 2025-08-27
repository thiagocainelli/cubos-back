// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ListUsersDto } from '../dtos/listUsers.dto';
import { ReadUsersDto } from '../dtos/readUsers.dto';
import { UserTypeEnum } from '../enum/userType.enum';
import { Prisma } from '../../../prisma-outputs/postgres-client';

export const listUsersService = async (
  page: number,
  itemsPerPage: number,
  search?: string,
  type?: string,
): Promise<ListUsersDto | undefined> => {
  if (!page) {
    throw new HttpException(400, 'Página é obrigatória');
  }
  if (!itemsPerPage) {
    throw new HttpException(400, 'Itens por página é obrigatório');
  }

  const skip = Number((page - 1) * itemsPerPage);
  const take = Number(itemsPerPage);

  const whereClause: Prisma.UsersWhereInput = {
    AND: [],
    deletedAt: null,
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

  try {
    const total = await prisma.users.count({
      where: whereClause,
    });

    const usersList = await prisma.users.findMany({
      orderBy: [
        {
          name: 'asc',
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
          name: usersData.name,
          email: usersData.email,
          type: usersData.type,
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
