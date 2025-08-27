import { v4 as uuidv4 } from 'uuid';
import prisma from '../../_core/prisma.pg';
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';
import { ReadStorageDto } from '../dtos/readStorage.dto';
import { CreateStorageDto } from '../dtos/createStorage.dto';

import { UploadFileS3DigitalOceanService } from '../../integrations/s3-digitalOcean/s3-digitalOcean.service';

export const createStorageService = async (
  createStorageDto: CreateStorageDto,
  file: Express.Multer.File,
): Promise<ReadStorageDto | undefined> => {
  try {
    if (!file) {
      throw new HttpException(400, 'Arquivo é obrigatório');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = file.originalname.split('.').shift();
    const uniqueFileName = `${uuidv4()}_${fileName}.${fileExtension}`;

    const path = createStorageDto.type || 'general';

    const uploadResult = await UploadFileS3DigitalOceanService.uploadFile(
      uniqueFileName,
      file,
      false, // privateArchive = false
      path,
    );

    // Criar registro no banco de dados
    const storageData = await prisma.storage.create({
      data: {
        name: file.originalname,
        key: uploadResult.key,
        mimetype: file.mimetype,
        type: createStorageDto.type,
        url: uploadResult.url,
      },
    });

    if (!storageData) {
      throw new HttpException(400, 'Erro ao criar storage');
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
