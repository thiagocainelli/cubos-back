import { IsIntPropertyDecorator } from '../../_common/decorators/dtoProperties/isInt-property.decorator';
import { IsNumberPropertyDecorator } from '../../_common/decorators/dtoProperties/isNumber-property.decorator';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRatingDto:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Nova avaliação do filme (0-100)
 *           example: 95.5
 *           required: true
 *         votesQuantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade de votos para esta avaliação
 *           example: 1
 *           required: false
 */
export class UpdateRatingDto {
  @IsNumberPropertyDecorator({
    description: 'Nova avaliação do filme (0-100)',
    example: 95.5,
    required: true,
  })
  rating!: number;

  @IsIntPropertyDecorator({
    description: 'Quantidade de votos para esta avaliação',
    example: 1,
    required: false,
  })
  votesQuantity?: number;
}
