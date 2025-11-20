import { Entity, Column } from 'typeorm';
import { BaseCoreEntity } from 'src/common/entities';

@Entity('users')
export class User extends BaseCoreEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
