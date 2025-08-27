import { PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientCloudflareR2Constant } from '../constants/s3-r2.constant';

const getFileUrl = (key: string, cdnEndpoint: string): string => {
  return `${cdnEndpoint}/${key}`;
};

export const uploadFileCloudflareR2Service = async (
  filename: string,
  file: Express.Multer.File,
  path?: string,
): Promise<{
  key: string;
  url: string;
}> => {
  try {
    const { s3ClientR2, r2Bucket, cdnEndpoint } = await s3ClientCloudflareR2Constant();

    if (!s3ClientR2 || !r2Bucket || !cdnEndpoint) {
      throw new HttpException(
        400,
        'Configurações do Cloudflare R2 não encontradas. Contacte o administrador do sistema.',
      );
    }

    const contentType = file.mimetype;
    let contentDisposition: string | undefined = undefined;

    if (contentType === 'application/pdf') {
      contentDisposition = 'inline; filename="' + filename + '"';
    }

    if (contentType.startsWith('image/')) {
      contentDisposition = 'inline';
    }

    const key = `${path}/${filename}`;

    const params: any = {
      Bucket: r2Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: contentDisposition,
    };

    const command = new PutObjectCommand(params);
    await s3ClientR2.send(command);

    const url = getFileUrl(key, cdnEndpoint);

    if (!url || !key) {
      throw new HttpException(
        400,
        'Erro ao gerar URL do arquivo. Contacte o administrador do sistema.',
      );
    }

    return {
      key: key,
      url: url,
    };
  } catch (error) {
    throw new HttpException(
      400,
      `Erro ao fazer upload do arquivo no Cloudflare R2: ${error}. Contacte o administrador do sistema.`,
    );
  }
};
