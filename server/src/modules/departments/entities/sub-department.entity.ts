import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { BaseCoreEntity } from 'src/common/entities';

@Entity('sub_departments')
export class SubDepartment extends BaseCoreEntity {
  @Column()
  name: string;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.subDepartments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
