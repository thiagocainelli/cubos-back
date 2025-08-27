import { IsNotEmpty, IsOptional, IsUrl, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsUrlPropertyDecorator
interface IsUrlPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating URL properties
export function IsUrlPropertyDecorator(options: IsUrlPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required URL property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsUrl(), // Validates the value as a URL
  ];

  // Configurations for an optional URL property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsUrl(), // Validates the value as a URL
  ];

  // Configurations for a required array of URLs
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsUrl(undefined, { each: true }), // Validates each element in the array as a URL
  ];

  // Configurations for an optional array of URLs
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsUrl(undefined, { each: true }), // Validates each element in the array as a URL
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required URL property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional URL property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of URLs
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of URLs
  }
}
