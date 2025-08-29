import mockPrisma from '../../../__tests__/mocks-backup/prisma.mock';
import { login, verifyToken, refreshToken, register } from '../auth.controller';
import {
  createMockRequest,
  createMockResponse,
  mockUserData,
} from '../../../__tests__/mocks-backup/test.utils';
import { UserTypeEnum } from '../../../users/enum/userType.enum';
import { AuthService } from '../auth.service';

// Mock do AuthService
jest.mock('../auth.service', () => ({
  AuthService: {
    login: jest.fn(),
    refreshToken: jest.fn(),
    register: jest.fn(),
  },
}));

// Mock das funções JWT
jest.mock('../../../_common/utils/jwt.utils', () => ({
  verifyJwtToken: jest.fn(),
}));

describe('AuthController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = {
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        usersData: mockUserData,
      };

      mockReq.body = loginDto;
      (AuthService.login as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await login(mockReq, mockRes);

      // Assert
      expect(AuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle login errors', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'wrong' };
      mockReq.body = loginDto;
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Login failed'));

      // Act & Assert
      await expect(login(mockReq, mockRes)).rejects.toThrow('Login failed');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      // Arrange
      const mockUserReq = {
        uuid: mockUserData.uuid,
        name: mockUserData.name,
        email: mockUserData.email,
        type: mockUserData.type,
        createdAt: mockUserData.createdAt,
        updatedAt: mockUserData.updatedAt,
        deletedAt: mockUserData.deletedAt,
      };

      mockReq.usersReq = mockUserReq;

      // Act
      await verifyToken(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserReq);
    });

    it('should return 401 when no user in request', async () => {
      // Arrange
      mockReq.usersReq = null;

      // Act
      await verifyToken(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      const refreshTokenDto = { refreshToken: 'valid-refresh-token' };
      const mockResponse = {
        token: 'new-token',
        refreshToken: 'new-refresh-token',
      };

      mockReq.body = refreshTokenDto;
      (AuthService.refreshToken as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await refreshToken(mockReq, mockRes);

      // Assert
      expect(AuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle refresh token errors', async () => {
      // Arrange
      const refreshTokenDto = { refreshToken: 'invalid-token' };
      mockReq.body = refreshTokenDto;
      (AuthService.refreshToken as jest.Mock).mockRejectedValue(new Error('Invalid refresh token'));

      // Act & Assert
      await expect(refreshToken(mockReq, mockRes)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      // Arrange
      const registerDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        type: UserTypeEnum.users,
      };
      const mockResponse = {
        uuid: 'new-uuid',
        ...registerDto,
      };

      mockReq.body = registerDto;
      (AuthService.register as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await register(mockReq, mockRes);

      // Assert
      expect(AuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle registration errors', async () => {
      // Arrange
      const registerDto = { name: 'User', email: 'invalid-email', password: 'pass' };
      mockReq.body = registerDto;
      (AuthService.register as jest.Mock).mockRejectedValue(new Error('Registration failed'));

      // Act & Assert
      await expect(register(mockReq, mockRes)).rejects.toThrow('Registration failed');
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
