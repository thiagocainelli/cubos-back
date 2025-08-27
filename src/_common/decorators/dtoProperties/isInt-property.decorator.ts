import { IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsIntPropertyDecorator
interface IsIntPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: number | number[]; // Example value for Swagger
}

// Custom decorator for validating integer properties
export function IsIntPropertyDecorator(options: IsIntPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required integer property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsInt(), // Validates the value as an integer
  ];

  // Configurations for an optional integer property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsInt(), // Validates the value as an integer
  ];

  // Configurations for a required array of integers
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsInt({ each: true }), // Validates each element in the array as an integer
  ];

  // Configurations for an optional array of integers
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsInt({ each: true }), // Validates each element in the array as an integer
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required integer property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional integer property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of integers
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of integers
  }
}
