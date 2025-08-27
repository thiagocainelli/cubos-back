import { TFunction } from 'i18next';
import { isUUID } from 'class-validator';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ReadUsersDto } from '../../users/dtos/readUsers.dto';
import { ReadStorageDto } from '../dtos/readStorage.dto';

export const viewStorageService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  uuid: string,
): Promise<ReadStorageDto | undefined> => {
  try {
    if (!uuid) {
      throw new HttpException(400, 'UUID is required');
    }
    if (!isUUID(uuid)) {
      throw new HttpException(400, 'Invalid UUID');
    }

    const storageData = await prisma.storage.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!storageData) {
      throw new HttpException(404, 'Storage not found');
    }

    return <ReadStorageDto>{
      uuid: storageData.uuid,
      name: storageData.name,
      key: storageData.key,
      mimetype: storageData.mimetype || undefined,
      type: storageData.type || undefined,
      url: storageData.url || undefined,
      createdAt: storageData.createdAt,
      updatedAt: storageData.updatedAt,
      deletedAt: storageData.deletedAt || undefined,
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
