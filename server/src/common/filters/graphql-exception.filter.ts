import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Response } from 'express';

/**
 * Hybrid exception filter that handles both GraphQL and REST exceptions
 * Only processes GraphQL errors in GraphQL context, otherwise passes through
 */
@Catch()
export class GraphQLExceptionFilter
  implements GqlExceptionFilter, ExceptionFilter
{
  catch(exception: unknown, host?: ArgumentsHost) {
    // If there's no host (GraphQL context via GqlExceptionFilter), handle as GraphQL error
    if (!host) {
      return this.handleGraphQLError(exception);
    }

    // Check if this is a GraphQL context
    try {
      const contextType = host.getType<'graphql' | 'http' | 'rpc' | 'ws'>();

      if (contextType === 'graphql') {
        return this.handleGraphQLError(exception);
      }

      // For REST context, handle as HTTP exception
      if (contextType === 'http') {
        return this.handleHttpError(exception, host);
      }
    } catch {
      // If we can't determine context type, assume GraphQL
      return this.handleGraphQLError(exception);
    }

    // Fallback to GraphQL error handling
    return this.handleGraphQLError(exception);
  }

  private handleGraphQLError(exception: unknown): GraphQLError {
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

  private handleHttpError(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Log the error for debugging
    console.error('HTTP Error:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const msg = (exceptionResponse as { message: string | string[] })
          .message;
        message = msg;
      }
    } else if (
      exception &&
      typeof exception === 'object' &&
      'message' in exception
    ) {
      message = String(exception.message);
      if ('status' in exception) {
        status = Number(exception.status) || status;
      }
    }

    // Send the HTTP response
    const errorMessage: string = Array.isArray(message)
      ? (message[0] ?? 'Internal server error')
      : message;

    // Get status name from HttpStatus enum
    const statusName =
      Object.keys(HttpStatus).find(
        (key) => HttpStatus[key as keyof typeof HttpStatus] === status,
      ) ?? 'Error';

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      error: statusName,
    });
  }
}
