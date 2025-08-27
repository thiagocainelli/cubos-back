import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';

export class ResetPasswordDto {
  @IsStringPropertyDecorator({
    description: 'New password of the user',
    example: 'Exemplo@123',
    required: true,
  })
  newPassword!: string;
}
