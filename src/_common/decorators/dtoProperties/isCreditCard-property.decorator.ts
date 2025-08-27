import { IsNotEmpty, IsOptional, IsCreditCard, IsArray } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsCreditCardPropertyDecorator
interface IsCreditCardPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  isArray?: boolean; // Indicates if the property is an array (default: false)
  example: string | string[]; // Example value for Swagger
}

// Custom decorator for validating credit card properties
export function IsCreditCardPropertyDecorator(options: IsCreditCardPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required credit card property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the value is not empty
    IsCreditCard(), // Validates the value as a credit card number
  ];

  // Configurations for an optional credit card property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    IsCreditCard(), // Validates the value as a credit card number
  ];

  // Configurations for a required array of credit card numbers
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    IsCreditCard({ each: true }), // Validates each element in the array as a credit card number
  ];

  // Configurations for an optional array of credit card numbers
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    IsCreditCard({ each: true }), // Validates each element in the array as a credit card number
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required credit card property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional credit card property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of credit card numbers
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of credit card numbers
  }
}
