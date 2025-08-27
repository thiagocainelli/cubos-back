import { S3 } from '@aws-sdk/client-s3';

export const s3ClientCloudflareR2Constant = async (): Promise<{
  s3ClientR2: S3;
  r2Bucket: string;
  cdnEndpoint: string;
}> => {
  const r2Bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const r2Endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
  const r2AccessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!r2Bucket || !r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) {
    throw new Error(
      'Configurações do Cloudflare R2 não encontradas. Contacte o administrador do sistema.',
    );
  }

  const s3ClientR2 = new S3({
    region: 'auto', // R2 usa 'auto' como região padrão
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
    forcePathStyle: true, // Importante para R2
  });

  return {
    s3ClientR2: s3ClientR2,
    r2Bucket: r2Bucket,
    cdnEndpoint: r2PublicUrl || r2Endpoint, // Usa URL customizada se disponível
  };
};
