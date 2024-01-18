import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apis/auth/auth.module';
import { NoteModule } from './apis/note/note.module';
import { EnvService } from './services/variables/env.service';

@Module({
  imports: [AuthModule, NoteModule],
  controllers: [AppController],
  providers: [AppService, EnvService],
})
export class AppModule {}
