import { createStorageService } from './services/create.service';
import { viewStorageService } from './services/view.service';
import { deleteStorageService } from './services/delete.service';

export const StorageService = {
  create: createStorageService,
  view: viewStorageService,
  delete: deleteStorageService,
};
