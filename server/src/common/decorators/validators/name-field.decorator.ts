import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Decorator for department/sub-department name field with validation
 * - Required string
 * - Min length: 2 characters
 * - Max length: 100 characters
 * - Trims whitespace
 * - Allows only alphanumeric characters, spaces, hyphens, and underscores
 */
export function NameField() {
  return applyDecorators(
    Field(),
    IsNotEmpty(),
    IsString(),
    MinLength(2),
    MaxLength(100),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    Matches(/^[a-zA-Z0-9\s\-_]+$/, {
      message:
        'Name can only contain letters, numbers, spaces, hyphens, and underscores',
    }),
  );
}
