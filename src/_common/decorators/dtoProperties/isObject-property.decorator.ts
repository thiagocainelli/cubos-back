// Imports necessary decorators and utilities from NestJS, Swagger, class-validator, and class-transformer
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { applyDecorators } from '../../utils/applyDecorators';

// Defines options for the IsObjectPropertyDecorator
interface IsObjectPropertyOptions {
  description: string; // Description for Swagger documentation
  required: boolean; // Indicates if the property is required
  objectType: any; // The object type to validate
  isArray?: boolean; // Indicates if the property is an array (default: false)
}

// Custom decorator for validating object properties
export function IsObjectPropertyDecorator(options: IsObjectPropertyOptions) {
  options.isArray = options.isArray || false; // Defaults isArray to false if not provided

  // Configurations for a required object property
  const isNotEmptyConfigs = [
    IsNotEmpty(), // Ensures the object is not empty
    Type(() => options.objectType), // Transforms and validates the object type
    ValidateNested(), // Validates nested properties within the object
  ];

  // Configurations for an optional object property
  const isOptionalConfigs = [
    IsOptional(), // Allows the property to be optional
    Type(() => options.objectType), // Transforms and validates the object type
    ValidateNested(), // Validates nested properties within the object
  ];

  // Configurations for a required array of objects
  const isNotEmptyArrayConfigs = [
    IsNotEmpty(), // Ensures the array is not empty
    IsArray(), // Validates the property as an array
    Type(() => options.objectType), // Transforms and validates each object type
    ValidateNested({ each: true }), // Validates nested properties for each object in the array
  ];

  // Configurations for an optional array of objects
  const isOptionalArrayConfigs = [
    IsOptional(), // Allows the property to be optional
    IsArray(), // Validates the property as an array
    Type(() => options.objectType), // Transforms and validates each object type
    ValidateNested({ each: true }), // Validates nested properties for each object in the array
  ];

  // Applies the appropriate configurations based on the provided options
  if (options.required && !options.isArray) {
    return applyDecorators(...isNotEmptyConfigs); // For required object property
  } else if (!options.required && !options.isArray) {
    return applyDecorators(...isOptionalConfigs); // For optional object property
  } else if (options.required && options.isArray) {
    return applyDecorators(...isNotEmptyArrayConfigs); // For required array of objects
  } else {
    return applyDecorators(...isOptionalArrayConfigs); // For optional array of objects
  }
}
