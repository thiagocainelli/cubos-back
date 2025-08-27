import { IsNotEmpty, IsOptional, IsIP, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsIPPropertyDecorator
interface IsIPPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating IP address properties
export function IsIPPropertyDecorator(options: IsIPPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required IP address property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsIP(), // Validates the value as an IP address
  ];

  // Configurations for an optional IP address property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsIP(), // Validates the value as an IP address
  ];

  // Configurations for a required array of IP addresses
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsIP(undefined, { each: true }), // Validates each element in the array as an IP address
  ];

  // Configurations for an optional array of IP addresses
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsIP(undefined, { each: true }), // Validates each element in the array as an IP address
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required IP address property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional IP address property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of IP addresses
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of IP addresses
  }
}
