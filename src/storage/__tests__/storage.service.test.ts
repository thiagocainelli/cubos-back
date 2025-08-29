import mockPrisma from '../../__tests__/mocks-backup/prisma.mock';
import { mockStorageData, mockFile } from '../../__tests__/mocks-backup/test.utils';
import { UploadFileCloudflareR2Service } from '../../integrations/s3-digitalOcean/s3-r2.service';
import { createStorageService } from '../services/create.service';
import { viewStorageService } from '../services/view.service';
import { deleteStorageService } from '../services/delete.service';

// Mock do serviço de upload
jest.mock('../../integrations/s3-digitalOcean/s3-r2.service', () => ({
  UploadFileCloudflareR2Service: {
    uploadFile: jest.fn(),
  },
}));

describe('StorageService', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('createStorageService', () => {
    const mockCreateStorageDto = {
      type: 'profile-image',
    };

    it('should create storage successfully', async () => {
      // Arrange
      const uploadResult = {
        key: 'profile-image/test-image.jpg',
        url: 'https://example.com/test-image.jpg',
      };
      const newStorage = { ...mockStorageData, ...mockCreateStorageDto };

      (UploadFileCloudflareR2Service.uploadFile as jest.Mock).mockResolvedValue(uploadResult);
      (mockPrisma.storage.create as jest.Mock).mockResolvedValue(newStorage);

      // Act
      const result = await createStorageService(mockCreateStorageDto, mockFile);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(newStorage.uuid);
      expect(result?.name).toBe(newStorage.name);
      expect(result?.key).toBe(newStorage.key);
      expect(result?.type).toBe(newStorage.type);
      expect(UploadFileCloudflareR2Service.uploadFile).toHaveBeenCalledWith(
        expect.stringContaining('test-image.jpg'),
        mockFile,
        'profile-image',
      );
      expect(mockPrisma.storage.create).toHaveBeenCalledWith({
        data: {
          name: mockFile.originalname,
          key: uploadResult.key,
          mimetype: mockFile.mimetype,
          type: mockCreateStorageDto.type,
          url: uploadResult.url,
        },
      });
    });

    it('should create storage with default type when not provided', async () => {
      // Arrange
      const uploadResult = {
        key: 'general/test-image.jpg',
        url: 'https://example.com/test-image.jpg',
      };
      const newStorage = { ...mockStorageData, type: 'general' };

      (UploadFileCloudflareR2Service.uploadFile as jest.Mock).mockResolvedValue(uploadResult);
      (mockPrisma.storage.create as jest.Mock).mockResolvedValue(newStorage);

      // Act
      const result = await createStorageService({}, mockFile);

      // Assert
      expect(result).toBeDefined();
      expect(UploadFileCloudflareR2Service.uploadFile).toHaveBeenCalledWith(
        expect.stringContaining('test-image.jpg'),
        mockFile,
        'general',
      );
      expect(mockPrisma.storage.create).toHaveBeenCalledWith({
        data: {
          name: mockFile.originalname,
          key: uploadResult.key,
          mimetype: mockFile.mimetype,
          type: undefined,
          url: uploadResult.url,
        },
      });
    });

    it('should throw error when no file provided', async () => {
      // Arrange
      const createStorageDto = { type: 'profile-image' };

      // Act & Assert
      await expect(createStorageService(createStorageDto, null as any)).rejects.toThrow(
        'Arquivo é obrigatório',
      );
    });

    it('should throw error when upload fails', async () => {
      // Arrange
      (UploadFileCloudflareR2Service.uploadFile as jest.Mock).mockRejectedValue(
        new Error('Upload failed'),
      );

      // Act & Assert
      await expect(createStorageService(mockCreateStorageDto, mockFile)).rejects.toThrow(
        'Unexpected database error',
      );
    });

    it('should throw error when database creation fails', async () => {
      // Arrange
      const uploadResult = {
        key: 'profile-image/test-image.jpg',
        url: 'https://example.com/test-image.jpg',
      };

      (UploadFileCloudflareR2Service.uploadFile as jest.Mock).mockResolvedValue(uploadResult);
      (mockPrisma.storage.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(createStorageService(mockCreateStorageDto, mockFile)).rejects.toThrow(
        'Unexpected database error',
      );
    });

    it('should throw error when storage creation returns null', async () => {
      // Arrange
      const uploadResult = {
        key: 'profile-image/test-image.jpg',
        url: 'https://example.com/test-image.jpg',
      };

      (UploadFileCloudflareR2Service.uploadFile as jest.Mock).mockResolvedValue(uploadResult);
      (mockPrisma.storage.create as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(createStorageService(mockCreateStorageDto, mockFile)).rejects.toThrow(
        'Erro ao criar storage',
      );
    });
  });

  describe('viewStorageService', () => {
    it('should return storage when found', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      (mockPrisma.storage.findUnique as jest.Mock).mockResolvedValue(mockStorageData);

      // Act
      const result = await viewStorageService(storageUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(mockStorageData.uuid);
      expect(result?.name).toBe(mockStorageData.name);
      expect(result?.key).toBe(mockStorageData.key);
      expect(mockPrisma.storage.findUnique).toHaveBeenCalledWith({
        where: { uuid: storageUuid, deletedAt: null },
      });
    });

    it('should throw error when storage not found', async () => {
      // Arrange
      const storageUuid = 'non-existent-uuid';
      (mockPrisma.storage.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(viewStorageService(storageUuid)).rejects.toThrow('UUID do arquivo é inválido');
    });

    it('should return storage even when deleted', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      const deletedStorage = { ...mockStorageData, deletedAt: new Date() };
      (mockPrisma.storage.findUnique as jest.Mock).mockResolvedValue(deletedStorage);

      // Act
      const result = await viewStorageService(storageUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.deletedAt).toBeDefined();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      (mockPrisma.storage.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(viewStorageService(storageUuid)).rejects.toThrow('Unexpected database error');
    });
  });

  describe('deleteStorageService', () => {
    it('should delete storage successfully (soft delete)', async () => {
      // Arrange
      const storageUuid = mockStorageData.uuid;
      const deletedStorage = { ...mockStorageData, deletedAt: new Date() };
      (mockPrisma.storage.findFirst as jest.Mock).mockResolvedValue(mockStorageData);
      (mockPrisma.storage.update as jest.Mock).mockResolvedValue(deletedStorage);

      // Act
      const result = await deleteStorageService(storageUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.deletedAt).toBeDefined();
      expect(mockPrisma.storage.update).toHaveBeenCalledWith({
        where: { uuid: storageUuid },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw error when deletion fails', async () => {
      // Arrange
      const storageUuid = 'non-existent-uuid';
      (mockPrisma.storage.update as jest.Mock).mockRejectedValue(new Error('Deletion failed'));

      // Act & Assert
      await expect(deleteStorageService(storageUuid)).rejects.toThrow('UUID do arquivo é inválido');
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
