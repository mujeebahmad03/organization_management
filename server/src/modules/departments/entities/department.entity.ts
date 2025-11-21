import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseCoreEntity } from 'src/common/entities';
import { User } from 'src/modules/users/entities';
import { SubDepartment } from './sub-department.entity';

@Entity('departments')
@ObjectType()
export class Department extends BaseCoreEntity {
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
