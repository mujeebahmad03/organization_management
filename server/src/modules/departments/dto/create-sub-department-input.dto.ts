import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

@InputType()
export class CreateSubDepartmentInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  departmentId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
