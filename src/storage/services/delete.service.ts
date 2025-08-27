import { isUUID } from 'class-validator';
import prisma from '../../_core/prisma.pg';
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

import { ReadStorageDto } from '../dtos/readStorage.dto';

export const deleteStorageService = async (uuid: string): Promise<ReadStorageDto | undefined> => {
  if (!uuid) {
    throw new HttpException(400, 'UUID do arquivo é obrigatório');
  }
  if (!isUUID(uuid)) {
    throw new HttpException(400, 'UUID do arquivo é inválido');
  }

  const existingStorage = await prisma.storage.findFirst({
    where: {
      uuid,
      deletedAt: null,
    },
  });

  if (!existingStorage) {
    throw new HttpException(404, 'Arquivo não encontrado ou já deletado');
  }

  try {
    const storageData = await prisma.storage.update({
      where: { uuid: uuid },
      data: { deletedAt: new Date() },
    });

    if (!storageData) {
      throw new HttpException(404, 'Arquivo não encontrado');
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
