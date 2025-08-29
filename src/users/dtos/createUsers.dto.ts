import { IsEnumPropertyDecorator } from '../../_common/decorators/dtoProperties/isEnum-property.decorator';
import { IsEmailPropertyDecorator } from '../../_common/decorators/dtoProperties/isEmail-property.decorator';
import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';

import { UserTypeEnum } from '../enum/userType.enum';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUsersDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - type
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
 *           required: true
 *         type:
 *           type: string
 *           enum: [superAdmin, users]
 *           description: User type
 *           example: "users"
 *           required: true
 */
export class CreateUsersDto {
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
    required: true,
  })
  password!: string;

  @IsEnumPropertyDecorator({
    description: 'User type',
    example: 'user',
    required: true,
    enum: UserTypeEnum,
    enumName: 'UserType',
  })
  type!: UserTypeEnum;
}
