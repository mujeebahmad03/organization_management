import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseCoreEntity } from 'src/common/entities';

@Entity('users')
@ObjectType()
export class User extends BaseCoreEntity {
  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  password: string;
}
