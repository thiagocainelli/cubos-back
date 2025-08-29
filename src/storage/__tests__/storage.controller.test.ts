import mockPrisma from '../../__tests__/mocks-backup/prisma.mock';
import { createStorage, viewStorage, deleteStorage } from '../storage.controller';
import { createMockRequest, createMockResponse } from '../../__tests__/mocks-backup/test.utils';
import { mockStorageData, mockFile } from '../../__tests__/mocks-backup/test.utils';
import { StorageService } from '../storage.service';

// Mock do StorageService
jest.mock('../../storage/storage.service', () => ({
  StorageService: {
    create: jest.fn(),
    view: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('StorageController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    clearAllMocks();
  });

  describe('createStorage', () => {
    it('should create storage successfully', async () => {
      // Arrange
      const createStorageDto = { type: 'profile-image' };
      const mockResponse = {
        uuid: 'new-uuid',
        name: 'test-image.jpg',
        key: 'profile-image/test-image.jpg',
        type: 'profile-image',
        url: 'https://example.com/test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = createStorageDto;
      mockReq.file = mockFile;
      (StorageService.create as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await createStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.create).toHaveBeenCalledWith(createStorageDto, mockFile);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should return 400 when no file provided', async () => {
      // Arrange
      const createStorageDto = { type: 'profile-image' };
      mockReq.body = createStorageDto;
      mockReq.file = null;

      // Act
      await createStorage(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Arquivo é obrigatório' });
      expect(StorageService.create).not.toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      // Arrange
      const createStorageDto = { type: 'profile-image' };
      mockReq.body = createStorageDto;
      mockReq.file = mockFile;
      (StorageService.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));

      // Act & Assert
      await expect(createStorage(mockReq, mockRes)).rejects.toThrow('Creation failed');
    });

    it('should create storage with default type when not provided', async () => {
      // Arrange
      const mockResponse = {
        uuid: 'new-uuid',
        name: 'test-image.jpg',
        key: 'general/test-image.jpg',
        type: 'general',
        url: 'https://example.com/test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = {};
      mockReq.file = mockFile;
      (StorageService.create as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await createStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.create).toHaveBeenCalledWith({}, mockFile);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('viewStorage', () => {
    it('should return storage when found', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      const mockResponse = {
        uuid: mockStorageData.uuid,
        name: mockStorageData.name,
        key: mockStorageData.key,
        type: mockStorageData.type,
        url: mockStorageData.url,
        createdAt: mockStorageData.createdAt,
        updatedAt: mockStorageData.updatedAt,
      };

      mockReq.query.uuid = storageUuid;
      (StorageService.view as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await viewStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.view).toHaveBeenCalledWith(storageUuid);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle storage not found', async () => {
      // Arrange
      const storageUuid = 'non-existent-uuid';
      mockReq.query.uuid = storageUuid;
      (StorageService.view as jest.Mock).mockResolvedValue(null);

      // Act
      await viewStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.view).toHaveBeenCalledWith(storageUuid);
      expect(mockRes.json).toHaveBeenCalledWith(null);
    });

    it('should handle view errors', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      mockReq.query.uuid = storageUuid;
      (StorageService.view as jest.Mock).mockRejectedValue(new Error('View failed'));

      // Act & Assert
      await expect(viewStorage(mockReq, mockRes)).rejects.toThrow('View failed');
    });

    it('should handle missing uuid parameter', async () => {
      // Arrange
      mockReq.query.uuid = undefined;
      (StorageService.view as jest.Mock).mockResolvedValue(null);

      // Act
      await viewStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.view).toHaveBeenCalledWith(undefined);
    });
  });

  describe('deleteStorage', () => {
    it('should delete storage successfully', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      const mockResponse = {
        ...mockStorageData,
        deletedAt: new Date(),
      };

      mockReq.query.uuid = storageUuid;
      (StorageService.delete as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await deleteStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.delete).toHaveBeenCalledWith(storageUuid);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle delete errors', async () => {
      // Arrange
      const storageUuid = 'non-existent-uuid';
      mockReq.query.uuid = storageUuid;
      (StorageService.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      // Act & Assert
      await expect(deleteStorage(mockReq, mockRes)).rejects.toThrow('Delete failed');
    });

    it('should handle missing uuid parameter', async () => {
      // Arrange
      mockReq.query.uuid = undefined;
      (StorageService.delete as jest.Mock).mockResolvedValue(null);

      // Act
      await deleteStorage(mockReq, mockRes);

      // Assert
      expect(StorageService.delete).toHaveBeenCalledWith(undefined);
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
