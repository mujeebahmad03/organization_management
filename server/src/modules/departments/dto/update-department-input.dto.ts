import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

@InputType()
export class UpdateDepartmentInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
