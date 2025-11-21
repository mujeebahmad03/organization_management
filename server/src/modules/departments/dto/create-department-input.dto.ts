import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NameField } from 'src/common/decorators';
import { SubDepartmentInput } from './sub-department-input.dto';

@InputType()
export class CreateDepartmentInput {
  @NameField()
  name: string;

  @Field(() => [SubDepartmentInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubDepartmentInput)
  subDepartments?: SubDepartmentInput[] | null;
}
