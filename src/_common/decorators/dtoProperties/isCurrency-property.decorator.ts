import { IsNotEmpty, IsOptional, IsCurrency, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsCurrencyPropertyDecorator
interface IsCurrencyPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: number | number[]; // Example value for Swagger
}

// Custom decorator for validating currency properties
export function IsCurrencyPropertyDecorator(options: IsCurrencyPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required currency property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsCurrency(), // Validates the value as a currency
  ];

  // Configurations for an optional currency property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsCurrency(), // Validates the value as a currency
  ];

  // Configurations for a required array of currency values
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsCurrency(undefined, { each: true }), // Validates each element in the array as a currency
  ];

  // Configurations for an optional array of currency values
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsCurrency(undefined, { each: true }), // Validates each element in the array as a currency
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required currency property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional currency property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of currency values
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of currency values
  }
}
