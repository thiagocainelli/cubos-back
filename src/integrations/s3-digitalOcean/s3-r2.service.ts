import { checkFileExistsCloudflareR2Service } from './service/checkFileExists.service';
import { uploadFileCloudflareR2Service } from './service/uploadFileR2.service';
import { downloadFileCloudflareR2Service } from './service/downloadFileR2.service';

export const UploadFileCloudflareR2Service = {
  checkFileExists: checkFileExistsCloudflareR2Service,
  uploadFile: uploadFileCloudflareR2Service,
  downloadFile: downloadFileCloudflareR2Service,
};
