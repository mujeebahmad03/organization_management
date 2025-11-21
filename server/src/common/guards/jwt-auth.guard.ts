import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';
import { GraphQLContext } from '../interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const contextType = context.getType<'graphql' | 'http' | 'rpc' | 'ws'>();

    // For REST endpoints, use standard HTTP request
    if (contextType === 'http') {
      return context.switchToHttp().getRequest<Request>();
    }

    // For GraphQL endpoints, extract from GraphQL context
    if (contextType === 'graphql') {
      try {
        const ctx = GqlExecutionContext.create(context);
        const graphqlContext = ctx.getContext<GraphQLContext>();
        return graphqlContext.req || context.switchToHttp().getRequest();
      } catch {
        // Fallback to HTTP if GraphQL context extraction fails
        return context.switchToHttp().getRequest<Request>();
      }
    }

    // Fallback for other context types
    return context.switchToHttp().getRequest<Request>();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
