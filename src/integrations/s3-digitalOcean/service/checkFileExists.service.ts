import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientCloudflareR2Constant } from '../constants/s3-r2.constant';

export const checkFileExistsCloudflareR2Service = async (key: string): Promise<boolean> => {
  try {
    const { s3ClientR2, r2Bucket, cdnEndpoint } = await s3ClientCloudflareR2Constant();

    if (s3ClientR2 && r2Bucket && cdnEndpoint) {
      const params = {
        Bucket: r2Bucket,
        Key: key,
      };

      await s3ClientR2.send(new HeadObjectCommand(params));
      return true;
    }

    return false;
  } catch (error) {
    if ((error as { name: string }).name === 'NotFound') {
      return false;
    }

    throw new HttpException(
      500,
      `Erro ao verificar existência de arquivo no Cloudflare R2: ${error}`,
    );
  }
};
