import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { JwtAuthMiddleware } from 'src/middlewares/jwtauth/jwtauth.middleware';
import { EnvService } from 'src/services/variables/env.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService, EnvService, JwtService, PrismaService],
})
export class NoteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('note');
  }
}
