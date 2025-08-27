import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientDigitalOceanConstant } from '../constants/s3-digitalOcean.constant';

export const checkFileExistsDigitalOceanService = async (key: string): Promise<boolean> => {
  try {
    const { s3ClientDigitalOcean, digitalOceanBucket, cdnEndpoint } =
      await s3ClientDigitalOceanConstant();

    if (s3ClientDigitalOcean && digitalOceanBucket && cdnEndpoint) {
      const params = {
        Bucket: digitalOceanBucket,
        Key: key,
      };

      await s3ClientDigitalOcean.send(new HeadObjectCommand(params));
      return true;
    }

    return false;
  } catch (error) {
    if ((error as { name: string }).name === 'NotFound') {
      return false;
    }

    throw new HttpException(
      500,
      `Erro ao verificar existência de arquivo no DigitalOcean Spaces: ${error}`,
    );
  }
};
