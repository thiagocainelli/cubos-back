import mockPrisma from '../../__tests__/mocks-backup/prisma.mock';
import { mockUserData, mockSuperAdminData } from '../../__tests__/mocks-backup/test.utils';
import { UserTypeEnum } from '../enum/userType.enum';
import { encryptPassword } from '../../_common/utils/crypto.utils';
import { createUsersService } from '../services/create.service';
import { viewUsersService } from '../services/view.service';

// Mock das funções de criptografia
jest.mock('../../_common/utils/crypto.utils', () => ({
  encryptPassword: jest.fn(),
}));

describe('UsersService', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('createUsersService', () => {
    const mockCreateUserDto = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      type: UserTypeEnum.users,
    };

    it('should create user successfully', async () => {
      // Arrange
      const encryptedPassword = 'encrypted:password';
      const newUser = { ...mockUserData, ...mockCreateUserDto, password: encryptedPassword };

      (encryptPassword as jest.Mock).mockReturnValue(encryptedPassword);
      (mockPrisma.users.create as jest.Mock).mockResolvedValue(newUser);

      // Act
      const result = await createUsersService(mockCreateUserDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(newUser.uuid);
      expect(result?.name).toBe(newUser.name);
      expect(result?.email).toBe(newUser.email);
      expect(result?.type).toBe(newUser.type);
      expect(encryptPassword).toHaveBeenCalledWith(mockCreateUserDto.password);
      expect(mockPrisma.users.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateUserDto,
          password: encryptedPassword,
        },
      });
    });

    it('should create super admin user successfully', async () => {
      // Arrange
      const superAdminDto = {
        ...mockCreateUserDto,
        type: UserTypeEnum.superAdmin,
      };
      const encryptedPassword = 'encrypted:password';
      const newSuperAdmin = {
        ...mockSuperAdminData,
        ...superAdminDto,
        password: encryptedPassword,
      };

      (encryptPassword as jest.Mock).mockReturnValue(encryptedPassword);
      (mockPrisma.users.create as jest.Mock).mockResolvedValue(newSuperAdmin);

      // Act
      const result = await createUsersService(superAdminDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.type).toBe(UserTypeEnum.superAdmin);
      expect(mockPrisma.users.create).toHaveBeenCalledWith({
        data: {
          ...superAdminDto,
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
      await expect(createUsersService(mockCreateUserDto)).rejects.toThrow('Encryption failed');
    });

    it('should throw error when database creation fails', async () => {
      // Arrange
      const encryptedPassword = 'encrypted:password';
      (encryptPassword as jest.Mock).mockReturnValue(encryptedPassword);
      (mockPrisma.users.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createUsersService(mockCreateUserDto)).rejects.toThrow(
        'Unexpected database error',
      );
    });
  });

  describe('viewUsersService', () => {
    it('should return user when found', async () => {
      // Arrange
      const userUuid = mockUserData.uuid;
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(mockUserData);

      // Act
      const result = await viewUsersService(userUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(mockUserData.uuid);
      expect(result?.name).toBe(mockUserData.name);
      expect(result?.email).toBe(mockUserData.email);
      expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { uuid: userUuid, deletedAt: null },
      });
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userUuid = 'non-existent-uuid';
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(viewUsersService(userUuid)).rejects.toThrow('UUID do usuário inválido');
    });

    it('should return user even when deleted', async () => {
      // Arrange
      const userUuid = mockUserData.uuid;
      const deletedUser = { ...mockUserData, deletedAt: new Date() };
      (mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(deletedUser);

      // Act
      const result = await viewUsersService(userUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.deletedAt).toBeDefined();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const userUuid = mockUserData.uuid;
      (mockPrisma.users.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(viewUsersService(userUuid)).rejects.toThrow('Unexpected database error');
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
