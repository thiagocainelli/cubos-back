import mockPrisma from '../../../__tests__/mocks-backup/prisma.mock';
import { mockUserData } from '../../../__tests__/mocks-backup/test.utils';
import { UserTypeEnum } from '../../../users/enum/userType.enum';

import { comparePassword, encryptPassword } from '../../../_common/utils/crypto.utils';
import {
  generateJwtToken,
  generateRefreshJwtToken,
  verifyRefreshJwtToken,
} from '../../../_common/utils/jwt.utils';
import { loginService } from '../services/login.service';
import { registerService } from '../services/register.service';
import { refreshTokenService } from '../services/refresh-token.service';

// Mock das funções de criptografia e JWT
jest.mock('../../../_common/utils/crypto.utils', () => ({
  comparePassword: jest.fn(),
  encryptPassword: jest.fn(),
}));

jest.mock('../../../_common/utils/jwt.utils', () => ({
  generateJwtToken: jest.fn(),
  generateRefreshJwtToken: jest.fn(),
  verifyRefreshJwtToken: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('loginService', () => {
    const mockLoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockToken = 'mock-jwt-token';
    const mockRefreshToken = 'mock-refresh-token';

    it('should login successfully with valid credentials', async () => {
      // Arrange
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);
      (comparePassword as jest.Mock).mockReturnValue(true);
      (generateJwtToken as jest.Mock).mockReturnValue(mockToken);
      (generateRefreshJwtToken as jest.Mock).mockReturnValue(mockRefreshToken);

      // Act
      const result = await loginService(mockLoginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.token).toBe(mockToken);
      expect(result?.refreshToken).toBe(mockRefreshToken);
      expect(result?.usersData.email).toBe(mockUserData.email);
      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginDto.email },
      });
    });

    it('should throw error when user not found', async () => {
      // Arrange
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(loginService(mockLoginDto)).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw error when user has no password', async () => {
      // Arrange
      const userWithoutPassword = { ...mockUserData, password: null };
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(userWithoutPassword);

      // Act & Assert
      await expect(loginService(mockLoginDto)).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error when password does not match', async () => {
      // Arrange
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);
      (comparePassword as jest.Mock).mockReturnValue(false);

      // Act & Assert
      await expect(loginService(mockLoginDto)).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error when token generation fails', async () => {
      // Arrange
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);
      (comparePassword as jest.Mock).mockReturnValue(true);
      (generateJwtToken as jest.Mock).mockReturnValue(null);

      // Act & Assert
      await expect(loginService(mockLoginDto)).rejects.toThrow('Erro ao gerar token');
    });
  });

  describe('registerService', () => {
    const mockRegisterDto = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      type: UserTypeEnum.users,
    };

    it('should register user successfully', async () => {
      // Arrange
      const encryptedPassword = 'encrypted:password';
      const newUser = { ...mockUserData, ...mockRegisterDto, password: encryptedPassword };

      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(null); // Usuário não existe
      (encryptPassword as jest.Mock).mockReturnValue(encryptedPassword);
      (mockPrisma.users.create as jest.Mock).mockResolvedValue(newUser);

      // Act
      const result = await registerService(mockRegisterDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(newUser.uuid);
      expect(result?.email).toBe(newUser.email);
      expect(encryptPassword).toHaveBeenCalledWith(mockRegisterDto.password);
      expect(mockPrisma.users.create).toHaveBeenCalledWith({
        data: {
          ...mockRegisterDto,
          password: encryptedPassword,
        },
      });
    });

    it('should throw error when password encryption fails', async () => {
      // Arrange
      (encryptPassword as jest.Mock).mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      // Act & Assert
      await expect(registerService(mockRegisterDto)).rejects.toThrow('Encryption failed');
    });
  });

  describe('refreshTokenService', () => {
    const mockRefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should refresh token successfully', async () => {
      // Arrange
      const newToken = 'new-jwt-token';
      const newRefreshToken = 'new-refresh-token';
      const decodedToken = { sub: mockUserData.uuid };

      (verifyRefreshJwtToken as jest.Mock).mockReturnValue(decodedToken);
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);
      (generateJwtToken as jest.Mock).mockReturnValue(newToken);
      (generateRefreshJwtToken as jest.Mock).mockReturnValue(newRefreshToken);

      // Act
      const result = await refreshTokenService(mockRefreshTokenDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.token).toBe(newToken);
      expect(result?.refreshToken).toBe(newRefreshToken);
    });
  });
});

function clearAllMocks() {
  jest.clearAllMocks();
  Object.values(mockPrisma).forEach((mock) => {
    if (typeof mock === 'object' && mock !== null) {
      Object.values(mock).forEach((method) => {
        if (typeof method === 'function') {
          (method as jest.Mock).mockClear();
        }
      });
    }
  });
}
