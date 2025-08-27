import prisma from '../../_core/prisma.pg';
import { CreateMoviesDto } from '../dtos/createMovies.dto';
import { ReadMoviesDto } from '../dtos/readMovies.dto';
import { HttpException } from '../../_common/exceptions/httpException';

export class CreateMoviesService {
  static async execute(createMoviesDto: CreateMoviesDto): Promise<ReadMoviesDto> {
    try {
      // Verificar se já existe um filme com o mesmo título
      const existingMovie = await prisma.movies.findFirst({
        where: {
          title: createMoviesDto.title,
        },
      });

      if (existingMovie) {
        throw new HttpException(400, 'Já existe um filme com este título');
      }

      // Criar o filme
      const movie = await prisma.movies.create({
        data: {
          title: createMoviesDto.title,
          originalTitle: createMoviesDto.originalTitle,
          language: createMoviesDto.language,
          situation: createMoviesDto.situation,
          synopsis: createMoviesDto.synopsis,
          popularity: createMoviesDto.popularity || 0,
          votesQuantity: createMoviesDto.votesQuantity || 0,
          ratingPercentage: createMoviesDto.ratingPercentage || 0,
          trailerUrl: createMoviesDto.trailerUrl,
          posterUrl: createMoviesDto.posterUrl,
          budget: createMoviesDto.budget,
          revenue: createMoviesDto.revenue,
          profit: createMoviesDto.profit,
          releaseDate: createMoviesDto.releaseDate,
          durationInMinutes: createMoviesDto.durationInMinutes,
          genre: createMoviesDto.genre || [],
          posterUuid: createMoviesDto.posterUuid,
          userUuid: createMoviesDto.userUuid,
        },
      });

      // Retornar o filme criado
      return movie as any;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Erro interno do servidor');
    }
  }
}
