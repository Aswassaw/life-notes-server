import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EnvService } from 'src/services/variables/env.service';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { EmailService } from 'src/services/email/email.service';
import { TemplateService } from 'src/services/email/template.service';
import { JwtAuthMiddleware } from 'src/middlewares/jwtauth/jwtauth.middleware';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    BcryptService,
    JwtService,
    EnvService,
    EmailService,
    TemplateService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes({ path: '/auth/check', method: RequestMethod.GET });
  }
}
