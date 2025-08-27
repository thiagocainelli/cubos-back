import { TFunction } from 'i18next';
import { isUUID } from 'class-validator';

// Prisma
import prisma from '../../_core/prisma.pg';

// HttpException
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

// DTOs
import { ReadStorageDto } from '../dtos/readStorage.dto';
import { ReadUsersDto } from '../../users/dtos/readUsers.dto';

export const deleteStorageService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  uuid: string,
): Promise<ReadStorageDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID is required');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'Invalid UUID');
  }

  const existingStorage = await prisma.storage.findFirst({
    where: {
      uuid,
      deletedAt: null,
    },
  });

  if (!existingStorage) {
    throw new HttpException(404, 'Storage not found or already deleted');
  }

  try {
    const storageData = await prisma.storage.update({
      where: { uuid: uuid },
      data: { deletedAt: new Date() },
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
