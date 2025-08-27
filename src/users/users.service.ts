import { createUsersService } from './services/create.service';
import { initSuperAdmin } from './services/initSuperAdmin.service';
import { listUsersService } from './services/list.service';
import { updateUsersService } from './services/update.service';
import { viewUsersService } from './services/view.service';
import { updatePasswordService } from './services/updatePassword.service';
import { deleteUsersService } from './services/delete.service';
import { listDeletedUsersService } from './services/listDeleted.service';
import { findByEmailUsersService } from './services/findByEmail.service';
import { resetPasswordService } from './services/resetPassword.service';

export const UsersService = {
  create: createUsersService,
  initSuperAdmin: initSuperAdmin,
  list: listUsersService,
  update: updateUsersService,
  view: viewUsersService,
  updatePassword: updatePasswordService,
  resetPassword: resetPasswordService,
  delete: deleteUsersService,
  listDeleted: listDeletedUsersService,
  findByEmail: findByEmailUsersService,
};
