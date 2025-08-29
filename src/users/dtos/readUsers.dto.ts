import { IsEnumPropertyDecorator } from '../../_common/decorators/dtoProperties/isEnum-property.decorator';
import { IsEmailPropertyDecorator } from '../../_common/decorators/dtoProperties/isEmail-property.decorator';
import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';
import { IsDateStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isDateString-property.decorator';

import { UserTypeEnum } from '../enum/userType.enum';

/**
 * @swagger
 * components:
 *   schemas:
 *     ReadUsersDto:
 *       type: object
 *       required:
 *         - uuid
 *         - name
 *         - email
 *         - type
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *           description: User unique identifier
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           required: true
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
 *         type:
 *           type: string
 *           enum: [superAdmin, users]
 *           description: User type
 *           example: "users"
 *           required: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User created at
 *           example: "2025-05-07T08:32:28.840Z"
 *           required: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User updated at
 *           example: "2025-05-07T08:32:28.840Z"
 *           required: true
 */
export class ReadUsersDto {
  @IsStringPropertyDecorator({
    description: 'User uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  uuid!: string;

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

  @IsEnumPropertyDecorator({
    description: 'User type',
    example: 'user',
    required: true,
    enum: UserTypeEnum,
    enumName: 'UserType',
  })
  type!: UserTypeEnum;

  @IsDateStringPropertyDecorator({
    description: 'User created at',
    example: '2025-05-07T08:32:28.840Z',
    required: true,
  })
  createdAt!: Date;

  @IsDateStringPropertyDecorator({
    description: 'User updated at',
    example: '2025-05-07T08:32:28.840Z',
    required: true,
  })
  updatedAt!: Date;

  @IsDateStringPropertyDecorator({
    description: 'User deleted at',
    example: '2025-05-07T08:32:28.840Z',
    required: false,
  })
  deletedAt!: Date;
}
