import { IsNumberPropertyDecorator } from '../../_common/decorators/dtoProperties/isNumber-property.decorator';
import { IsObjectPropertyDecorator } from '../../_common/decorators/dtoProperties/isObject-property.decorator';

import { ReadUsersDto } from './readUsers.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     ListUsersDto:
 *       type: object
 *       required:
 *         - data
 *         - total
 *       properties:
 *         data:
 *           type: array
 *           description: Array of user objects
 *           items:
 *             $ref: '#/components/schemas/ReadUsersDto'
 *         total:
 *           type: number
 *           description: Total number of users
 *           example: 20
 */
export class ListUsersDto {
  @IsObjectPropertyDecorator({
    description: 'User Object',
    required: true,
    objectType: ReadUsersDto,
    isArray: true,
  })
  data!: ReadUsersDto[];

  @IsNumberPropertyDecorator({
    description: 'Total of users',
    example: 20,
    required: true,
  })
  total!: number;
}
