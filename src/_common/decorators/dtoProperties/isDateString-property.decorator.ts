import { IsNotEmpty, IsOptional, IsDateString, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsDateStringPropertyDecorator
interface IsDateStringPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating ISO date strings
export function IsDateStringPropertyDecorator(options: IsDateStringPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required date string property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsDateString(), // Validates the value as an ISO date string
  ];

  // Configurations for an optional date string property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsDateString(), // Validates the value as an ISO date string
  ];

  // Configurations for a required array of date strings
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsDateString(undefined, { each: true }), // Validates each element in the array as an ISO date string
  ];

  // Configurations for an optional array of date strings
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsDateString(undefined, { each: true }), // Validates each element in the array as an ISO date string
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required date string property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional date string property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of date strings
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of date strings
  }
}
