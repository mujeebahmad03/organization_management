import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Department } from './department.entity';
import { BaseCoreEntity } from 'src/common/entities';

@Entity('sub_departments')
@ObjectType()
export class SubDepartment extends BaseCoreEntity {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => Number)
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.subDepartments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  @Field(() => Department, { nullable: true })
  department: Department;
}
