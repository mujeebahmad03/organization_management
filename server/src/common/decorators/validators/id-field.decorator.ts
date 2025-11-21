import { applyDecorators } from '@nestjs/common';
import { Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

/**
 * Decorator for ID field with validation
 * - Required integer
 * - Minimum value: 1
 */
export function IdField() {
  return applyDecorators(
    Field(() => Int),
    IsNotEmpty(),
    IsInt(),
    Min(1),
  );
}
