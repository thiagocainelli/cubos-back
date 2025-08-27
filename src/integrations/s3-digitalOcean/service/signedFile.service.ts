import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientDigitalOceanConstant } from '../constants/s3-digitalOcean.constant';

export const signedFileDigitalOceanService = async (key: string): Promise<string | null> => {
  try {
    const { s3ClientDigitalOcean, digitalOceanBucket, cdnEndpoint } =
      await s3ClientDigitalOceanConstant();

    if (!s3ClientDigitalOcean || !digitalOceanBucket || !cdnEndpoint) {
      return null;
    }

    const params = {
      Bucket: digitalOceanBucket,
      Key: key,
    };

    return await getSignedUrl(s3ClientDigitalOcean, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  } catch (error) {
    throw new HttpException(400, `There was a problem opening the file: ${error}`);
  }
};
