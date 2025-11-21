import { InputType } from '@nestjs/graphql';
import { IdField, NameField } from 'src/common/decorators';

@InputType()
export class CreateSubDepartmentInput {
  @IdField()
  departmentId: number;

  @NameField()
  name: string;
}
