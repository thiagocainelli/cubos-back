import { IsArray, IsNotEmpty, IsOptional, IsHexadecimal } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsHexadecimalPropertyDecorator
interface IsHexadecimalPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating hexadecimal properties
export function IsHexadecimalPropertyDecorator(options: IsHexadecimalPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required hexadecimal property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsHexadecimal(), // Validates the value as a hexadecimal string
  ];

  // Configurations for an optional hexadecimal property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsHexadecimal(), // Validates the value as a hexadecimal string
  ];

  // Configurations for a required array of hexadecimal values
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsHexadecimal({ each: true }), // Validates each element in the array as a hexadecimal string
  ];

  // Configurations for an optional array of hexadecimal values
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsHexadecimal({ each: true }), // Validates each element in the array as a hexadecimal string
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required hexadecimal property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional hexadecimal property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of hexadecimals
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of hexadecimals
  }
}
