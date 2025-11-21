import { InputType } from '@nestjs/graphql';
import { IdField, NameField } from 'src/common/decorators';

@InputType()
export class UpdateSubDepartmentInput {
  @IdField()
  id: number;

  @NameField()
  name: string;
}
