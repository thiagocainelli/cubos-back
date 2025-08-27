import { NextFunction, Request, Response } from 'express';

// Exceptions
import { HttpException } from '../../_common/exceptions/httpException';

// Prisma
import prisma from '../prisma.pg';
import { HttpStatusCodeEnum } from '../../_common/enums/http-status.enum';

// Middleware de tratamento de erros
export const errorHandler = async (
  err: Error | HttpException,
  _req: Request,
  _res: Response,
  _next: NextFunction,
) => {
  const sanitizedBody = { ..._req.body };
  if ('password' in sanitizedBody) sanitizedBody.password = '********';

  const userUuid = _req.usersReq?.uuid ?? undefined;

  if (err instanceof HttpException) {
    await prisma.errorLogs.create({
      data: {
        statusCode: err.status || 500,
        error: HttpStatusCodeEnum[err.status],
        message: err.message || 'Internal Server Error',
        url: _req.url || '',
        headers: JSON.stringify(_req.headers),
        method: _req.method || '',
        request: JSON.stringify({
          body: sanitizedBody,
          query: _req.query,
          params: _req.params,
        }),
        userUuid: userUuid,
      },
    });

    return _res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  await prisma.errorLogs.create({
    data: {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      url: _req.url || '',
      headers: JSON.stringify(_req.headers),
      method: _req.method || '',
      request: JSON.stringify({
        body: sanitizedBody,
        query: _req.query,
        params: _req.params,
      }),
      userUuid: userUuid,
    },
  });

  // Erro inesperado (500)
  _res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
};
