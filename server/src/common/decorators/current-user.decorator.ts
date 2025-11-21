import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../interface';
import { User } from 'src/modules/users/entities';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    const graphqlContext = ctx.getContext<GraphQLContext>();
    const user = graphqlContext.req.user;

    if (!user) {
      throw new UnauthorizedException(
        'Authentication required. Please provide a valid token.',
      );
    }

    return user as User;
  },
);
