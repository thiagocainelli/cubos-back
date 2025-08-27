import { loginService } from './services/login.service';
import { refreshTokenService } from './services/refresh-token.service';

export const AuthService = {
  login: loginService,
  refreshToken: refreshTokenService,
};
