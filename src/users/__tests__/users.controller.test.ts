import mockPrisma from '../../__tests__/mocks-backup/prisma.mock';
import { createUsers, viewUsers } from '../users.controller';
import { createMockRequest, createMockResponse } from '../../__tests__/mocks-backup/test.utils';
import { mockUserData } from '../../__tests__/mocks-backup/test.utils';
import { UserTypeEnum } from '../enum/userType.enum';
import { UsersService } from '../users.service';

// Mock do UsersService
jest.mock('../../users/users.service', () => ({
  UsersService: {
    create: jest.fn(),
    view: jest.fn(),
  },
}));

describe('UsersController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    clearAllMocks();
  });

  describe('createUsers', () => {
    it('should create user successfully', async () => {
      // Arrange
      const createUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        type: UserTypeEnum.users,
      };
      const mockResponse = {
        uuid: 'new-uuid',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = createUserDto;
      (UsersService.create as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await createUsers(mockReq, mockRes);

      // Assert
      expect(UsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle creation errors', async () => {
      // Arrange
      const createUserDto = { name: 'User', email: 'invalid-email' };
      mockReq.body = createUserDto;
      (UsersService.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));

      // Act & Assert
      await expect(createUsers(mockReq, mockRes)).rejects.toThrow('Creation failed');
    });

    it('should create super admin user successfully', async () => {
      // Arrange
      const createSuperAdminDto = {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'admin123',
        type: UserTypeEnum.superAdmin,
      };
      const mockResponse = {
        uuid: 'admin-uuid',
        ...createSuperAdminDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = createSuperAdminDto;
      (UsersService.create as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await createUsers(mockReq, mockRes);

      // Assert
      expect(UsersService.create).toHaveBeenCalledWith(createSuperAdminDto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('viewUsers', () => {
    it('should return user when found', async () => {
      // Arrange
      const userUuid = mockUserData.uuid;
      const mockResponse = {
        uuid: mockUserData.uuid,
        name: mockUserData.name,
        email: mockUserData.email,
        type: mockUserData.type,
        createdAt: mockUserData.createdAt,
        updatedAt: mockUserData.updatedAt,
      };

      mockReq.query.uuid = userUuid;
      (UsersService.view as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await viewUsers(mockReq, mockRes);

      // Assert
      expect(UsersService.view).toHaveBeenCalledWith(userUuid);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle user not found', async () => {
      // Arrange
      const userUuid = 'non-existent-uuid';
      mockReq.query.uuid = userUuid;
      (UsersService.view as jest.Mock).mockResolvedValue(null);

      // Act
      await viewUsers(mockReq, mockRes);

      // Assert
      expect(UsersService.view).toHaveBeenCalledWith(userUuid);
      expect(mockRes.json).toHaveBeenCalledWith(null);
    });

    it('should handle view errors', async () => {
      // Arrange
      const userUuid = mockUserData.uuid;
      mockReq.query.uuid = userUuid;
      (UsersService.view as jest.Mock).mockRejectedValue(new Error('View failed'));

      // Act & Assert
      await expect(viewUsers(mockReq, mockRes)).rejects.toThrow('View failed');
    });

    it('should handle missing uuid parameter', async () => {
      // Arrange
      mockReq.query.uuid = undefined;
      (UsersService.view as jest.Mock).mockResolvedValue(null);

      // Act
      await viewUsers(mockReq, mockRes);

      // Assert
      expect(UsersService.view).toHaveBeenCalledWith(undefined);
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
