import { UsersService } from '../users/users.service';

export async function initModules() {
  // Create super admin user if not exists
  await UsersService.initSuperAdmin();
}
