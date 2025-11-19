import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): unknown => {
    const ctx = GqlExecutionContext.create(context);
    const graphqlContext = ctx.getContext<GraphQLContext>();
    return graphqlContext.req.user;
  },
);
