import { IsNotEmpty, IsOptional, IsJSON, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsJSONPropertyDecorator
interface IsJSONPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating JSON properties
export function IsJSONPropertyDecorator(options: IsJSONPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required JSON property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsJSON(), // Validates the value as a JSON string
  ];

  // Configurations for an optional JSON property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsJSON(), // Validates the value as a JSON string
  ];

  // Configurations for a required array of JSON strings
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsJSON({ each: true }), // Validates each element in the array as a JSON string
  ];

  // Configurations for an optional array of JSON strings
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsJSON({ each: true }), // Validates each element in the array as a JSON string
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required JSON property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional JSON property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of JSON strings
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of JSON strings
  }
}
