import { isUUID } from 'class-validator';
import prisma from '../../_core/prisma.pg';
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';

import { ReadStorageDto } from '../dtos/readStorage.dto';

export const viewStorageService = async (uuid: string): Promise<ReadStorageDto | undefined> => {
  try {
    if (!uuid) {
      throw new HttpException(400, 'UUID do arquivo é obrigatório');
    }
    if (!isUUID(uuid)) {
      throw new HttpException(400, 'UUID do arquivo é inválido');
    }

    const storageData = await prisma.storage.findUnique({
      where: {
        uuid: uuid,
        deletedAt: null,
      },
    });

    if (!storageData) {
      throw new HttpException(404, 'Arquivo não encontrado ou já deletado');
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
