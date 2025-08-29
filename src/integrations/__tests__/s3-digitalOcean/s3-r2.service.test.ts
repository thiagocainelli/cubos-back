import { UploadFileCloudflareR2Service } from '../../../integrations/s3-digitalOcean/s3-r2.service';
import { mockFile } from '../../../__tests__/mocks-backup/test.utils';
import { s3ClientCloudflareR2Constant } from '../../../integrations/s3-digitalOcean/constants/s3-r2.constant';

// Mock do AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  PutObjectCommand: jest.fn().mockImplementation((params) => ({
    input: params,
  })),
  S3: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
}));

// Mock das constantes
jest.mock('../../../integrations/s3-digitalOcean/constants/s3-r2.constant', () => ({
  s3ClientCloudflareR2Constant: jest.fn(),
}));

describe('S3 R2 Service', () => {
  let mockS3Client: any;

  beforeEach(() => {
    clearAllMocks();

    // Mock do cliente S3
    mockS3Client = {
      send: jest.fn(),
    };
  });

  describe('uploadFileCloudflareR2Service', () => {
    it('should upload file successfully', async () => {
      // Arrange
      const filename = 'test-image.jpg';
      const path = 'profile-image';
      const mockUploadResult = {
        key: 'profile-image/test-image.jpg',
        url: 'https://example.com/test-image.jpg',
      };

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockResolvedValue({});

      // Act
      const result = await UploadFileCloudflareR2Service.uploadFile(filename, mockFile, path);

      // Assert
      expect(result).toBeDefined();
      expect(result.key).toBe('profile-image/test-image.jpg');
      expect(result.url).toBe('https://example.com/profile-image/test-image.jpg');
      expect(mockS3Client.send).toHaveBeenCalled();
    });

    it('should upload file with default path when not provided', async () => {
      // Arrange
      const filename = 'test-image.jpg';
      const mockUploadResult = {
        key: 'general/test-image.jpg',
        url: 'https://example.com/test-image.jpg',
      };

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockResolvedValue({});

      // Act
      const result = await UploadFileCloudflareR2Service.uploadFile(filename, mockFile);

      // Assert
      expect(result).toBeDefined();
      expect(result.key).toBe('general/test-image.jpg');
      expect(result.url).toBe('https://example.com/general/test-image.jpg');
    });

    it('should handle PDF files with inline disposition', async () => {
      // Arrange
      const filename = 'test-document.pdf';
      const path = 'documents';
      const pdfFile = { ...mockFile, mimetype: 'application/pdf' };

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockResolvedValue({});

      // Act
      const result = await UploadFileCloudflareR2Service.uploadFile(filename, pdfFile, path);

      // Assert
      expect(result).toBeDefined();
      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            ContentDisposition: 'inline; filename="test-document.pdf"',
          }),
        }),
      );
    });

    it('should handle image files with inline disposition', async () => {
      // Arrange
      const filename = 'test-image.png';
      const path = 'images';
      const imageFile = { ...mockFile, mimetype: 'image/png' };

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockResolvedValue({});

      // Act
      const result = await UploadFileCloudflareR2Service.uploadFile(filename, imageFile, path);

      // Assert
      expect(result).toBeDefined();
      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            ContentDisposition: 'inline',
          }),
        }),
      );
    });

    it('should throw error when R2 configuration is missing', async () => {
      // Arrange
      const filename = 'test-image.jpg';
      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: null,
        r2Bucket: null,
        cdnEndpoint: null,
      });

      // Act & Assert
      await expect(UploadFileCloudflareR2Service.uploadFile(filename, mockFile)).rejects.toThrow(
        'Configurações do Cloudflare R2 não encontradas',
      );
    });

    it('should throw error when upload fails', async () => {
      // Arrange
      const filename = 'test-image.jpg';
      const uploadError = new Error('Upload failed');

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockRejectedValue(uploadError);

      // Act & Assert
      await expect(UploadFileCloudflareR2Service.uploadFile(filename, mockFile)).rejects.toThrow(
        'Erro ao fazer upload do arquivo no Cloudflare R2',
      );
    });

    it('should throw error when result is invalid', async () => {
      // Arrange
      const filename = 'test-image.jpg';
      const path = 'profile-image';

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      // Mock para simular um erro no upload
      mockS3Client.send.mockRejectedValue(new Error('Upload failed'));

      // Act & Assert
      await expect(
        UploadFileCloudflareR2Service.uploadFile(filename, mockFile, path),
      ).rejects.toThrow('Erro ao fazer upload do arquivo no Cloudflare R2');
    });

    it('should handle different file types correctly', async () => {
      // Arrange
      const fileTypes = [
        { mimetype: 'image/jpeg', expectedDisposition: 'inline' },
        { mimetype: 'image/png', expectedDisposition: 'inline' },
        { mimetype: 'image/gif', expectedDisposition: 'inline' },
        { mimetype: 'application/pdf', expectedDisposition: 'inline; filename="test-file"' },
        { mimetype: 'text/plain', expectedDisposition: undefined },
        { mimetype: 'application/json', expectedDisposition: undefined },
      ];

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockResolvedValue({});

      // Act & Assert
      for (const fileType of fileTypes) {
        const testFile = { ...mockFile, mimetype: fileType.mimetype };
        const result = await UploadFileCloudflareR2Service.uploadFile(
          'test-file',
          testFile,
          'test-path',
        );

        expect(result).toBeDefined();

        if (fileType.expectedDisposition) {
          expect(mockS3Client.send).toHaveBeenCalledWith(
            expect.objectContaining({
              input: expect.objectContaining({
                ContentDisposition: fileType.expectedDisposition,
              }),
            }),
          );
        }
      }
    });

    it('should generate correct file keys', async () => {
      // Arrange
      const testCases = [
        { filename: 'image.jpg', path: 'profile', expectedKey: 'profile/image.jpg' },
        { filename: 'document.pdf', path: 'documents', expectedKey: 'documents/document.pdf' },
        { filename: 'video.mp4', path: 'videos', expectedKey: 'videos/video.mp4' },
        { filename: 'file.txt', path: undefined, expectedKey: 'general/file.txt' },
      ];

      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      mockS3Client.send.mockResolvedValue({});

      // Act & Assert
      for (const testCase of testCases) {
        const result = await UploadFileCloudflareR2Service.uploadFile(
          testCase.filename,
          mockFile,
          testCase.path,
        );

        expect(result.key).toBe(testCase.expectedKey);
      }
    });
  });

  describe('Error handling', () => {
    it('should handle missing s3ClientR2', async () => {
      // Arrange
      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: null,
        r2Bucket: 'test-bucket',
        cdnEndpoint: 'https://example.com',
      });

      // Act & Assert
      await expect(UploadFileCloudflareR2Service.uploadFile('test.jpg', mockFile)).rejects.toThrow(
        'Configurações do Cloudflare R2 não encontradas',
      );
    });

    it('should handle missing r2Bucket', async () => {
      // Arrange
      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: null,
        cdnEndpoint: 'https://example.com',
      });

      // Act & Assert
      await expect(UploadFileCloudflareR2Service.uploadFile('test.jpg', mockFile)).rejects.toThrow(
        'Configurações do Cloudflare R2 não encontradas',
      );
    });

    it('should handle missing cdnEndpoint', async () => {
      // Arrange
      (s3ClientCloudflareR2Constant as jest.Mock).mockResolvedValue({
        s3ClientR2: mockS3Client,
        r2Bucket: 'test-bucket',
        cdnEndpoint: null,
      });

      // Act & Assert
      await expect(UploadFileCloudflareR2Service.uploadFile('test.jpg', mockFile)).rejects.toThrow(
        'Configurações do Cloudflare R2 não encontradas',
      );
    });
  });
});

function clearAllMocks() {
  jest.clearAllMocks();
}
