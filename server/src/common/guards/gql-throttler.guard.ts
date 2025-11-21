import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GraphQLContext } from '../interface';
import { Request, Response } from 'express';

/**
 * Universal ThrottlerGuard that works with both REST and GraphQL endpoints
 * Extracts request/response from the appropriate context based on request type
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    const contextType = context.getType<'graphql' | 'http' | 'rpc' | 'ws'>();

    // For REST requests, use the standard HTTP request/response objects
    // This should be the most common case and should be handled first
    if (contextType === 'http') {
      try {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();
        const res = http.getResponse<Response>();

        if (!req || !res) {
          throw new Error(
            'Failed to extract request/response from HTTP context',
          );
        }

        return { req, res };
      } catch (error) {
        // If we can't get HTTP context, fall through to base implementation
        return super.getRequestResponse(context);
      }
    }

    // For GraphQL requests, extract from GraphQL context
    if (contextType === 'graphql') {
      try {
        const ctx = GqlExecutionContext.create(context);
        const graphqlContext = ctx.getContext<GraphQLContext>();
        const httpContext = context.switchToHttp();

        const req = (graphqlContext?.req ||
          httpContext.getRequest()) as Request;

        // Try to get response from GraphQL context first, then HTTP context
        let res: Response | undefined = graphqlContext?.res;

        if (!res || typeof res.header !== 'function') {
          try {
            res = httpContext.getResponse<Response>();
            // Verify it's a valid Express Response object
            if (res && typeof res.header === 'function') {
              return { req, res };
            }
          } catch {
            // Response not available in HTTP context either
          }
        } else {
          return { req, res };
        }

        // If we can't get a valid response, create a mock response object
        // that has the minimum methods needed by the throttler
        if (!res || typeof res.header !== 'function') {
          const mockRes = {
            header: () => mockRes,
            setHeader: () => mockRes,
            getHeader: () => undefined,
            statusCode: 200,
          } as unknown as Response;

          return { req, res: mockRes };
        }

        return { req, res };
      } catch (error) {
        // Fallback to base implementation if GraphQL extraction fails
        return super.getRequestResponse(context);
      }
    }

    // For other context types, use base implementation
    return super.getRequestResponse(context);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Ensure we have a valid request object
    if (!req) {
      return 'unknown';
    }

    try {
      const request = req as Request;

      // Try to get IP from various sources (supports proxy headers)
      // Express sets req.ip automatically if trust proxy is enabled
      if (request.ip) {
        return request.ip;
      }

      // Fallback to socket address
      if (request.socket?.remoteAddress) {
        return request.socket.remoteAddress;
      }

      // Check proxy headers
      const forwardedFor = request.headers['x-forwarded-for'];
      if (forwardedFor) {
        const ips = Array.isArray(forwardedFor)
          ? forwardedFor[0]
          : forwardedFor.split(',')[0];
        return ips?.trim() || 'unknown';
      }

      const realIp = request.headers['x-real-ip'];
      if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
      }

      return 'unknown';
    } catch (error) {
      // If anything fails, return unknown to prevent hanging
      return 'unknown';
    }
  }
}
