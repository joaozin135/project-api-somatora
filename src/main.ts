import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDocumentationConfig } from './config/documentation.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  setupDocumentationConfig(app);
  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();
