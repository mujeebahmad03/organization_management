import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department, SubDepartment } from './entities';
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreateSubDepartmentInput,
  UpdateSubDepartmentInput,
} from './dto';
import { User } from 'src/modules/users/entities';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private readonly subDepartmentRepository: Repository<SubDepartment>,
  ) {}

  async create(input: CreateDepartmentInput, user: User): Promise<Department> {
    const department = this.departmentRepository.create({
      name: input.name,
      createdBy: user.id,
    });

    // If sub-departments are provided, create them
    if (input.subDepartments && input.subDepartments.length > 0) {
      const subDepartments = input.subDepartments.map((subDept) =>
        this.subDepartmentRepository.create({
          name: subDept.name,
        }),
      );
      department.subDepartments = subDepartments;
    } else {
      department.subDepartments = [];
    }

    return this.departmentRepository.save(department);
  }

  async findAll(user: User): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { createdBy: user.id },
      relations: ['subDepartments'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Department> {
    // Validate ID is positive
    if (!id || id < 1 || !Number.isInteger(id)) {
      throw new NotFoundException('Invalid department ID');
    }

    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(
    id: number,
    input: UpdateDepartmentInput,
    user: User,
  ): Promise<Department> {
    const department = await this.findOne(id);

    // Check if the current user is the creator
    if (department.createdBy !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this department',
      );
    }

    department.name = input.name;

    return this.departmentRepository.save(department);
  }

  async delete(id: number, user: User): Promise<boolean> {
    const department = await this.findOne(id);

    // Check if the current user is the creator
    if (department.createdBy !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this department',
      );
    }

    // Cascade delete will automatically delete sub-departments
    // due to onDelete: 'CASCADE' in SubDepartment entity
    await this.departmentRepository.remove(department);

    return true;
  }

  // Sub-Department CRUD methods
  async createSubDepartment(
    input: CreateSubDepartmentInput,
    user: User,
  ): Promise<SubDepartment> {
    // Verify department exists
    const department = await this.departmentRepository.findOne({
      where: { id: input.departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${input.departmentId} not found`,
      );
    }

    // Check if the current user is the creator of the parent department
    if (department.createdBy !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to create sub-departments for this department',
      );
    }

    const subDepartment = this.subDepartmentRepository.create({
      name: input.name,
      departmentId: input.departmentId,
    });

    return this.subDepartmentRepository.save(subDepartment);
  }

  async findAllSubDepartments(user: User): Promise<SubDepartment[]> {
    return this.subDepartmentRepository.find({
      relations: ['department'],
      where: {
        department: {
          createdBy: user.id,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async findSubDepartmentById(id: number): Promise<SubDepartment> {
    // Validate ID is positive
    if (!id || id < 1 || !Number.isInteger(id)) {
      throw new NotFoundException('Invalid sub-department ID');
    }

    const subDepartment = await this.subDepartmentRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!subDepartment) {
      throw new NotFoundException('Sub-department not found');
    }

    return subDepartment;
  }

  async updateSubDepartment(
    id: number,
    input: UpdateSubDepartmentInput,
    user: User,
  ): Promise<SubDepartment> {
    const subDepartment = await this.findSubDepartmentById(id);

    // Get the parent department to check ownership
    const department = await this.departmentRepository.findOne({
      where: { id: subDepartment.departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        `Parent department with ID ${subDepartment.departmentId} not found`,
      );
    }

    // Check if the current user is the creator of the parent department
    if (department.createdBy !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this sub-department',
      );
    }

    subDepartment.name = input.name;

    return this.subDepartmentRepository.save(subDepartment);
  }

  async deleteSubDepartment(id: number, user: User): Promise<boolean> {
    const subDepartment = await this.findSubDepartmentById(id);

    // Get the parent department to check ownership
    const department = await this.departmentRepository.findOne({
      where: { id: subDepartment.departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        `Parent department with ID ${subDepartment.departmentId} not found`,
      );
    }

    // Check if the current user is the creator of the parent department
    if (department.createdBy !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this sub-department',
      );
    }

    await this.subDepartmentRepository.remove(subDepartment);

    return true;
  }
}
