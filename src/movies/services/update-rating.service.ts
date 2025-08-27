import prisma from '../../_core/prisma.pg';
import { UpdateRatingDto } from '../dtos/updateRating.dto';
import { ReadMoviesDto } from '../dtos/readMovies.dto';
import { HttpException } from '../../_common/exceptions/httpException';

export class UpdateRatingMoviesService {
  static async execute(
    movieUuid: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<ReadMoviesDto> {
    try {
      // Verificar se o filme existe
      const existingMovie = await prisma.movies.findUnique({
        where: { uuid: movieUuid },
      });

      if (!existingMovie) {
        throw new HttpException(404, 'Filme não encontrado');
      }

      // Calcular novo rating médio
      const currentVotes = existingMovie.votesQuantity || 0;
      const currentRating = existingMovie.ratingPercentage || 0;
      const newVotes = updateRatingDto.votesQuantity || 1;
      const newRating = updateRatingDto.rating;

      const totalVotes = currentVotes + newVotes;
      const totalRating = currentRating * currentVotes + newRating * newVotes;
      const averageRating = totalRating / totalVotes;

      // Atualizar o filme
      const movie = await prisma.movies.update({
        where: { uuid: movieUuid },
        data: {
          votesQuantity: totalVotes,
          ratingPercentage: averageRating,
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
