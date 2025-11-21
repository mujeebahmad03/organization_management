import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department, SubDepartment } from './entities';
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreateSubDepartmentInput,
  UpdateSubDepartmentInput,
} from './dto';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/modules/users/entities';
import { JwtAuthGuard } from 'src/common/guards';

@Resolver(() => Department)
@UseGuards(JwtAuthGuard)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Mutation(() => Department)
  async createDepartment(
    @Args('input') input: CreateDepartmentInput,
    @CurrentUser() user: User,
  ): Promise<Department> {
    return this.departmentsService.create(input, user);
  }

  @Query(() => [Department], { name: 'getDepartments' })
  async getDepartments(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Query(() => Department, { name: 'getDepartment' })
  async getDepartment(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Mutation(() => Department)
  async updateDepartment(
    @Args('input') input: UpdateDepartmentInput,
    @CurrentUser() user: User,
  ): Promise<Department> {
    return this.departmentsService.update(input.id, input, user);
  }

  @Mutation(() => Boolean)
  async deleteDepartment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.departmentsService.delete(id, user);
  }

  // Sub-Department CRUD operations
  @Mutation(() => SubDepartment)
  async createSubDepartment(
    @Args('input') input: CreateSubDepartmentInput,
    @CurrentUser() user: User,
  ): Promise<SubDepartment> {
    return this.departmentsService.createSubDepartment(input, user);
  }

  @Query(() => [SubDepartment], { name: 'getSubDepartments' })
  async getSubDepartments(): Promise<SubDepartment[]> {
    return this.departmentsService.findAllSubDepartments();
  }

  @Query(() => SubDepartment, { name: 'getSubDepartment' })
  async getSubDepartment(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<SubDepartment> {
    return this.departmentsService.findSubDepartmentById(id);
  }

  @Mutation(() => SubDepartment)
  async updateSubDepartment(
    @Args('input') input: UpdateSubDepartmentInput,
    @CurrentUser() user: User,
  ): Promise<SubDepartment> {
    return this.departmentsService.updateSubDepartment(input.id, input, user);
  }

  @Mutation(() => Boolean)
  async deleteSubDepartment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.departmentsService.deleteSubDepartment(id, user);
  }
}
