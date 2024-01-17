import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EnvService } from 'src/utils/variables/env.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    BcryptService,
    JwtService,
    EnvService,
  ],
})
export class AuthModule {}
