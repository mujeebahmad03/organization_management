import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SubDepartmentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
