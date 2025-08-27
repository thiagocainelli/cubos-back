import { IsNumberPropertyDecorator } from '../../../_common/decorators/dtoProperties/isNumber-property.decorator';
import { IsObjectPropertyDecorator } from '../../../_common/decorators/dtoProperties/isObject-property.decorator';
import { ReadRepresentativesDto } from './readRepresentatives.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     ListRepresentativesDto:
 *       type: object
 *       required:
 *         - data
 *         - total
 *       properties:
 *         data:
 *           type: array
 *           description: Array de representantes
 *           items:
 *             $ref: '#/components/schemas/ReadRepresentativesDto'
 *         total:
 *           type: number
 *           description: Total de representantes
 *           example: 20
 */
export class ListRepresentativesDto {
  @IsObjectPropertyDecorator({
    description: 'Lista de representantes',
    required: true,
    objectType: ReadRepresentativesDto,
    isArray: true,
  })
  data!: ReadRepresentativesDto[];

  @IsNumberPropertyDecorator({
    description: 'Total de representantes',
    example: 20,
    required: true,
  })
  total!: number;
} 