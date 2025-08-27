import { TFunction } from 'i18next';
import prisma from '../../_core/prisma.pg';
import { HttpException } from '../../_common/exceptions/httpException';
import { handlePrismaError } from '../../_common/exceptions/prismaErrorHandler';
import { ReadUsersDto } from '../../users/dtos/readUsers.dto';
import { UploadFileS3DigitalOceanService } from '../../integrations/s3-digitalOcean/s3-digitalOcean.service';

const extractKeyFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const key = urlObj.pathname.substring(1);

    return key;
  } catch (error) {
    throw new HttpException(400, 'URL inválida');
  }
};

export const downloadArchiveOrderService = async (
  t: TFunction,
  usersReq: ReadUsersDto | undefined,
  storageUuid: string,
): Promise<{ fileBuffer: Buffer; fileName: string; mimeType: string } | undefined> => {
  try {
    if (!storageUuid) {
      throw new HttpException(400, 'UUID do storage é obrigatório');
    }

    const storageData = await prisma.orderArquivo.findFirst({
      where: {
        uuid: storageUuid,
      },
    });

    if (!storageData) {
      throw new HttpException(404, 'Arquivo não encontrado');
    }

    const key = extractKeyFromUrl(storageData.urlDownload);
    const fileBuffer = await UploadFileS3DigitalOceanService.downloadFile(key);

    if (!fileBuffer) {
      throw new HttpException(404, 'Arquivo não encontrado no storage');
    }

    return {
      fileBuffer,
      fileName: storageData.nomeArquivo,
      mimeType: storageData.tipoMime || 'application/octet-stream',
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
