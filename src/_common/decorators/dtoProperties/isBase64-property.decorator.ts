import { IsNotEmpty, IsOptional, IsBase64, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsBase64PropertyDecorator
interface IsBase64PropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating Base64 properties
export function IsBase64PropertyDecorator(options: IsBase64PropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required Base64 string
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsBase64(), // Validates the value as Base64
  ];

  // Configurations for an optional Base64 string
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsBase64(), // Validates the value as Base64
  ];

  // Configurations for a required array of Base64 strings
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsBase64(undefined, { each: true }), // Validates each array element as Base64
  ];

  // Configurations for an optional array of Base64 strings
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsBase64(undefined, { each: true }), // Validates each array element as Base64
  ];

  // Applies appropriate configurations based on options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required Base64 string
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional Base64 string
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of Base64 strings
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of Base64 strings
  }
}
