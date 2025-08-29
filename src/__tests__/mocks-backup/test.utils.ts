import { Request, Response } from 'express';
import { UserTypeEnum } from '../../users/enum/userType.enum';
import { MovieSituationEnum } from '../../movies/enum/movieSituation.enum';

// Mock do Request
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  headers: {},
  ...overrides,
});

// Mock do Response
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Dados de teste para usuários
export const mockUserData = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test User',
  email: 'test@example.com',
  password: 'encrypted:password',
  type: UserTypeEnum.users,
  profileImage: null,
  refreshToken: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: null,
  storageUuid: null,
};

// Dados de teste para super admin
export const mockSuperAdminData = {
  ...mockUserData,
  uuid: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Super Admin',
  email: 'admin@example.com',
  type: UserTypeEnum.superAdmin,
};

// Dados de teste para filmes
export const mockMovieData = {
  uuid: '123e4567-e89b-12d3-a456-426614174002',
  title: 'Test Movie',
  originalTitle: 'Test Movie Original',
  language: 'English',
  situation: MovieSituationEnum.released,
  synopsis: 'A test movie for testing purposes',
  popularity: 85,
  votesQuantity: 1000,
  ratingPercentage: 8.5,
  trailerUrl: 'https://example.com/trailer',
  posterUrl: 'https://example.com/poster.jpg',
  budget: 1000000,
  revenue: 5000000,
  profit: 4000000,
  releaseDate: new Date('2024-01-01T00:00:00.000Z'),
  durationInMinutes: 120,
  genre: ['Action', 'Adventure'],
  posterUuid: '123e4567-e89b-12d3-a456-426614174003',
  userUuid: mockUserData.uuid,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: null,
};

// Dados de teste para storage
export const mockStorageData = {
  uuid: '123e4567-e89b-12d3-a456-426614174003',
  name: 'test-image.jpg',
  key: 'profile-image/test-image.jpg',
  mimetype: 'image/jpeg',
  type: 'profile-image',
  url: 'https://example.com/test-image.jpg',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: null,
};

// Mock de arquivo para upload
export const mockFile = {
  fieldname: 'file',
  originalname: 'test-image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test-image-content'),
  size: 1024,
} as Express.Multer.File;

// Helper para limpar mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};
