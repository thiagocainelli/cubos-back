import { IsEmailPropertyDecorator } from '../../../_common/decorators/dtoProperties/isEmail-property.decorator';
import { IsStringPropertyDecorator } from '../../../_common/decorators/dtoProperties/isString-property.decorator';

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: User password (minimum 6 characters)
 *           example: "Teste@123"
 */
export class RegisterDto {
  @IsStringPropertyDecorator({
    description: 'User name',
    example: 'John Doe',
    required: true,
  })
  name!: string;

  @IsEmailPropertyDecorator({
    description: 'User email',
    example: 'john.doe@example.com',
    required: true,
  })
  email!: string;

  @IsStringPropertyDecorator({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    required: true,
  })
  password!: string;
}
