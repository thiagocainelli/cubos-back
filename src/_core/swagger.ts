import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cubos Tecnologia | Backend Teste',
      version: '1.0.0',
      description: 'Cubos | Backend Teste',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        defaultModelsExpandDepth: -1,
        operationsSorter: (a: any, b: any) => {
          const order: Record<string, string> = {
            post: '0',
            get: '1',
            put: '2',
            patch: '3',
            delete: '4',
          };
          return (
            order[a.get('method')].localeCompare(order[b.get('method')]) ||
            a.get('path').localeCompare(b.get('path'))
          );
        },
      },
    }),
  );
};
