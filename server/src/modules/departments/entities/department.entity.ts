import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities';
import { SubDepartment } from './sub-department.entity';

@Entity('departments')
@ObjectType()
export class Department {
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
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => SubDepartment, (subDepartment) => subDepartment.department, {
    cascade: true,
  })
  @Field(() => [SubDepartment], { nullable: true })
  subDepartments: SubDepartment[];
}
