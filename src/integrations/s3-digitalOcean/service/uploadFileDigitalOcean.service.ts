import { PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { HttpException } from '../../../_common/exceptions/httpException';
import { s3ClientDigitalOceanConstant } from '../constants/s3-digitalOcean.constant';

const getFileUrl = (filename: string, digitalOceanBucket: string, cdnEndpoint: string): string => {
  return `${cdnEndpoint}/${filename}`;
};

export const uploadFileDigitalOceanService = async (
  filename: string,
  file: Express.Multer.File,
  privateArchive: boolean,
  path?: string,
): Promise<{
  key: string;
  url: string;
}> => {
  try {
    const { s3ClientDigitalOcean, digitalOceanBucket, cdnEndpoint } =
      await s3ClientDigitalOceanConstant();

    if (!s3ClientDigitalOcean || !digitalOceanBucket || !cdnEndpoint) {
      throw new HttpException(
        400,
        'Not all environment variables are set for DigitalOcean Spaces.',
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

    const key = privateArchive
      ? path
        ? `private/${path}/${filename}`
        : `private/${filename}`
      : path
        ? `public/${path}/${filename}`
        : `public/${filename}`;

    const params: any = {
      Bucket: digitalOceanBucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: contentDisposition,
    };

    if (!privateArchive) {
      params.ACL = 'public-read' as ObjectCannedACL;
    }

    const command = new PutObjectCommand(params);
    await s3ClientDigitalOcean.send(command);

    const url = getFileUrl(key, digitalOceanBucket, cdnEndpoint);

    if (!url || !key) {
      throw new HttpException(400, 'Erro ao gerar URL do arquivo');
    }

    return {
      key: key,
      url: url,
    };
  } catch (error) {
    throw new HttpException(400, `Error uploading file to AWS S3, ${error}`);
  }
};
