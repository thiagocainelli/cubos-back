import prisma from '../../_core/prisma.pg';
import { ReadMoviesDto } from '../dtos/readMovies.dto';
import { HttpException } from '../../_common/exceptions/httpException';

export class ViewMoviesService {
  static async execute(movieUuid: string): Promise<ReadMoviesDto> {
    try {
      const movie = await prisma.movies.findUnique({
        where: { uuid: movieUuid },
      });

      if (!movie) {
        throw new HttpException(404, 'Filme não encontrado');
      }

      return movie as any;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Erro interno do servidor');
    }
  }
}
