import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: unknown;
}

export interface GraphQLContext {
  req: AuthenticatedRequest;
}
