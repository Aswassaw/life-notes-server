import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './utils/variables/env.service';

async function bootstrap() {
  const envService = new EnvService();
  const app = await NestFactory.create(AppModule);
  await app.listen(envService.PORT);

  console.log(
    `Server started on port ${envService.PORT} with ${envService.NODE_ENV} environment`,
  );
  console.log(`Visit http://localhost:${envService.PORT}`);
  console.log('Developed by Andry Pebrianto');
}
bootstrap();
