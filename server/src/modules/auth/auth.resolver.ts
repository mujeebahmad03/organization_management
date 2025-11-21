import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './services/auth.service';
import { RegisterInput, LoginInput, AuthResponse } from './dto';
import { Public } from 'src/common/decorators';
import type { GraphQLContext } from 'src/common/interface';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: GraphQLContext): Promise<boolean> {
    const authHeader = context.req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    return this.authService.logout(token);
  }
}
