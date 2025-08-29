import type { ReadUsersDto } from '@/users/dtos/readUsers.dto';

declare module 'express-serve-static-core' {
  interface Request {
    usersReq?: ReadUsersDto;
  }
}
