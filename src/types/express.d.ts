// src/types/express.d.ts
import { ReadUsersDto } from '../users/dtos/readUsers.dto';

declare global {
  namespace Express {
    interface Request {
      usersReq: ReadUsersDto;
    }
  }
}

export {};
