import { checkFileExistsCloudflareR2Service } from '@/integrations/s3-digitalOcean/service/checkFileExists.service';
import { uploadFileCloudflareR2Service } from '@/integrations/s3-digitalOcean/service/uploadFileR2.service';
import { downloadFileCloudflareR2Service } from '@/integrations/s3-digitalOcean/service/downloadFileR2.service';

export const UploadFileCloudflareR2Service = {
  checkFileExists: checkFileExistsCloudflareR2Service,
  uploadFile: uploadFileCloudflareR2Service,
  downloadFile: downloadFileCloudflareR2Service,
};
