import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Department } from './department.entity';

@Entity('sub_departments')
@ObjectType()
export class SubDepartment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

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
