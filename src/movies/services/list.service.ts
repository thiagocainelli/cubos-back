import prisma from '../../_core/prisma.pg';
import { ListMoviesDto } from '../dtos/listMovies.dto';
import { HttpException } from '../../_common/exceptions/httpException';
import { MovieSituation, Prisma } from '../../../prisma-outputs/postgres-client';

interface PaginationResponse {
  data: ListMoviesDto[];
  total: number;
}

export class ListMoviesService {
  static async execute(
    page: number,
    itemsPerPage: number,
    search?: string,
    situation?: string,
    genre?: string,
    durationStart?: number,
    durationEnd?: number,
    releaseStart?: Date,
    releaseEnd?: Date,
  ): Promise<PaginationResponse> {
    try {
      const whereClause: Prisma.MoviesWhereInput = {
        AND: [],
        deletedAt: null,
      };
      whereClause.AND = [];

      if (search) {
        whereClause.AND.push({
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { originalTitle: { contains: search, mode: 'insensitive' } },
            { synopsis: { contains: search, mode: 'insensitive' } },
          ],
        });
      }

      if (situation) {
        whereClause.AND.push({
          situation: situation as MovieSituation,
        });
      }

      if (genre) {
        whereClause.AND.push({
          genre: { has: genre },
        });
      }

      if (durationStart && durationEnd) {
        whereClause.AND.push({
          durationInMinutes: { gte: durationStart, lte: durationEnd },
        });
      }

      if (releaseStart && releaseEnd) {
        const releaseDateStart = new Date(releaseStart);
        releaseDateStart.setHours(0, 0, 0, 0);
        const releaseDateEnd = new Date(releaseEnd);
        releaseDateEnd.setHours(23, 59, 59, 999);

        whereClause.AND.push({
          releaseDate: { gte: releaseDateStart, lte: releaseDateEnd },
        });
      }

      // Calcular offset
      const offset = (page - 1) * itemsPerPage;

      // Buscar filmes com paginação
      const [movies, total] = await Promise.all([
        prisma.movies.findMany({
          where: whereClause,
          skip: offset,
          take: itemsPerPage,
          orderBy: { title: 'asc' },
        }),
        prisma.movies.count({ where: whereClause }),
      ]);

      // Calcular total de páginas
      const totalPages = Math.ceil(total / itemsPerPage);

      // Mapear para DTO
      const data =
        movies?.map((movie) => ({
          uuid: movie.uuid,
          title: movie.title || undefined,
          originalTitle: movie.originalTitle || undefined,
          language: movie.language || undefined,
          situation: movie.situation || undefined,
          synopsis: movie.synopsis || undefined,
          popularity: movie.popularity || undefined,
          votesQuantity: movie.votesQuantity || undefined,
          ratingPercentage: movie.ratingPercentage || undefined,
          trailerUrl: movie.trailerUrl || undefined,
          posterUrl: movie.posterUrl || undefined,
          budget: movie.budget || undefined,
          revenue: movie.revenue || undefined,
          profit: movie.profit || undefined,
          releaseDate: movie.releaseDate || undefined,
          durationInMinutes: movie.durationInMinutes || undefined,
          genre: movie.genre || undefined,
          posterUuid: movie.posterUuid || undefined,
          userUuid: movie.userUuid || undefined,
          createdAt: movie.createdAt || undefined,
          updatedAt: movie.updatedAt || undefined,
        })) || [];

      return {
        data: data as ListMoviesDto[],
        total,
      };
    } catch (error) {
      throw new HttpException(500, 'Erro interno do servidor');
    }
  }
}
