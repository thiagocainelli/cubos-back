import crypto from 'crypto';
import { HttpException } from '../exceptions/httpException';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY; // 32 bytes (256 bits), em base64
const IV_LENGTH = 16; // 16 bytes (128 bits) for AES

/**
 * Gera uma chave de 256 bits codificada em base64 para uso como ENCRYPTION_KEY
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString('base64');
};

/**
 * Recupera e valida a ENCRYPTION_KEY do ambiente
 */
const getSecretKey = (): Buffer => {
  const env = process.env.NODE_ENV || 'development';

  if (!SECRET_KEY) {
    throw new HttpException(401, 'ENCRYPTION_KEY não definida');
  }

  try {
    const keyBuffer = Buffer.from(SECRET_KEY, 'base64');
    if (keyBuffer.length !== 32) {
      throw new HttpException(
        401,
        'ENCRYPTION_KEY deve ser 32 bytes (256 bits) quando decodificado de base64',
      );
    }
    return keyBuffer;
  } catch (error) {
    throw new HttpException(
      401,
      `[${env}] ENCRYPTION_KEY não é válida. Use generateEncryptionKey() para criar uma chave válida`,
    );
  }
};

/**
 * Criptografa uma senha com AES-256-CBC e retorna uma string no formato <iv>:<encrypted>
 */
export const encryptPassword = (password: string): string => {
  try {
    const key = getSecretKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    throw new HttpException(401, 'Erro ao criptografar senha: ' + (error as Error).message);
  }
};

/**
 * Descriptografa a senha previamente criptografada com encryptPassword
 */
export const decryptPassword = (encryptedPassword: string): string => {
  try {
    const key = getSecretKey();

    if (!encryptedPassword.includes(':')) {
      throw new HttpException(401, 'Formato de senha criptografada inválido');
    }

    const textParts = encryptedPassword.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (error) {
    throw new HttpException(401, 'Erro ao descriptografar senha: ' + (error as Error).message);
  }
};

/**
 * Compara uma senha em texto com a senha criptografada (descriptografando antes)
 */
export const comparePassword = (password: string, encryptedPassword: string): boolean => {
  try {
    const decryptedPassword = decryptPassword(encryptedPassword);

    const a = Buffer.from(password);
    const b = Buffer.from(decryptedPassword);

    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);
  } catch (error) {
    throw new HttpException(401, 'Erro ao comparar senha: ' + (error as Error).message);
  }
};
