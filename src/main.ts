import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './utils/variables/env.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const envService = new EnvService();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(envService.PORT);

  console.log(`Server started on port ${envService.PORT}`);
  console.log(`Visit http://localhost:${envService.PORT}`);
  console.log('Developed by Andry Pebrianto');
}
bootstrap();
