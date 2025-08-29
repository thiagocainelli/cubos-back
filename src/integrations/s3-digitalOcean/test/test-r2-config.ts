// test-r2-config.ts
import { s3ClientCloudflareR2Constant } from '@/integrations/s3-digitalOcean/constants/s3-r2.constant';

// test-r2-config.ts
async function testR2Config() {
  try {
    console.log('�� Testando configuração do Cloudflare R2...');

    // Log das variáveis de ambiente
    console.log('📋 Variáveis de ambiente:');
    console.log(
      'CLOUDFLARE_R2_ACCESS_KEY_ID:',
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '✅ Configurado' : '❌ Não configurado',
    );
    console.log(
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY:',
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '✅ Configurado' : '❌ Não configurado',
    );
    console.log('CLOUDFLARE_R2_ENDPOINT:', process.env.CLOUDFLARE_R2_ENDPOINT);
    console.log('CLOUDFLARE_R2_BUCKET:', process.env.CLOUDFLARE_R2_BUCKET);
    console.log('CLOUDFLARE_R2_PUBLIC_URL:', process.env.CLOUDFLARE_R2_PUBLIC_URL);

    const config = await s3ClientCloudflareR2Constant();

    console.log('✅ Configuração válida!');
    console.log('Bucket:', config.r2Bucket);
    console.log('Endpoint:', config.cdnEndpoint);
    console.log('S3 Client configurado:', !!config.s3ClientR2);

    // Teste mais específico - listar objetos do bucket específico
    console.log('🔍 Testando listagem de objetos do bucket...');
    const objects = await config.s3ClientR2.listObjectsV2({
      Bucket: config.r2Bucket,
    });
    console.log('📦 Objetos no bucket:', objects.Contents?.length || 0);
  } catch (error: any) {
    console.error('❌ Erro na configuração:', error);

    // Log mais detalhado do erro
    if (error.Code === 'SignatureDoesNotMatch') {
      console.log('🔍 Detalhes do erro de assinatura:');
      console.log('StringToSign:', error.StringToSign);
      console.log('SignatureProvided:', error.SignatureProvided);
    }
  }
}

testR2Config();
