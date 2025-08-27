import { IsNotEmpty, IsOptional, IsJWT, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsJWTPropertyDecorator
interface IsJWTPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating JWT properties
export function IsJWTPropertyDecorator(options: IsJWTPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required JWT property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsJWT(), // Validates the value as a JWT
  ];

  // Configurations for an optional JWT property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsJWT(), // Validates the value as a JWT
  ];

  // Configurations for a required array of JWTs
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsJWT({ each: true }), // Validates each element in the array as a JWT
  ];

  // Configurations for an optional array of JWTs
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsJWT({ each: true }), // Validates each element in the array as a JWT
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required JWT property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional JWT property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of JWTs
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of JWTs
  }
}
