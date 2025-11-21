import { InputType } from '@nestjs/graphql';
import { NameField } from 'src/common/decorators';

@InputType()
export class SubDepartmentInput {
  @NameField()
  name: string;
}
