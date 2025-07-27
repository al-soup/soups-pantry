import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidationOptions,
} from 'class-validator';

interface StringApiPropertyOptions {
  minLength?: number;
  maxLength?: number;
  optional?: boolean;
  enum?: object;
  description?: string;
  example?: string;
  nullable?: boolean;
  validationOptions?: ValidationOptions;
  nonEmpty?: boolean;
}

export function StringApiProperty(options?: StringApiPropertyOptions) {
  const decorators: PropertyDecorator[] = [];

  decorators.push(IsString(options?.validationOptions));

  if (options?.optional === true) {
    decorators.push(IsOptional());
  }

  if (options?.minLength) {
    decorators.push(MinLength(options.minLength, options?.validationOptions));
  }

  if (options?.maxLength) {
    decorators.push(MaxLength(options.maxLength, options?.validationOptions));
  }

  if (options?.enum) {
    decorators.push(IsEnum(options.enum, options?.validationOptions));
  }

  if (options?.nonEmpty === true) {
    decorators.push(IsNotEmpty(options?.validationOptions));
  }

  decorators.push(
    ApiProperty({
      example: options?.example,
      description: options?.description,
      nullable: options?.nullable === true,
      required: options?.optional !== true,
    }),
  );

  return applyDecorators(...decorators);
}
