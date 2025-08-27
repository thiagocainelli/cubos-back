import { IsUrlPropertyDecorator } from '../../_common/decorators/dtoProperties/isUrl-property.decorator';
import { IsEnumPropertyDecorator } from '../../_common/decorators/dtoProperties/isEnum-property.decorator';
import { IsEmailPropertyDecorator } from '../../_common/decorators/dtoProperties/isEmail-property.decorator';
import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';

import { UserTypeEnum } from '../enum/userType.enum';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUsersDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: User name
 *           example: "John Doe"
 *           required: true
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *           example: "john.doe@example.com"
 *           required: true
 *         password:
 *           type: string
 *           description: User password
 *           example: "Exemplo@123"
 *           required: false
 */
export class UpdateUsersDto {
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
    description: 'User password',
    example: 'Exemplo@123',
    required: false,
  })
  password!: string;
}
