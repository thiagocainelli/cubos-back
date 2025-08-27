import { IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsEnumPropertyDecorator
interface IsEnumPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  enum: object; // Enum object to validate against
  enumName: string; // Name of the enum for Swagger documentation
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating enum properties
export function IsEnumPropertyDecorator(options: IsEnumPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required enum property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsEnum(options.enum), // Validates the value as a member of the enum
  ];

  // Configurations for an optional enum property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsEnum(options.enum), // Validates the value as a member of the enum
  ];

  // Configurations for a required array of enum values
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsEnum(options.enum, { each: true }), // Validates each element in the array as a member of the enum
  ];

  // Configurations for an optional array of enum values
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsEnum(options.enum, { each: true }), // Validates each element in the array as a member of the enum
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required enum property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional enum property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of enums
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of enums
  }
}
