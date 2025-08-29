import { loginService } from './services/login.service';
import { refreshTokenService } from './services/refresh-token.service';
import { registerService } from './services/register.service';

export const AuthService = {
  login: loginService,
  refreshToken: refreshTokenService,
  register: registerService,
};
