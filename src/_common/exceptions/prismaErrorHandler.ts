import { Prisma } from '../../../prisma-outputs/postgres-client';
import { HttpException } from './httpException';

// Função para tratar erros do Prisma
export function handlePrismaError(error: any) {
  console.log(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new HttpException(409, `Duplicate field: ${error.meta?.target}`);
      case 'P2025':
        throw new HttpException(404, 'Record not found');
      // Aqui você pode adicionar mais casos se quiser no futuro
      default:
        throw new HttpException(400, `Database error: ${error.message}`);
    }
  }

  // Handle HttpException errors
  if (error instanceof HttpException) {
    throw error;
  }

  // Outros erros não mapeados (fallback)
  throw new HttpException(500, 'Unexpected database error');
}
