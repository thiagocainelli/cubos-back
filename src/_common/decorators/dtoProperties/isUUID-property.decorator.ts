import { IsNotEmpty, IsOptional, IsUUID, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsUUIDPropertyDecorator
interface IsUUIDPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating UUID properties
export function IsUUIDPropertyDecorator(options: IsUUIDPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required UUID property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsUUID(), // Validates the value as a UUID
  ];

  // Configurations for an optional UUID property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsUUID(), // Validates the value as a UUID
  ];

  // Configurations for a required array of UUIDs
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsUUID(undefined, { each: true }), // Validates each element in the array as a UUID
  ];

  // Configurations for an optional array of UUIDs
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsUUID(undefined, { each: true }), // Validates each element in the array as a UUID
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required UUID property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional UUID property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of UUIDs
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of UUIDs
  }
}
