import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const isGraphQL = context.getType<'graphql' | 'http'>() === 'graphql';

    let fieldName: string | undefined;
    if (isGraphQL) {
      try {
        const ctx = GqlExecutionContext.create(context);
        const info = ctx.getInfo<GraphQLResolveInfo>();
        fieldName = info?.fieldName;
      } catch {
        // Not a GraphQL context, ignore
      }
    } else {
      // For REST endpoints, use the handler name
      const handler = context.getHandler();
      fieldName = handler.name;
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        const logMessage = fieldName
          ? `${fieldName} - ${responseTime}ms`
          : `${responseTime}ms`;
        this.logger.log(logMessage, context.getClass().name);
      }),
    );
  }
}
