import { IsBooleanPropertyDecorator } from '../../../_common/decorators/dtoProperties/isBoolean-property.decorator';
import { IsStringPropertyDecorator } from '../../../_common/decorators/dtoProperties/isString-property.decorator';
import { CreateUsersDto } from '../createUsers.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRepresentativesDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - type
 *       properties:
 *         code:
 *           type: string
 *           description: Código do representante
 *           example: 'rep-303'
 *           required: true
 *         documentNumber:
 *           type: string
 *           description: CPF/CNPJ do representante
 *           example: '12345678901'
 *           required: true
 *         phoneNumber:
 *           type: string
 *           description: Telefone do representante
 *           example: '54999999999'
 *           required: true
 *         region:
 *           type: string
 *           description: Região do representante
 *           example: 'Serra Gaúcha'
 *           required: true
 *         representativeType:
 *           type: string
 *           description: Tipo de representante
 *           example: 'Externo'
 *           required: true
 *         observations:
 *           type: string
 *           description: Observações do representante
 *           example: 'Representa clientes de alto volume na região Sul'
 *           required: false
 */
export class CreateRepresentativesDto extends CreateUsersDto {
  @IsStringPropertyDecorator({
    description: 'Código do representante',
    example: 'rep-303',
    required: true,
  })
  code!: string;

  @IsStringPropertyDecorator({
    description: 'CPF/CNPJ do representante',
    example: '12345678901',
    required: true,
  })
  documentNumber!: string;

  @IsStringPropertyDecorator({
    description: 'Telefone do representante',
    example: '54999999999',
    required: true,
  })
  phoneNumber!: string;

  @IsStringPropertyDecorator({
    description: 'Região do representante',
    example: 'Serra Gaúcha',
    required: true,
  })
  region!: string;

  @IsStringPropertyDecorator({
    description: 'Tipo de representante',
    example: 'Externo',
    required: true,
  })
  representativeType!: string;

  @IsStringPropertyDecorator({
    description: 'Observações do representante',
    example: 'Representa clientes de alto volume na região Sul',
    required: false,
  })
  observations!: string;

  @IsBooleanPropertyDecorator({
    description: 'Se o representante é ativo',
    example: true,
    required: true,
  })
  active!: boolean;
}
