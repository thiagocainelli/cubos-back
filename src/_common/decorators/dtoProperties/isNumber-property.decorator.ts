import { IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsNumberPropertyDecorator
interface IsNumberPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: number | number[]; // Example value for Swagger
}

// Custom decorator for validating number properties
export function IsNumberPropertyDecorator(options: IsNumberPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required number property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsNumber(), // Validates the value as a number
  ];

  // Configurations for an optional number property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsNumber(), // Validates the value as a number
  ];

  // Configurations for a required array of numbers
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsNumber(undefined, { each: true }), // Validates each element in the array as a number
  ];

  // Configurations for an optional array of numbers
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsNumber(undefined, { each: true }), // Validates each element in the array as a number
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required number property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional number property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of numbers
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of numbers
  }
}
