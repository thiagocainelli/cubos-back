import { createStorageService } from './services/create.service';
import { viewStorageService } from './services/view.service';
import { deleteStorageService } from './services/delete.service';
import { createStorageChatFileService } from './services/create-chat-file.service';
import { downloadArchiveOrderService } from './services/download-archive-order.service';

export const StorageService = {
  create: createStorageService,
  createChatFile: createStorageChatFileService,
  view: viewStorageService,
  delete: deleteStorageService,
  downloadArchiveOrder: downloadArchiveOrderService,
};
