import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientCloudflareR2Constant } from '../constants/s3-r2.constant';

export const downloadFileCloudflareR2Service = async (key: string): Promise<Buffer | null> => {
  try {
    const { s3ClientR2, r2Bucket, cdnEndpoint } = await s3ClientCloudflareR2Constant();

    if (!s3ClientR2 || !r2Bucket) {
      throw new HttpException(
        500,
        'Configuração do Cloudflare R2 não encontrada. Contacte o administrador do sistema.',
      );
    }

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: r2Bucket,
        Key: key,
      });

      await s3ClientR2.send(headCommand);
    } catch (headError: any) {
      throw new HttpException(404, `Arquivo não encontrado no bucket: ${headError.message}`);
    }

    const command = new GetObjectCommand({
      Bucket: r2Bucket,
      Key: key,
    });

    const response = await s3ClientR2.send(command);

    if (!response.Body) {
      return null;
    }

    // Converter o stream para Buffer

    const chunks: Uint8Array[] = [];
    const stream = response.Body as any;

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);

        resolve(buffer);
      });

      stream.on('error', (error: Error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new HttpException(500, `Erro ao fazer download do arquivo no Cloudflare R2: ${error}`);
  }
};
