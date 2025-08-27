import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';
import { IsDateStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isDateString-property.decorator';

/**
 * @swagger
 * components:
 *   schemas:
 *     ReadStorageDto:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the storage
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           description: Nome do arquivo
 *           example: "profile-image.jpg"
 *         key:
 *           type: string
 *           description: Chave única do arquivo no storage
 *           example: "users/profile-images/123e4567-e89b-12d3-a456-426614174000.jpg"
 *         mimetype:
 *           type: string
 *           description: Tipo MIME do arquivo
 *           example: "image/jpeg"
 *         type:
 *           type: string
 *           description: Tipo do arquivo
 *           example: "profile-image"
 *         url:
 *           type: string
 *           description: URL pública do arquivo
 *           example: "https://storage.example.com/users/profile-images/123e4567-e89b-12d3-a456-426614174000.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *           example: "2024-03-20T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *           example: "2024-03-20T10:00:00Z"
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Deletion date
 *           example: "2024-03-20T10:00:00Z"
 */
export class ReadStorageDto {
  @IsStringPropertyDecorator({
    description: 'Unique identifier of the storage',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  uuid!: string;

  @IsStringPropertyDecorator({
    description: 'Nome do arquivo',
    example: 'profile-image.jpg',
    required: true,
  })
  name!: string;

  @IsStringPropertyDecorator({
    description: 'Chave única do arquivo no storage',
    example: 'users/profile-images/123e4567-e89b-12d3-a456-426614174000.jpg',
    required: true,
  })
  key!: string;

  @IsStringPropertyDecorator({
    description: 'Tipo MIME do arquivo',
    example: 'image/jpeg',
    required: false,
  })
  mimetype?: string;

  @IsStringPropertyDecorator({
    description: 'Tipo do arquivo',
    example: 'profile-image',
    required: false,
  })
  type?: string;

  @IsStringPropertyDecorator({
    description: 'URL pública do arquivo',
    example:
      'https://storage.example.com/users/profile-images/123e4567-e89b-12d3-a456-426614174000.jpg',
    required: false,
  })
  url?: string;

  @IsDateStringPropertyDecorator({
    description: 'Creation date',
    example: '2024-03-20T10:00:00Z',
    required: true,
  })
  createdAt!: Date;

  @IsDateStringPropertyDecorator({
    description: 'Last update date',
    example: '2024-03-20T10:00:00Z',
    required: true,
  })
  updatedAt!: Date;

  @IsDateStringPropertyDecorator({
    description: 'Deletion date',
    example: '2024-03-20T10:00:00Z',
    required: false,
  })
  deletedAt?: Date;
}
