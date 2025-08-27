import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientDigitalOceanConstant } from '../constants/s3-digitalOcean.constant';

export const downloadFileDigitalOceanService = async (key: string): Promise<Buffer | null> => {
  try {
    const { s3ClientDigitalOcean, digitalOceanBucket, cdnEndpoint } =
      await s3ClientDigitalOceanConstant();

    if (!s3ClientDigitalOcean || !digitalOceanBucket) {
      throw new HttpException(500, 'Configuração do DigitalOcean não encontrada');
    }

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: digitalOceanBucket,
        Key: key,
      });

      await s3ClientDigitalOcean.send(headCommand);
    } catch (headError: any) {
      throw new HttpException(404, `Arquivo não encontrado no bucket: ${headError.message}`);
    }

    const command = new GetObjectCommand({
      Bucket: digitalOceanBucket,
      Key: key,
    });

    const response = await s3ClientDigitalOcean.send(command);

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
    throw new HttpException(
      500,
      `Erro ao fazer download do arquivo no DigitalOcean Spaces: ${error}`,
    );
  }
};
