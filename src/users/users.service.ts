import { createUsersService } from './services/create.service';
import { initSuperAdmin } from './services/initSuperAdmin.service';
import { viewUsersService } from './services/view.service';

export const UsersService = {
  create: createUsersService,
  initSuperAdmin: initSuperAdmin,
  view: viewUsersService,
};
