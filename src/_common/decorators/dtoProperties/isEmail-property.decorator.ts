import { IsNotEmpty, IsOptional, IsEmail, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsEmailPropertyDecorator
interface IsEmailPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating email properties
export function IsEmailPropertyDecorator(options: IsEmailPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required email property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsEmail(), // Validates the value as an email address
  ];

  // Configurations for an optional email property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsEmail(), // Validates the value as an email address
  ];

  // Configurations for a required array of email addresses
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsEmail(undefined, { each: true }), // Validates each element in the array as an email address
  ];

  // Configurations for an optional array of email addresses
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsEmail(undefined, { each: true }), // Validates each element in the array as an email address
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required email property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional email property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of email addresses
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of email addresses
  }
}
