import jwt from 'jsonwebtoken';

// Exceptions
import { HttpException } from '../exceptions/httpException';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = '8h';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Gera um token JWT
export const generateJwtToken = (payload: object) => {
  if (!JWT_SECRET) {
    throw new HttpException(401, 'JWT_SECRET não definido');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verifica um token JWT
export const verifyJwtToken = (token: string) => {
  if (!JWT_SECRET) {
    throw new HttpException(401, 'JWT_SECRET não definido');
  }

  return jwt.verify(token, JWT_SECRET);
};

// Gera um token de refresh JWT
export const generateRefreshJwtToken = (payload: object) => {
  if (!JWT_REFRESH_SECRET) {
    throw new HttpException(401, 'JWT_REFRESH_SECRET não definido');
  }

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

// Verifica um token de refresh JWT
export const verifyRefreshJwtToken = (token: string) => {
  if (!JWT_REFRESH_SECRET) {
    throw new HttpException(401, 'JWT_REFRESH_SECRET não definido');
  }

  return jwt.verify(token, JWT_REFRESH_SECRET);
};
