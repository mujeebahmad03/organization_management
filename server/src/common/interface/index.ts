import { Request } from 'express';
import { User } from 'src/modules/users/entities';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface GraphQLContext {
  req: AuthenticatedRequest;
}
