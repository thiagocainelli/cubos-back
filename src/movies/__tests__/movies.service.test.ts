import mockPrisma from '../../__tests__/mocks-backup/prisma.mock';
import { CreateMoviesService } from '../services/create.service';
import { ListMoviesService } from '../services/list.service';
import { ViewMoviesService } from '../services/view.service';
import { UpdateMoviesService } from '../services/update.service';
import { DeleteMoviesService } from '../services/delete.service';
import { mockMovieData, mockUserData } from '../../__tests__/mocks-backup/test.utils';
import { MovieSituationEnum } from '../enum/movieSituation.enum';

describe('MoviesService', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  describe('CreateMoviesService', () => {
    const mockCreateMovieDto = {
      title: 'New Movie',
      originalTitle: 'New Movie Original',
      language: 'English',
      situation: MovieSituationEnum.upcoming,
      synopsis: 'A new movie for testing',
      popularity: 90,
      votesQuantity: 500,
      ratingPercentage: 9.0,
      trailerUrl: 'https://example.com/trailer',
      posterUrl: 'https://example.com/poster.jpg',
      budget: 2000000,
      revenue: 8000000,
      profit: 6000000,
      releaseDate: new Date('2024-12-01T00:00:00.000Z'),
      durationInMinutes: 150,
      genre: ['Action', 'Sci-Fi'],
      posterUuid: '123e4567-e89b-12d3-a456-426614174003',
      userUuid: mockUserData.uuid,
    };

    it('should create movie successfully', async () => {
      // Arrange
      const newMovie = { ...mockMovieData, ...mockCreateMovieDto };
      (mockPrisma.movies.findFirst as jest.Mock).mockResolvedValue(null); // Filme não existe
      (mockPrisma.movies.create as jest.Mock).mockResolvedValue(newMovie);

      // Act
      const result = await CreateMoviesService.execute(mockCreateMovieDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(newMovie.uuid);
      expect(result?.title).toBe(newMovie.title);
      expect(result?.situation).toBe(newMovie.situation);
      expect(mockPrisma.movies.create).toHaveBeenCalledWith({
        data: mockCreateMovieDto,
      });
    });

    it('should throw error when database creation fails', async () => {
      // Arrange
      (mockPrisma.movies.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(CreateMoviesService.execute(mockCreateMovieDto)).rejects.toThrow(
        'Erro interno do servidor',
      );
    });
  });

  describe('ListMoviesService', () => {
    const mockPagination = {
      page: 1,
      itemsPerPage: 20,
      totalItems: 100,
      totalPages: 5,
    };

    it('should list movies with pagination successfully', async () => {
      // Arrange
      const movies = [mockMovieData];
      const totalCount = 1;

      (mockPrisma.movies.findMany as jest.Mock).mockResolvedValue(movies);
      (mockPrisma.movies.count as jest.Mock).mockResolvedValue(totalCount);

      // Act
      const result = await ListMoviesService.execute(1, 20, '', '', '');

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].uuid).toBe(movies[0].uuid);
      expect(result.data[0].title).toBe(movies[0].title);
      expect(result.total).toBe(totalCount);
      expect(mockPrisma.movies.findMany).toHaveBeenCalled();
      expect(mockPrisma.movies.count).toHaveBeenCalled();
    });

    it('should filter movies by search term', async () => {
      // Arrange
      const searchTerm = 'action';
      const movies = [mockMovieData];
      (mockPrisma.movies.findMany as jest.Mock).mockResolvedValue(movies);
      (mockPrisma.movies.count as jest.Mock).mockResolvedValue(1);

      // Act
      await ListMoviesService.execute(1, 20, searchTerm, '', '');

      // Assert
      expect(mockPrisma.movies.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: expect.arrayContaining([
                  expect.objectContaining({
                    title: expect.objectContaining({ contains: searchTerm, mode: 'insensitive' }),
                  }),
                  expect.objectContaining({
                    originalTitle: expect.objectContaining({
                      contains: searchTerm,
                      mode: 'insensitive',
                    }),
                  }),
                  expect.objectContaining({
                    synopsis: expect.objectContaining({
                      contains: searchTerm,
                      mode: 'insensitive',
                    }),
                  }),
                ]),
              }),
            ]),
          }),
        }),
      );
    });

    it('should filter movies by situation', async () => {
      // Arrange
      const situation = MovieSituationEnum.released;
      const movies = [mockMovieData];
      (mockPrisma.movies.findMany as jest.Mock).mockResolvedValue(movies);
      (mockPrisma.movies.count as jest.Mock).mockResolvedValue(1);

      // Act
      await ListMoviesService.execute(1, 20, '', situation, '');

      // Assert
      expect(mockPrisma.movies.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([expect.objectContaining({ situation: situation })]),
          }),
        }),
      );
    });

    it('should filter movies by genre', async () => {
      // Arrange
      const genre = 'Action';
      const movies = [mockMovieData];
      (mockPrisma.movies.findMany as jest.Mock).mockResolvedValue(movies);
      (mockPrisma.movies.count as jest.Mock).mockResolvedValue(1);

      // Act
      await ListMoviesService.execute(1, 20, '', '', genre);

      // Assert
      expect(mockPrisma.movies.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({ genre: expect.objectContaining({ has: genre }) }),
            ]),
          }),
        }),
      );
    });
  });

  describe('ViewMoviesService', () => {
    it('should return movie when found', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      (mockPrisma.movies.findUnique as jest.Mock).mockResolvedValue(mockMovieData);

      // Act
      const result = await ViewMoviesService.execute(movieUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.uuid).toBe(mockMovieData.uuid);
      expect(result?.title).toBe(mockMovieData.title);
      expect(mockPrisma.movies.findUnique).toHaveBeenCalledWith({
        where: { uuid: movieUuid },
      });
    });

    it('should throw error when movie not found', async () => {
      // Arrange
      const movieUuid = 'non-existent-uuid';
      (mockPrisma.movies.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(ViewMoviesService.execute(movieUuid)).rejects.toThrow('Filme não encontrado');
    });

    it('should return movie even when deleted', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      const deletedMovie = { ...mockMovieData, deletedAt: new Date() };
      (mockPrisma.movies.findUnique as jest.Mock).mockResolvedValue(deletedMovie);

      // Act
      const result = await ViewMoviesService.execute(movieUuid);

      // Assert
      expect(result).toBeDefined();
      expect(result?.deletedAt).toBeDefined();
    });
  });

  describe('UpdateMoviesService', () => {
    const mockUpdateMovieDto = {
      title: 'Updated Movie Title',
      synopsis: 'Updated synopsis',
      popularity: 95,
    };

    it('should update movie successfully', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      const updatedMovie = { ...mockMovieData, ...mockUpdateMovieDto };
      (mockPrisma.movies.update as jest.Mock).mockResolvedValue(updatedMovie);

      // Act
      const result = await UpdateMoviesService.execute(movieUuid, mockUpdateMovieDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.title).toBe(updatedMovie.title);
      expect(result?.synopsis).toBe(updatedMovie.synopsis);
      expect(mockPrisma.movies.update).toHaveBeenCalledWith({
        where: { uuid: movieUuid },
        data: mockUpdateMovieDto,
      });
    });

    it('should throw error when movie not found', async () => {
      // Arrange
      const movieUuid = 'non-existent-uuid';
      (mockPrisma.movies.update as jest.Mock).mockRejectedValue(new Error('Record not found'));

      // Act & Assert
      await expect(UpdateMoviesService.execute(movieUuid, mockUpdateMovieDto)).rejects.toThrow(
        'Erro interno do servidor',
      );
    });
  });

  describe('DeleteMoviesService', () => {
    it('should delete movie successfully (soft delete)', async () => {
      // Arrange
      const movieUuid = mockMovieData.uuid;
      const deletedMovie = { ...mockMovieData, deletedAt: new Date() };
      (mockPrisma.movies.update as jest.Mock).mockResolvedValue(deletedMovie);

      // Act
      const result = await DeleteMoviesService.execute(movieUuid);

      // Assert
      expect(result).toBeDefined();
      expect(mockPrisma.movies.update).toHaveBeenCalledWith({
        where: { uuid: movieUuid },
        data: { deletedAt: expect.any(Date) },
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
