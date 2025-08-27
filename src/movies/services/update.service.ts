import prisma from '../../_core/prisma.pg';
import { UpdateMoviesDto } from '../dtos/updateMovies.dto';
import { ReadMoviesDto } from '../dtos/readMovies.dto';
import { HttpException } from '../../_common/exceptions/httpException';

export class UpdateMoviesService {
  static async execute(
    movieUuid: string,
    updateMoviesDto: UpdateMoviesDto,
  ): Promise<ReadMoviesDto> {
    try {
      // Verificar se o filme existe
      const existingMovie = await prisma.movies.findUnique({
        where: { uuid: movieUuid },
      });

      if (!existingMovie) {
        throw new HttpException(404, 'Filme não encontrado');
      }

      // Atualizar o filme
      const movie = await prisma.movies.update({
        where: { uuid: movieUuid },
        data: {
          title: updateMoviesDto.title,
          originalTitle: updateMoviesDto.originalTitle,
          language: updateMoviesDto.language,
          situation: updateMoviesDto.situation,
          synopsis: updateMoviesDto.synopsis,
          popularity: updateMoviesDto.popularity,
          votesQuantity: updateMoviesDto.votesQuantity,
          ratingPercentage: updateMoviesDto.ratingPercentage,
          trailerUrl: updateMoviesDto.trailerUrl,
          posterUrl: updateMoviesDto.posterUrl,
          budget: updateMoviesDto.budget,
          revenue: updateMoviesDto.revenue,
          profit: updateMoviesDto.profit,
          releaseDate: updateMoviesDto.releaseDate,
          durationInMinutes: updateMoviesDto.durationInMinutes,
          genre: updateMoviesDto.genre,
          posterUuid: updateMoviesDto.posterUuid,
          userUuid: updateMoviesDto.userUuid,
        },
      });

      return movie as any;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Erro interno do servidor');
    }
  }
}
