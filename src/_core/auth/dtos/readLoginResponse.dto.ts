import { IsObjectPropertyDecorator } from '../../../_common/decorators/dtoProperties/isObject-property.decorator';
import { IsStringPropertyDecorator } from '../../../_common/decorators/dtoProperties/isString-property.decorator';

import { ReadUsersDto } from '../../../users/dtos/readUsers.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     ReadLoginResponseDto:
 *       type: object
 *       required:
 *         - token
 *         - refreshToken
 *         - usersData
 *       properties:
 *         token:
 *           type: string
 *           format: jwt
 *           description: JWT Token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *         refreshToken:
 *           type: string
 *           format: jwt
 *           description: JWT Refresh Token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *         usersData:
 *           $ref: '#/components/schemas/ReadUserForDecoratorDto'
 */
export class ReadLoginResponseDto {
  @IsStringPropertyDecorator({
    description: 'JWT Token',
    example: 'token123',
    required: true,
  })
  token!: string;

  @IsStringPropertyDecorator({
    description: 'JWT Refresh Token',
    example: 'refreshToken123',
    required: true,
  })
  refreshToken!: string;

  @IsObjectPropertyDecorator({
    description: 'Users Information',
    required: true,
    objectType: ReadUsersDto,
  })
  usersData!: ReadUsersDto;
}
