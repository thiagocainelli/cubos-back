import { IsJWTPropertyDecorator } from '../../../_common/decorators/dtoProperties/isJWT-property.decorator';

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshTokenAuthDto:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           format: jwt
 *           description: Refresh Token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 */
export class RefreshTokenAuthDto {
  @IsJWTPropertyDecorator({
    description: 'Refresh Token',
    example: 'refreshToken123',
    required: true,
  })
  refreshToken!: string;
}
