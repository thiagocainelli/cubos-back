import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsStringPropertyDecorator
interface IsStringPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating string properties
export function IsStringPropertyDecorator(options: IsStringPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required string property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsString(), // Validates the value as a string
  ];

  // Configurations for an optional string property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsString(), // Validates the value as a string
  ];

  // Configurations for a required array of strings
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsString({ each: true }), // Validates each element in the array as a string
  ];

  // Configurations for an optional array of strings
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsString({ each: true }), // Validates each element in the array as a string
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required string property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional string property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of strings
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of strings
  }
}
