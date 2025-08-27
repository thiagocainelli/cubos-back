import prisma from '../../_core/prisma.pg';
import { HttpException } from '../../_common/exceptions/httpException';

export class DeleteMoviesService {
  static async execute(movieUuid: string): Promise<{ message: string }> {
    try {
      // Verificar se o filme existe
      const existingMovie = await prisma.movies.findUnique({
        where: { uuid: movieUuid },
      });

      if (!existingMovie) {
        throw new HttpException(404, 'Filme não encontrado');
      }

      // Excluir o filme (soft delete)
      await prisma.movies.update({
        where: { uuid: movieUuid },
        data: { deletedAt: new Date() },
      });

      return { message: 'Filme excluído com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Erro interno do servidor');
    }
  }
}
