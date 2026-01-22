import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, ValidationOptions } from 'class-validator';

interface BooleanApiPropertyOptions {
  optional?: boolean;
  readOnly?: boolean;
  description?: string;
  example?: boolean;
  nullable?: boolean;
  validationOptions?: ValidationOptions;
}

export function BooleanApiProperty(options?: BooleanApiPropertyOptions) {
  const decorators: PropertyDecorator[] = [];

  if (!options?.readOnly) {
    decorators.push(IsBoolean(options?.validationOptions));
  }

  if (options?.readOnly || options?.optional) {
    decorators.push(IsOptional());
  }

  decorators.push(
    ApiProperty({
      type: Boolean,
      example: options?.example,
      description: options?.description,
      nullable: options?.nullable === true,
      required: !options?.readOnly && options?.optional !== true,
      readOnly: options?.readOnly,
    }),
  );

  return applyDecorators(...decorators);
}
