import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseCoreEntity } from 'src/common/entities';
import { User } from 'src/modules/users/entities';
import { SubDepartment } from './sub-department.entity';

@Entity('departments')
export class Department extends BaseCoreEntity {
  @Column()
  name: string;

  @Column()
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => SubDepartment, (subDepartment) => subDepartment.department, {
    cascade: true,
  })
  subDepartments: SubDepartment[];
}
