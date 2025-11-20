import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
