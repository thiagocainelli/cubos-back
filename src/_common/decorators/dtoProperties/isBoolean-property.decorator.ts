import { IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsBooleanPropertyDecorator
interface IsBooleanPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: boolean | boolean[]; // Example value for Swagger
}

// Custom decorator for validating boolean properties
export function IsBooleanPropertyDecorator(options: IsBooleanPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required boolean property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsBoolean(), // Validates the value as a boolean
  ];

  // Configurations for an optional boolean property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsBoolean(), // Validates the value as a boolean
  ];

  // Configurations for a required array of booleans
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsBoolean({ each: true }), // Validates each array element as a boolean
  ];

  // Configurations for an optional array of booleans
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsBoolean({ each: true }), // Validates each array element as a boolean
  ];

  // Applies the appropriate configurations based on options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required boolean property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional boolean property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of booleans
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of booleans
  }
}
