import { initModules } from '../init.service';
import { UsersService } from '../../users/users.service';

// Mock do UsersService
jest.mock('../../users/users.service', () => ({
  UsersService: {
    initSuperAdmin: jest.fn(),
  },
}));

describe('InitService', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('initModules', () => {
    it('should initialize modules successfully', async () => {
      // Arrange
      (UsersService.initSuperAdmin as jest.Mock).mockResolvedValue(undefined);

      // Act
      await initModules();

      // Assert
      expect(UsersService.initSuperAdmin).toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      // Arrange
      const initError = new Error('Initialization failed');
      (UsersService.initSuperAdmin as jest.Mock).mockRejectedValue(initError);

      // Act & Assert
      await expect(initModules()).rejects.toThrow('Initialization failed');
    });

    it('should handle multiple initialization calls', async () => {
      // Arrange
      (UsersService.initSuperAdmin as jest.Mock).mockResolvedValue(undefined);

      // Act
      await initModules();
      await initModules();
      await initModules();

      // Assert
      expect(UsersService.initSuperAdmin).toHaveBeenCalledTimes(3);
    });

    it('should handle async initialization', async () => {
      // Arrange
      (UsersService.initSuperAdmin as jest.Mock).mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return undefined;
      });

      const startTime = Date.now();

      // Act
      await initModules();

      const endTime = Date.now();

      // Assert
      expect(UsersService.initSuperAdmin).toHaveBeenCalled();
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Error scenarios', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      (UsersService.initSuperAdmin as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(initModules()).rejects.toThrow('Database connection failed');
    });

    it('should handle validation errors', async () => {
      // Arrange
      const validationError = new Error('Validation failed');
      (UsersService.initSuperAdmin as jest.Mock).mockRejectedValue(validationError);

      // Act & Assert
      await expect(initModules()).rejects.toThrow('Validation failed');
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network timeout');
      (UsersService.initSuperAdmin as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(initModules()).rejects.toThrow('Network timeout');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle successful initialization with multiple services', async () => {
      // Arrange
      (UsersService.initSuperAdmin as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await initModules();

      // Assert
      expect(result).toBeUndefined();
      expect(UsersService.initSuperAdmin).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization with environment variables', async () => {
      // Arrange
      const originalEnv = process.env;
      process.env.NODE_ENV = 'test';
      process.env.DEFAULT_SUPERADMIN_EMAIL = 'admin@test.com';
      process.env.DEFAULT_SUPERADMIN_PASSWORD = 'test123';

      (UsersService.initSuperAdmin as jest.Mock).mockResolvedValue(undefined);

      // Act
      await initModules();

      // Assert
      expect(UsersService.initSuperAdmin).toHaveBeenCalled();

      // Restore environment
      process.env = originalEnv;
    });
  });

  describe('Performance and reliability', () => {
    it('should complete initialization within reasonable time', async () => {
      // Arrange
      (UsersService.initSuperAdmin as jest.Mock).mockResolvedValue(undefined);
      const startTime = Date.now();

      // Act
      await initModules();

      const endTime = Date.now();

      // Assert
      expect(endTime - startTime).toBeLessThan(1000); // Deve completar em menos de 1 segundo
    });

    it('should handle concurrent initialization calls', async () => {
      // Arrange
      (UsersService.initSuperAdmin as jest.Mock).mockResolvedValue(undefined);

      // Act
      const promises = [initModules(), initModules(), initModules()];

      await Promise.all(promises);

      // Assert
      expect(UsersService.initSuperAdmin).toHaveBeenCalledTimes(3);
    });
  });
});

function clearAllMocks() {
  jest.clearAllMocks();
  if (UsersService.initSuperAdmin) {
    (UsersService.initSuperAdmin as jest.Mock).mockClear();
  }
}
