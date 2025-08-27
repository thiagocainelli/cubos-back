import { checkFileExistsDigitalOceanService } from './service/checkFileExists.service';
import { signedFileDigitalOceanService } from './service/signedFile.service';
import { uploadFileDigitalOceanService } from './service/uploadFileDigitalOcean.service';
import { downloadFileDigitalOceanService } from './service/downloadFileDigitalOcean.service';

export const UploadFileS3DigitalOceanService = {
  checkFileExists: checkFileExistsDigitalOceanService,
  signedFile: signedFileDigitalOceanService,
  uploadFile: uploadFileDigitalOceanService,
  downloadFile: downloadFileDigitalOceanService,
};
