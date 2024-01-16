import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvService } from './utils/variables/env.service';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, EnvService],
})
export class AppModule {}
