import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStorageDto:
 *       type: object
 *       required:
 *         - file
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: Arquivo a ser enviado
 *         type:
 *           type: string
 *           description: Tipo do arquivo (opcional)
 *           example: "profile-image"
 */
export class CreateStorageDto {
  @IsStringPropertyDecorator({
    description: 'Tipo do arquivo (opcional)',
    example: 'profile-image',
    required: false,
  })
  type?: string;
}
