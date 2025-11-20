import { Resolver } from '@nestjs/graphql';
import { DepartmentsService } from './departments.service';

@Resolver()
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}
}
