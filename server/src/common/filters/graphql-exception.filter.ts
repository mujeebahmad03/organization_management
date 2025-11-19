import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    // Log the error for debugging
    console.error('GraphQL Error:', exception);

    // If it's already a GraphQL error, return it as-is
    if (exception instanceof GraphQLError) {
      return exception;
    }

    // Transform NestJS exceptions to GraphQL errors
    const message =
      exception && typeof exception === 'object' && 'message' in exception
        ? String(exception.message)
        : 'Internal server error';

    const code =
      exception instanceof HttpException
        ? String(exception.getStatus())
        : exception && typeof exception === 'object' && 'status' in exception
          ? String(exception.status)
          : 'INTERNAL_SERVER_ERROR';

    return new GraphQLError(message, {
      extensions: {
        code,
      },
    });
  }
}
