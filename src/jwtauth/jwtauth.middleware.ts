import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { EnvService } from 'src/services/variables/env.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error();
      }

      const token = authorizationHeader.split(' ')[1];
      const auth = this.jwtService.verify(token, {
        secret: this.envService.JWT_SECRET,
      });
      res.locals.auth = auth;
      next();
    } catch (error) {
      throw new UnauthorizedException('Access Token Invalid');
    }
  }
}
