import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';

export class UpdatePasswordDto {
  @IsStringPropertyDecorator({
    description: 'Current password of the user',
    example: 'Teste@123',
    required: true,
  })
  currentPassword!: string;

  @IsStringPropertyDecorator({
    description: 'New password of the user',
    example: 'Teste@123',
    required: true,
  })
  newPassword!: string;
}
