import mockPrisma from '../../../__tests__/mocks-backup/prisma.mock';
import { authenticateJWT } from '../auth.middleware';
import { createMockRequest, createMockResponse } from '../../../__tests__/mocks-backup/test.utils';
import { mockUserData } from '../../../__tests__/mocks-backup/test.utils';
import { verifyJwtToken } from '../../../_common/utils/jwt.utils';

// Mock das funções JWT
jest.mock('../../../_common/utils/jwt.utils', () => ({
  verifyJwtToken: jest.fn(),
}));

describe('AuthMiddleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = jest.fn();
    clearAllMocks();
  });

  describe('authenticateJWT', () => {
    it('should authenticate valid JWT token successfully', async () => {
      // Arrange
      const validToken = 'valid-jwt-token';
      const decodedToken = { sub: mockUserData.uuid };

      mockReq.headers.authorization = `Bearer ${validToken}`;
      (verifyJwtToken as jest.Mock).mockReturnValue(decodedToken);
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);

      // Act
      await authenticateJWT(mockReq, mockRes, mockNext);

      // Assert
      expect(verifyJwtToken).toHaveBeenCalledWith(validToken);
      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { uuid: mockUserData.uuid, deletedAt: null },
      });
      expect(mockReq.usersReq).toBeDefined();
      expect(mockReq.usersReq.uuid).toBe(mockUserData.uuid);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error when no authorization header', async () => {
      // Arrange
      mockReq.headers.authorization = undefined;

      // Act & Assert
      await expect(authenticateJWT(mockReq, mockRes, mockNext)).rejects.toThrow('Token inválido');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when authorization header does not start with Bearer', async () => {
      // Arrange
      mockReq.headers.authorization = 'InvalidToken';

      // Act & Assert
      await expect(authenticateJWT(mockReq, mockRes, mockNext)).rejects.toThrow('Token inválido');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when JWT verification fails', async () => {
      // Arrange
      const invalidToken = 'invalid-jwt-token';
      mockReq.headers.authorization = `Bearer ${invalidToken}`;
      (verifyJwtToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(authenticateJWT(mockReq, mockRes, mockNext)).rejects.toThrow(
        'Token inválido ou expirado',
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when token has no sub field', async () => {
      // Arrange
      const tokenWithoutSub = 'token-without-sub';
      const decodedToken = { otherField: 'value' };

      mockReq.headers.authorization = `Bearer ${tokenWithoutSub}`;
      (verifyJwtToken as jest.Mock).mockReturnValue(decodedToken);

      // Act & Assert
      await expect(authenticateJWT(mockReq, mockRes, mockNext)).rejects.toThrow(
        'Token inválido ou expirado',
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when user not found in database', async () => {
      // Arrange
      const validToken = 'valid-jwt-token';
      const decodedToken = { sub: mockUserData.uuid };

      mockReq.headers.authorization = `Bearer ${validToken}`;
      (verifyJwtToken as jest.Mock).mockReturnValue(decodedToken);
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(authenticateJWT(mockReq, mockRes, mockNext)).rejects.toThrow(
        'Usuário não encontrado ou foi deletado',
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when user is deleted', async () => {
      // Arrange
      const validToken = 'valid-jwt-token';
      const decodedToken = { sub: mockUserData.uuid };

      mockReq.headers.authorization = `Bearer ${validToken}`;
      (verifyJwtToken as jest.Mock).mockReturnValue(decodedToken);
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(null); // Usuário deletado retorna null

      // Act & Assert
      await expect(authenticateJWT(mockReq, mockRes, mockNext)).rejects.toThrow(
        'Usuário não encontrado ou foi deletado',
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set usersReq with correct user data', async () => {
      // Arrange
      const validToken = 'valid-jwt-token';
      const decodedToken = { sub: mockUserData.uuid };

      mockReq.headers.authorization = `Bearer ${validToken}`;
      (verifyJwtToken as jest.Mock).mockReturnValue(decodedToken);
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);

      // Act
      await authenticateJWT(mockReq, mockRes, mockNext);

      // Assert
      expect(mockReq.usersReq).toEqual({
        uuid: mockUserData.uuid,
        name: mockUserData.name,
        email: mockUserData.email,
        type: mockUserData.type,
        createdAt: mockUserData.createdAt,
        updatedAt: mockUserData.updatedAt,
        deletedAt: mockUserData.deletedAt,
      });
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
