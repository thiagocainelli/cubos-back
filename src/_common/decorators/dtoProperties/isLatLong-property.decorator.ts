import { IsNotEmpty, IsOptional, IsLatLong, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsLatLongPropertyDecorator
interface IsLatLongPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating latitude/longitude strings
export function IsLatLongPropertyDecorator(options: IsLatLongPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required lat/long property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsLatLong(), // Validates the value as a lat/long string
  ];

  // Configurations for an optional lat/long property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsLatLong(), // Validates the value as a lat/long string
  ];

  // Configurations for a required array of lat/long strings
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsLatLong({ each: true }), // Validates each element in the array as a lat/long string
  ];

  // Configurations for an optional array of lat/long strings
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsLatLong({ each: true }), // Validates each element in the array as a lat/long string
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required lat/long property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional lat/long property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of lat/long strings
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of lat/long strings
  }
}
