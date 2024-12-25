import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class secureApiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const secretPhrase = req.header('secret-api');
    const expectedSecretPhrase = 'secureApi';

    if (secretPhrase !== expectedSecretPhrase) {
      throw new UnauthorizedException('Invalid secret phrase');
    }

    next();
  }
}
