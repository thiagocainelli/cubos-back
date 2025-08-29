import {
  listMovies,
  createMovies,
  updateMovies,
  viewMovies,
  deleteMovies,
} from '../movies.controller';
import { createMockRequest, createMockResponse } from '../../__tests__/mocks-backup/test.utils';
import { mockMovieData } from '../../__tests__/mocks-backup/test.utils';
import { MovieSituationEnum } from '../enum/movieSituation.enum';
import { MoviesService } from '../movies.service';
import mockPrisma from '../../__tests__/mocks-backup/prisma.mock';

jest.mock('../../movies/movies.service', () => ({
  MoviesService: {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    view: jest.fn(),
    delete: jest.fn(),
    updateRating: jest.fn(),
  },
}));

describe('MoviesController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    clearAllMocks();
  });

  describe('listMovies', () => {
    it('should list movies with default pagination', async () => {
      // Arrange
      const mockResponse = {
        movies: [mockMovieData],
        pagination: {
          page: 1,
          itemsPerPage: 20,
          totalItems: 1,
          totalPages: 1,
        },
      };

      (MoviesService.list as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await listMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.list).toHaveBeenCalledWith(
        1,
        20,
        undefined,
        undefined,
        undefined,
        0,
        0,
        undefined,
        undefined,
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should list movies with custom pagination and filters', async () => {
      // Arrange
      const mockResponse = {
        movies: [mockMovieData],
        pagination: {
          page: 2,
          itemsPerPage: 10,
          totalItems: 25,
          totalPages: 3,
        },
      };

      mockReq.query = {
        page: '2',
        itemsPerPage: '10',
        search: 'action',
        situation: MovieSituationEnum.released,
        genre: 'Action',
      };

      (MoviesService.list as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await listMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.list).toHaveBeenCalledWith(
        2,
        10,
        'action',
        MovieSituationEnum.released,
        'Action',
        0,
        0,
        undefined,
        undefined,
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle list errors', async () => {
      // Arrange
      (MoviesService.list as jest.Mock).mockRejectedValue(new Error('List failed'));

      // Act & Assert
      await expect(listMovies(mockReq, mockRes)).rejects.toThrow('List failed');
    });
  });

  describe('createMovies', () => {
    it('should create movie successfully', async () => {
      // Arrange
      const createMovieDto = {
        title: 'New Movie',
        originalTitle: 'New Movie Original',
        language: 'English',
        situation: MovieSituationEnum.upcoming,
        synopsis: 'A new movie for testing',
        genre: ['Action', 'Adventure'],
      };
      const mockResponse = {
        uuid: 'new-uuid',
        ...createMovieDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockReq.body = createMovieDto;
      (MoviesService.create as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await createMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle creation errors', async () => {
      // Arrange
      const createMovieDto = { title: 'Movie' };
      mockReq.body = createMovieDto;
      (MoviesService.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));

      // Act & Assert
      await expect(createMovies(mockReq, mockRes)).rejects.toThrow('Creation failed');
    });
  });

  describe('updateMovies', () => {
    it('should update movie successfully', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      const updateMovieDto = {
        title: 'Updated Movie Title',
        synopsis: 'Updated synopsis',
        popularity: 95,
      };
      const mockResponse = {
        ...mockMovieData,
        ...updateMovieDto,
        updatedAt: new Date(),
      };

      mockReq.query.uuid = movieUuid;
      mockReq.body = updateMovieDto;
      (MoviesService.update as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await updateMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.update).toHaveBeenCalledWith(movieUuid, updateMovieDto);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle update errors', async () => {
      // Arrange
      const movieUuid = 'non-existent-uuid';
      const updateMovieDto = { title: 'Updated Title' };
      mockReq.query.uuid = movieUuid;
      mockReq.body = updateMovieDto;
      (MoviesService.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

      // Act & Assert
      await expect(updateMovies(mockReq, mockRes)).rejects.toThrow('Update failed');
    });
  });

  describe('viewMovies', () => {
    it('should return movie when found', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      const mockResponse = {
        uuid: mockMovieData.uuid,
        title: mockMovieData.title,
        synopsis: mockMovieData.synopsis,
        situation: mockMovieData.situation,
      };

      mockReq.query.uuid = movieUuid;
      (MoviesService.view as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await viewMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.view).toHaveBeenCalledWith(movieUuid);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle movie not found', async () => {
      // Arrange
      const movieUuid = 'non-existent-uuid';
      mockReq.query.uuid = movieUuid;
      (MoviesService.view as jest.Mock).mockResolvedValue(null);

      // Act
      await viewMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.view).toHaveBeenCalledWith(movieUuid);
      expect(mockRes.json).toHaveBeenCalledWith(null);
    });

    it('should handle view errors', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      mockReq.query.uuid = movieUuid;
      (MoviesService.view as jest.Mock).mockRejectedValue(new Error('View failed'));

      // Act & Assert
      await expect(viewMovies(mockReq, mockRes)).rejects.toThrow('View failed');
    });
  });

  describe('deleteMovies', () => {
    it('should delete movie successfully', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      const mockResponse = {
        ...mockMovieData,
        deletedAt: new Date(),
      };

      mockReq.query.uuid = movieUuid;
      (MoviesService.delete as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await deleteMovies(mockReq, mockRes);

      // Assert
      expect(MoviesService.delete).toHaveBeenCalledWith(movieUuid);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle delete errors', async () => {
      // Arrange
      const movieUuid = 'non-existent-uuid';
      mockReq.query.uuid = movieUuid;
      (MoviesService.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      // Act & Assert
      await expect(deleteMovies(mockReq, mockRes)).rejects.toThrow('Delete failed');
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
