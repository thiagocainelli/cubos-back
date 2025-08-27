import { UsersService } from '../users/users.service';

export async function initModules() {
  await UsersService.initSuperAdmin();
}
