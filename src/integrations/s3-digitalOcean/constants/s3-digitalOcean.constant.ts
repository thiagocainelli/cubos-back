import { S3 } from '@aws-sdk/client-s3';

export const s3ClientDigitalOceanConstant = async (): Promise<{
  s3ClientDigitalOcean: S3;
  digitalOceanBucket: string;
  cdnEndpoint: string;
}> => {
  const digitalOceanBucket = process.env.DIGITALOCEAN_BUCKET;
  const digitalOceanEndpointBucket = process.env.DIGITALOCEAN_ENDPOINT_BUCKET;
  const digitalOceanRegion = process.env.DIGITALOCEAN_REGION;
  const digitalOceanEndpoint = process.env.DIGITALOCEAN_ENDPOINT;
  const digitalOceanAccessKeyId = process.env.DIGITALOCEAN_ACCESS_KEY_ID;
  const digitalOceanSecretAccessKey = process.env.DIGITALOCEAN_SECRET_ACCESS_KEY;

  if (
    digitalOceanBucket &&
    digitalOceanEndpointBucket &&
    digitalOceanRegion &&
    digitalOceanEndpoint &&
    digitalOceanAccessKeyId &&
    digitalOceanSecretAccessKey
  ) {
    if (
      digitalOceanBucket &&
      digitalOceanEndpointBucket &&
      digitalOceanRegion &&
      digitalOceanEndpoint &&
      digitalOceanAccessKeyId &&
      digitalOceanSecretAccessKey
    ) {
      const s3ClientDigitalOcean = new S3({
        region: digitalOceanRegion,
        endpoint: digitalOceanEndpoint,
        credentials: {
          accessKeyId: digitalOceanAccessKeyId,
          secretAccessKey: digitalOceanSecretAccessKey,
        },
      });

      return {
        s3ClientDigitalOcean: s3ClientDigitalOcean,
        digitalOceanBucket: digitalOceanBucket,
        cdnEndpoint: digitalOceanEndpointBucket,
      };
    } else {
      throw new Error('S3 DIGITALOCEAN Keys not found');
    }
  } else {
    throw new Error('S3 DIGITALOCEAN Keys not found');
  }
};
