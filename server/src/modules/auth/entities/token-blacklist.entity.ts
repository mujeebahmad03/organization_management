import { Entity, Column, CreateDateColumn, Index } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@Entity('token_blacklist')
@ObjectType()
@Index(['token'], { unique: true })
@Index(['expiresAt'])
export class TokenBlacklist {
  @Column({ primary: true, type: 'varchar', length: 500 })
  @Field()
  token: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  @Field()
  expiresAt: Date;
}
