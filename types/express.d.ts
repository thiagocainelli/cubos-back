import type { ReadUsersDto } from '../src/users/dtos/readUsers.dto';

declare module 'express-serve-static-core' {
  interface Request {
    usersReq?: ReadUsersDto;
  }
}
