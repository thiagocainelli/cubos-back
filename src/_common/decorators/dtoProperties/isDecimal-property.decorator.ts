import { IsNotEmpty, IsOptional, IsDecimal, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsDecimalPropertyDecorator
interface IsDecimalPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: number | number[]; // Example value for Swagger
}

// Custom decorator for validating decimal properties
export function IsDecimalPropertyDecorator(options: IsDecimalPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required decimal property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsDecimal(), // Validates the value as a decimal
  ];

  // Configurations for an optional decimal property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsDecimal(), // Validates the value as a decimal
  ];

  // Configurations for a required array of decimals
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsDecimal(undefined, { each: true }), // Validates each element in the array as a decimal
  ];

  // Configurations for an optional array of decimals
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsDecimal(undefined, { each: true }), // Validates each element in the array as a decimal
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required decimal property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional decimal property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of decimals
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of decimals
  }
}
