import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpException } from '../../_common/exceptions/httpException';

const extractValidationErrors = (errors: any[]): string[] => {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      messages.push(...constraintValues.map((value) => String(value)));
    }

    if (error.children && error.children.length > 0) {
      messages.push(...extractValidationErrors(error.children));
    }
  }

  return messages;
};

/**
 * Gera um middleware que:
 * - Converte req.body para a classe DTO
 * - Executa class-validator
 * - Lança HttpException(400) em caso de erro
 */
export const validationMiddleware = (
  DTOClass: new () => object,
  skipMissingProperties = false,
): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // transforma o JSON em instância da classe
      const dtoObject = plainToInstance(DTOClass, req.body);

      // validações do class-validator
      const errors = await validate(dtoObject, {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        // extrai mensagens de erro usando função auxiliar
        const messages = extractValidationErrors(errors);

        if (messages.length === 0) {
          // fallback caso não consiga extrair mensagens específicas
          return next(new HttpException(400, 'Dados inválidos fornecidos'));
        }

        // dispara exceção padronizada
        return next(new HttpException(400, messages.join(', ')));
      }

      // sobrescreve req.body com o DTO instanciado
      req.body = dtoObject;
      next();
    } catch (error) {
      // tratamento de erro genérico
      return next(new HttpException(400, 'Erro na validação dos dados'));
    }
  };
};
