import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { decodeToken } from 'src/utils/tokenAuth';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Obtenir le contexte GraphQL
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    // Extraire l'utilisateur depuis la requête (déjà authentifié par GqlAuthGuard)
    const token = req.header('Authorization').split(' ')[1];
    const userRole = decodeToken(token).userRole;
    // Vérifier si l'utilisateur est admin
    if (token && userRole.includes('admin')) {
      return true;
    } else {
      throw new ForbiddenException('Access denied. Admins only.');
    }
  }
}
