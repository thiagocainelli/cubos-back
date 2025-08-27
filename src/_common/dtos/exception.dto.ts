import { IsNumberPropertyDecorator } from '../decorators/dtoProperties/isNumber-property.decorator';
import { IsStringPropertyDecorator } from '../decorators/dtoProperties/isString-property.decorator';

// Data Transfer Object (DTO) for handling exceptions
export class ExceptionDto {
  // Status code of the error (e.g., HTTP status code)
  @IsNumberPropertyDecorator({
    description: 'Error code', // Description for Swagger documentation
    required: true, // Indicates that this property is required
    example: 400, // Example value for Swagger
  })
  statusCode!: number;

  // Short description of the error
  @IsStringPropertyDecorator({
    description: 'Error description', // Description for Swagger documentation
    required: true, // Indicates that this property is required
    example: 'Bad Request', // Example value for Swagger
  })
  error!: string;

  // Detailed error message
  @IsStringPropertyDecorator({
    description: 'Error message', // Description for Swagger documentation
    required: true, // Indicates that this property is required
    example: 'Bad Request', // Example value for Swagger
  })
  message!: string;
}
