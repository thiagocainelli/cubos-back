import { IsBooleanPropertyDecorator } from '../../../_common/decorators/dtoProperties/isBoolean-property.decorator';
import { IsStringPropertyDecorator } from '../../../_common/decorators/dtoProperties/isString-property.decorator';
import { UpdateUsersDto } from '../updateUsers.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRepresentativesDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - type
 *       properties:
 *         code:
 *           type: string
 *           description: Código do representante
 *           example: 'rep-303'
 *           required: false
 *         documentNumber:
 *           type: string
 *           description: CPF/CNPJ do representante
 *           example: '12345678901'
 *           required: false
 *         phoneNumber:
 *           type: string
 *           description: Telefone do representante
 *           example: '54999999999'
 *           required: false
 *         region:
 *           type: string
 *           description: Região do representante
 *           example: 'Serra Gaúcha'
 *           required: false
 *         representativeType:
 *           type: string
 *           description: Tipo de representante
 *           example: 'Externo'
 *           required: false
 *         observations:
 *           type: string
 *           description: Observações do representante
 *           example: 'Representa clientes de alto volume na região Sul'
 *           required: false
 */
export class UpdateRepresentativesDto extends UpdateUsersDto {
  @IsStringPropertyDecorator({
    description: 'Código do representante',
    example: 'rep-303',
    required: false,
  })
  code?: string;

  @IsStringPropertyDecorator({
    description: 'CPF/CNPJ do representante',
    example: '12345678901',
    required: false,
  })
  documentNumber?: string;

  @IsStringPropertyDecorator({
    description: 'Telefone do representante',
    example: '54999999999',
    required: false,
  })
  phoneNumber?: string;

  @IsStringPropertyDecorator({
    description: 'Região do representante',
    example: 'Serra Gaúcha',
    required: false,
  })
  region?: string;

  @IsStringPropertyDecorator({
    description: 'Tipo de representante',
    example: 'Externo',
    required: false,
  })
  representativeType?: string;

  @IsStringPropertyDecorator({
    description: 'Observações do representante',
    example: 'Representa clientes de alto volume na região Sul',
    required: false,
  })
  observations?: string;

  @IsBooleanPropertyDecorator({
    description: 'Se o representante é ativo',
    example: true,
    required: false,
  })
  active?: boolean;
}
