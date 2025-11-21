import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GraphQLContext } from '../interface';

/**
 * GraphQL-compatible ThrottlerGuard
 * Extracts request from GraphQL context for proper rate limiting
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const graphqlContext = ctx.getContext<GraphQLContext>();
    return graphqlContext.req;
  }
}
